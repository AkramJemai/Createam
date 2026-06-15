<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Client;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
class ClientController extends Controller
{
    public function getAllClients(Request $request)
    {
        $query = Client::query();
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        $allowedSorts = ['name', 'email', 'address', 'industry', 'created_at', 'updated_at'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'created_at';
        }
        if (!in_array(strtolower($sortDir), ['asc', 'desc'])) {
            $sortDir = 'desc';
        }
        return $query->orderBy($sortBy, $sortDir)->get();
    }
    public function createClient(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'industry' => 'nullable|string|max:100',
            'logo' => 'nullable|image|max:2048',
        ]);
        if (empty($validated['latitude']) && empty($validated['longitude']) && !empty($validated['address'])) {
            $coords = $this->geocodeAddress($validated['address']);
            if ($coords) {
                $validated['latitude'] = $coords['lat'];
                $validated['longitude'] = $coords['lng'];
            }
        }
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $ext = $file->getClientOriginalExtension();
            $filename = Carbon::now()->format('YmdHis') . '.' . $ext;
            $path = $file->storeAs('clients', $filename, 'public');
            $validated['logo'] = $path;
        }
        $client = Client::create($validated);
        return response()->json($client, 201);
    }
    public function getClientById(Client $client)
    {
        return $client;
    }
    public function updateClient(Request $request, Client $client)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'address' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'industry' => 'nullable|string|max:100',
            'logo' => 'nullable|image|max:2048',
        ]);
        if (empty($validated['latitude']) && empty($validated['longitude']) && !empty($validated['address'])) {
            $coords = $this->geocodeAddress($validated['address']);
            if ($coords) {
                $validated['latitude'] = $coords['lat'];
                $validated['longitude'] = $coords['lng'];
            }
        }
        if ($request->hasFile('logo')) {
            if ($client->logo) {
                Storage::disk('public')->delete($client->logo);
            }
            $file = $request->file('logo');
            $ext = $file->getClientOriginalExtension();
            $filename = Carbon::now()->format('YmdHis') . '.' . $ext;
            $path = $file->storeAs('clients', $filename, 'public');
            $validated['logo'] = $path;
        }
        $client->update($validated);
        return response()->json($client);
    }
    public function deleteClient(Client $client)
    {
        if ($client->logo) {
            Storage::disk('public')->delete($client->logo);
        }
        $client->delete();
        return response()->json(null, 204);
    }
    private function geocodeAddress(?string $address): ?array
    {
        try {
            $fullAddress = trim($address ?? '');
            if (empty($fullAddress)) {
                return null;
            }
            $response = Http::get('https://nominatim.openstreetmap.org/search', [
                'q' => $fullAddress,
                'format' => 'json',
                'limit' => 1,
                'addressdetails' => 0,
            ]);
            if ($response->successful() && $response->json()) {
                $result = $response->json()[0];
                return [
                    'lat' => (float) $result['lat'],
                    'lng' => (float) $result['lon'],
                ];
            }
        } catch (\Exception $e) {
            Log::warning('Geocoding failed: ' . $e->getMessage());
        }
        return null;
    }
}
