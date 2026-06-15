<?php
namespace App\Http\Controllers;
use App\Models\Invitation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Mail\InvitationMail;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
class InvitationController extends Controller
{
    public function sendInvitation(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'role' => 'required|in:admin,chef,member',
            'job_title' => 'nullable|string|max:255',
        ]);
        if (User::where('email', $request->email)->exists()) {
            return response()->json(['message' => 'This email already has an active account.'], 422);
        }
        $wasResent = Invitation::where('email', $request->email)->exists();
        Invitation::where('email', $request->email)->delete();
        $currentUser = $request->user();
        if ($currentUser->role === 'admin' && $request->role !== 'chef') {
            return response()->json(['message' => 'Administrators can only invite Project Managers'], 403);
        }
        if ($currentUser->role === 'chef' && $request->role !== 'member') {
            return response()->json(['message' => 'Project Managers can only invite Team Members'], 403);
        }
        if ($currentUser->role === 'member') {
            return response()->json(['message' => 'Unauthorized role'], 403);
        }
        $token = Str::random(40);
        $expiresAt = Carbon::now()->addHours(48);
        try {
            $invitation = Invitation::create([
                'email' => $request->email,
                'role' => $request->role,
                'job_title' => $request->job_title,
                'token' => $token,
                'expires_at' => $expiresAt,
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Invitation Store Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create invitation'], 500);
        }
        $inviteLink = 'http://localhost:3000/join?token=' . $token;
        try {
            Mail::to($request->email)->send(new InvitationMail($invitation, $inviteLink));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Mail Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Invitation recorded in system, but email failed to send. Link: ' . $inviteLink,
                'status' => 'warning',
                'invite_link' => $inviteLink
            ], 200);
        }
        return response()->json([
            'message' => $wasResent
                ? 'Invitation link has been refreshed and resent to ' . $request->email
                : 'Invitation sent successfully to ' . $request->email,
            'invitation' => $invitation,
            'invite_link' => $inviteLink
        ]);
    }
    public function validateInvitationToken(string $token)
    {
        try {
            $invitation = Invitation::where('token', $token)->first();
            if (!$invitation || $invitation->expires_at->isPast() || $invitation->accepted_at) {
                return response()->json(['message' => 'Invalid or expired invitation'], 404);
            }
            return response()->json($invitation);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Validate Token Error: ' . $e->getMessage());
            return response()->json(['message' => 'Token validation failed'], 500);
        }
    }
    public function acceptInvitation(Request $request)
    {
        try {
            $request->validate([
                'token' => 'required',
                'name' => 'required|string|max:255',
                'password' => 'required|string|min:8|confirmed',
            ]);
            $invitation = Invitation::where('token', $request->token)->first();
            if (!$invitation) {
                return response()->json(['message' => 'Invalid invitation token'], 404);
            }
            if ($invitation->expires_at->isPast() || $invitation->accepted_at) {
                return response()->json(['message' => 'Invalid or expired invitation'], 404);
            }
            $user = User::create([
                'name' => $request->name,
                'email' => $invitation->email,
                'password' => Hash::make($request->password),
                'role' => $invitation->role,
                'job_title' => $invitation->job_title,
            ]);
            $invitation->update([
                'accepted_at' => Carbon::now()
            ]);
            return response()->json([
                'message' => 'Account created successfully',
                'user' => $user,
                'token' => $user->createToken('auth_token')->plainTextToken
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Accept Invitation Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create account'], 500);
        }
    }
    public function getAllInvitations()
    {
        return response()->json(Invitation::latest()->get());
    }
    public function deleteInvitation(Invitation $invitation)
    {
        $invitation->delete();
        return response()->json(null, 204);
    }
}
