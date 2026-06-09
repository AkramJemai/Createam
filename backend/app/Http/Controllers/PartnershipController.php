<?php

namespace App\Http\Controllers;

use App\Models\Partnership;
use App\Models\PartnershipCategory;
use App\Models\Client;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class PartnershipController extends Controller
{
    public function getAllPartnerships(Request $request)
    {
        $threeMonthsAgo = now()->subMonths(3);

        $partnerships = Partnership::all()->map(function ($p) use ($threeMonthsAgo) {
            $p->recent_clicks = $p->clickLogs()
                ->where('created_at', '>=', $threeMonthsAgo)
                ->count();
            return $p;
        });

        return response()->json($partnerships);
    }

    public function getPartnershipsByClient(Client $client)
    {
        return response()->json($client->partnerships()->latest()->get());
    }

    public function getPartnershipById(Partnership $partnership)
    {
        return response()->json($partnership);
    }

    public function createPartnership(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'client_id' => 'nullable|exists:clients,id',
            'cat' => 'required|string',
            'tags' => 'required|string',
            'img' => 'required_without:video|nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'video' => 'required_without:img|nullable|file|mimes:mp4,webm,ogg,quicktime|max:51200',
            'year' => 'required|string',
            'month' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        if ($request->hasFile('img')) {
            $file = $request->file('img');
            $ext = $file->getClientOriginalExtension();
            $filename = Carbon::now()->format('YmdHis') . '.' . $ext;
            $path = $file->storeAs('uploads/partnerships', $filename, 'public');
            $validated['img'] = $path;
        }

        if ($request->hasFile('video')) {
            $file = $request->file('video');
            $ext = $file->getClientOriginalExtension();
            $filename = Carbon::now()->format('YmdHis') . '.' . $ext;
            $videoPath = $file->storeAs('uploads/partnerships/videos', $filename, 'public');
            $validated['video'] = $videoPath;
        }

        $partnership = Partnership::create($validated);
        return response()->json($partnership, 201);
    }

    public function updatePartnership(Request $request, Partnership $partnership)
    {
        $rules = [
            'title' => 'sometimes|required|string',
            'client_id' => 'sometimes|nullable|exists:clients,id',
            'cat' => 'sometimes|required|string',
            'tags' => 'sometimes|required|string',
            'year' => 'sometimes|required|string',
            'month' => 'sometimes|nullable|string',
            'status' => 'sometimes|required|string',
            'description' => 'nullable|string',
        ];

        if ($request->hasFile('img')) {
            $rules['img'] = 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048';
        } else {
            $rules['img'] = 'nullable|string';
        }

        if ($request->hasFile('video')) {
            $rules['video'] = 'nullable|file|mimes:mp4,webm,ogg,quicktime|max:51200';
        } else {
            $rules['video'] = 'nullable|string';
        }

        $validated = $request->validate($rules);

        $willHaveImg = ($request->hasFile('img')) || ($partnership->img && ($request->input('removeImg') !== 'true' && $request->input('removeImg') !== true));
        $willHaveVideo = ($request->hasFile('video')) || ($partnership->video && ($request->input('removeVideo') !== 'true' && $request->input('removeVideo') !== true));

        if (!$willHaveImg && !$willHaveVideo) {
            return response()->json(['message' => 'At least one media item (image or video) is required.'], 422);
        }

        if ($request->hasFile('img')) {
            $file = $request->file('img');
            $ext = $file->getClientOriginalExtension();
            $filename = Carbon::now()->format('YmdHis') . '.' . $ext;
            $path = $file->storeAs('uploads/partnerships', $filename, 'public');
            $validated['img'] = $path;
        } else {
            if ($request->input('removeImg') === 'true' || $request->input('removeImg') === true) {
                $validated['img'] = null;
            } else {
                unset($validated['img']);
            }
        }

        if ($request->hasFile('video')) {
            $file = $request->file('video');
            $ext = $file->getClientOriginalExtension();
            $filename = Carbon::now()->format('YmdHis') . '.' . $ext;
            $videoPath = $file->storeAs('uploads/partnerships/videos', $filename, 'public');
            $validated['video'] = $videoPath;
        } else {
            if ($request->input('removeVideo') === 'true' || $request->input('removeVideo') === true) {
                $validated['video'] = null;
            } else {
                unset($validated['video']);
            }
        }

        $partnership->update($validated);
        return response()->json($partnership);
    }

    public function deletePartnership(Partnership $partnership)
    {
        $partnership->delete();
        return response()->json(null, 204);
    }

    public function getNearbyPartnerships(Request $request)
    {
        $request->validate([
            'lat' => 'required|numeric|between:-90,90',
            'lng' => 'required|numeric|between:-180,180',
            'radius' => 'nullable|numeric|min:1',
        ]);

        $lat = $request->lat;
        $lng = $request->lng;
        $radius = $request->get('radius', 50);

        $partnerships = Partnership::with('client')
            ->leftJoin('clients', 'partnerships.client_id', '=', 'clients.id')
            ->select('partnerships.*')
            ->selectRaw(
                "(6371 * acos(cos(radians(?)) * cos(radians(clients.latitude)) * cos(radians(clients.longitude) - radians(?)) + sin(radians(?)) * sin(radians(clients.latitude)))) AS distance",
                [$lat, $lng, $lat]
            )
            ->whereNotNull('clients.latitude')
            ->whereNotNull('clients.longitude')
            ->get();

        return response()->json($partnerships);
    }

    private function geocodeAddress(?string $address, ?string $city = null, ?string $country = null): ?array
    {
        try {
            $fullAddress = trim(implode(', ', array_filter([$address, $city, $country])));
            if (empty($fullAddress)) {
                return null;
            }

            $response = \Illuminate\Support\Facades\Http::get('https://nominatim.openstreetmap.org/search', [
                'q' => $fullAddress,
                'format' => 'json',
                'limit' => 1,
            ]);

            if ($response->successful() && !empty($response->json())) {
                $result = $response->json()[0];
                return [
                    'lat' => (float) $result['lat'],
                    'lng' => (float) $result['lon'],
                ];
            }
        } catch (\Exception $e) {
            Log::warning('Geocoding failed for partnership: ' . $e->getMessage());
        }

        return null;
    }

    public function trackPartnershipClick(Partnership $partnership)
    {
        $partnership->increment('clicks');
        $partnership->clickLogs()->create();
        return response()->json(['clicks' => $partnership->fresh()->clicks]);
    }

    public function getTopClickedPartnershipsInPeriod()
    {
        $threeMonthsAgo = now()->subMonths(3);

        $topPartnerships = Partnership::select('partnerships.*')
            ->selectRaw('COUNT(partnership_clicks.id) as click_count')
            ->leftJoin('partnership_clicks', function ($join) use ($threeMonthsAgo) {
                $join->on('partnerships.id', '=', 'partnership_clicks.partnership_id')
                    ->where('partnership_clicks.created_at', '>=', $threeMonthsAgo);
            })
            ->groupBy('partnerships.id')
            ->orderByDesc('click_count')
            ->limit(3)
            ->get()
            ->map(function ($partnership) {
                $partnership->clicks = (int) $partnership->click_count;
                return $partnership;
            });

        return response()->json($topPartnerships);
    }

    public function getAllCategories()
    {
        return response()->json(PartnershipCategory::all());
    }

    public function createCategory(Request $request)
    {
        $validated = $request->validate(['name' => 'required|string|unique:partnership_categories']);
        return response()->json(PartnershipCategory::create($validated), 201);
    }

    public function updateCategory(Request $request, PartnershipCategory $category)
    {
        $validated = $request->validate(['name' => 'required|string|unique:partnership_categories,name,' . $category->id]);
        $category->update($validated);
        return response()->json($category);
    }

    public function deleteCategory(PartnershipCategory $category)
    {
        $category->delete();
        return response()->json(null, 204);
    }
}
