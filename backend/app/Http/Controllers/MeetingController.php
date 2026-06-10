<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\Notification;
use Illuminate\Http\Request;

class MeetingController extends Controller
{
    public function getAllMeetings(Request $request)
    {
        $user = $request->user();
        $query = Meeting::with(['chef', 'creator'])->latest();

        if ($user->role === 'chef') {
            $query->where('chef_id', $user->id);
        }

        return response()->json($query->get());
    }

    public function createMeeting(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'client_name' => 'required|string|max:255',
            'meeting_date' => 'required|date',
            'notes' => 'required|string',
            'chef_id' => 'required|exists:users,id',
        ]);

        $meeting = Meeting::create([
            'title' => $validated['title'],
            'client_name' => $validated['client_name'],
            'meeting_date' => $validated['meeting_date'],
            'notes' => $validated['notes'],
            'chef_id' => $validated['chef_id'],
            'created_by' => $request->user()->id,
        ]);

        Notification::create([
            'user_id' => $validated['chef_id'],
            'title' => 'New Meeting Assigned',
            'message' => "An Admin assigned you a new meeting: {$validated['title']} for client {$validated['client_name']}.",
            'type' => 'meeting_assigned',
            'data' => [
                'meeting_id' => $meeting->id,
                'client_name' => $validated['client_name'],
            ]
        ]);

        return response()->json($meeting, 201);
    }

    public function getMeetingById(Meeting $meeting)
    {
        return response()->json($meeting->load(['chef', 'creator']));
    }

    public function updateMeeting(Request $request, Meeting $meeting)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'client_name' => 'sometimes|string|max:255',
            'meeting_date' => 'sometimes|date',
            'notes' => 'sometimes|string',
            'chef_id' => 'sometimes|exists:users,id',
        ]);

        $meeting->update($validated);

        return response()->json($meeting);
    }

    public function deleteMeeting(Meeting $meeting)
    {
        $meeting->delete();
        return response()->json(null, 204);
    }

    public function convertToProject(Meeting $meeting)
    {
        $meeting->update(['is_project' => true]);
        return response()->json($meeting->load(['chef', 'creator']));
    }
}
