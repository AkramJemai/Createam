<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\JobTitle;
class JobController extends Controller
{
    public function getAllJobTitles()
    {
        return response()->json(JobTitle::all());
    }
    public function createJobTitle(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
        ]);
        $title = JobTitle::create($validated);
        return response()->json($title, 201);
    }
    public function updateJobTitle(Request $request, JobTitle $jobTitle)
    {
        $validated = $request->validate([
            'name' => 'required|string',
        ]);
        $jobTitle->update($validated);
        return response()->json($jobTitle);
    }
    public function deleteJobTitle(JobTitle $jobTitle)
    {
        $jobTitle->delete();
        return response()->json(null, 204);
    }
}
