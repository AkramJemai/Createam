<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Task;
use App\Models\Notification;
use App\Models\User;

class TaskController extends Controller
{
    public function getAllTasks(Request $request)
    {
        $query = Task::with(['meeting', 'assigned_user']);

        if ($request->has('meeting_id')) {
            $query->where('meeting_id', $request->meeting_id);
        }

        if ($request->has('user_id')) {
            $query->where('assigned_to', $request->user_id);
        } elseif ($request->user()->role === 'member') {
            $query->where('assigned_to', $request->user()->id);
        }

        return response()->json($query->latest()->get());
    }

    public function createTask(Request $request)
    {
        if ($request->user()->role === 'member') {
            return response()->json(['message' => 'Unauthorized: Members cannot create tasks'], 403);
        }

        $validated = $request->validate([
            'meeting_id' => 'required|exists:meetings,id',
            'assigned_to' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,in_progress,done',
            'progress' => 'nullable|integer|min:0|max:100',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date',
        ]);

        $task = Task::create($validated);
        $task->load('meeting');

        Notification::create([
            'user_id' => $task->assigned_to,
            'title' => 'New Task Assigned',
            'message' => "You have been assigned a new task: {$task->title} in Project: {$task->meeting->title}",
            'type' => 'task_assigned',
            'data' => [
                'task_id' => $task->id,
                'project_id' => $task->meeting_id
            ]
        ]);

        return response()->json($task->load(['meeting', 'assigned_user']), 201);
    }

    public function getTaskById(Task $task)
    {
        return response()->json($task->load(['meeting', 'assigned_user']));
    }

    public function updateTask(Request $request, Task $task)
    {
        if ($request->user()->role === 'member' && $task->assigned_to !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized: Cannot update other members tasks'], 403);
        }

        $validated = $request->validate([
            'assigned_to' => 'sometimes|exists:users,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:todo,in_progress,done',
            'progress' => 'sometimes|integer|min:0|max:100',
            'priority' => 'sometimes|in:low,medium,high',
            'due_date' => 'nullable|date',
        ]);

        if ($request->status === 'done') {
            $validated['progress'] = 100;
        }

        $task->update($validated);

        if ($task->status === 'done') {
            $remainingTasks = Task::where('meeting_id', $task->meeting_id)
                ->where('status', '!=', 'done')
                ->count();

            if ($remainingTasks === 0) {
                $task->load('meeting');
                $admins = User::where('role', 'admin')->get();
                foreach ($admins as $admin) {
                    Notification::create([
                        'user_id' => $admin->id,
                        'title' => 'Project Ready for Posting',
                        'message' => "All production tasks for Project: {$task->meeting->title} have been completed.",
                        'type' => 'project_complete',
                        'data' => [
                            'project_id' => $task->meeting_id,
                            'project_title' => $task->meeting->title
                        ]
                    ]);
                }
            }
        }

        return response()->json($task->load(['meeting', 'assigned_user']));
    }

    public function deleteTask(Task $task)
    {
        if (request()->user()->role === 'member') {
            return response()->json(['message' => 'Unauthorized: Members cannot delete tasks'], 403);
        }
        $task->delete();
        return response()->json(null, 204);
    }
}
