<?php
namespace App\Http\Controllers;
use App\Models\AgencyInfo;
use App\Models\AgencyTimeline;
use App\Models\AgencyTeam;
use App\Models\AgencyStat;
use Illuminate\Http\Request;
use Carbon\Carbon;
class AgencyController extends Controller
{
    public function getAgencyData()
    {
        $agencyData = [
            'info' => AgencyInfo::first(),
            'timeline' => AgencyTimeline::orderBy('year')->get(),
            'team' => AgencyTeam::all(),
            'stats' => AgencyStat::all(),
        ];
        return response()->json($agencyData);
    }
    public function updateAgencyInfo(Request $request)
    {
        $validated = $request->validate([
            'tagline' => 'required|string',
            'about_text' => 'required|string',
            'founded_year' => 'required|integer',
        ]);
        $info = AgencyInfo::first() ?: new AgencyInfo();
        $info->fill($validated);
        $info->save();
        return response()->json($info);
    }
    public function createAgencyStat(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|string',
            'value' => 'required|string',
        ]);
        return response()->json(AgencyStat::create($validated), 201);
    }
    public function deleteAgencyStat(AgencyStat $stat)
    {
        $stat->delete();
        return response()->json(null, 204);
    }
    public function createAgencyTimeline(Request $request)
    {
        $validated = $request->validate([
            'year' => 'required|integer',
            'title' => 'required|string',
            'description' => 'required|string',
        ]);
        return response()->json(AgencyTimeline::create($validated), 201);
    }
    public function deleteAgencyTimeline(AgencyTimeline $timeline)
    {
        $timeline->delete();
        return response()->json(null, 204);
    }
    public function createAgencyTeamMember(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'role' => 'required|string',
            'photo' => 'nullable|image|max:2048'
        ]);
        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $ext = $file->getClientOriginalExtension();
            $filename = Carbon::now()->format('YmdHis') . '.' . $ext;
            $path = $file->storeAs('uploads/team', $filename, 'public');
            $validated['photo'] = $path;
        }
        return response()->json(AgencyTeam::create($validated), 201);
    }
    public function deleteAgencyTeamMember(AgencyTeam $member)
    {
        $member->delete();
        return response()->json(null, 204);
    }
}
