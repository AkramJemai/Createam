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
        $query = Task::with(['partnership', 'assigned_user']);

        if ($request->has('partnership_id')) {
            $query->where('partnership_id', $request->partnership_id);
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
            'partnership_id' => 'required|exists:partnerships,id',
            'assigned_to' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,in_progress,done',
            'progress' => 'nullable|integer|min:0|max:100',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date',
        ]);

        $task = Task::create($validated);

        Notification::create([
            'user_id' => $task->assigned_to,
            'title' => 'New Task Assigned',
            'message' => "You have been assigned a new task: {$task->title} in Project: {$task->partnership->title}",
            'type' => 'task_assigned',
            'data' => [
                'task_id' => $task->id,
                'project_id' => $task->partnership_id
            ]
        ]);

        return response()->json($task->load(['partnership', 'assigned_user']), 201);
    }

    public function getTaskById(Task $task)
    {
        return response()->json($task->load(['partnership', 'assigned_user']));
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
            $remainingTasks = Task::where('partnership_id', $task->partnership_id)
                ->where('status', '!=', 'done')
                ->count();

            if ($remainingTasks === 0) {
                $admins = User::where('role', 'admin')->get();
                foreach ($admins as $admin) {
                    Notification::create([
                        'user_id' => $admin->id,
                        'title' => 'Project Ready for Posting',
                        'message' => "All production tasks for Project: {$task->partnership->title} have been completed. You can now finalize and post the project.",
                        'type' => 'project_complete',
                        'data' => [
                            'project_id' => $task->partnership_id,
                            'project_title' => $task->partnership->title
                        ]
                    ]);
                }
            }
        }

        return response()->json($task->load(['partnership', 'assigned_user']));
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
