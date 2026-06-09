<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    public function sendPasswordResetLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $genericMessage = 'If an account with that email exists, we have sent a password reset link.';

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => $genericMessage]);
        }

        Password::broker()->sendResetLink($request->only('email'));

        return response()->json(['message' => $genericMessage]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Your email doesn\'t exist in our database'], 400);
        }

        $status = Password::broker()->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Your password has been reset!']);
        }

        return response()->json(['message' => 'Invalid or expired reset token.'], 400);
    }
}
