<?php
namespace App\Http\Controllers;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Throwable;
class AIController extends Controller
{
    public function generatePrompt(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string',
            'category' => 'required|string',
            'style' => 'required|string',
            'mood' => 'nullable|string',
            'lighting' => 'nullable|string',
            'rendering' => 'nullable|string',
        ]);
        $inputs = array_merge($validated, [
            'mood' => $validated['mood'] ?? 'balanced',
            'lighting' => $validated['lighting'] ?? 'cinematic',
            'rendering' => $validated['rendering'] ?? '8k resolution',
        ]);
        try {
            $prompt = app(GeminiService::class)->generatePrompt($inputs);
        } catch (Throwable $exception) {
            report($exception);
            return response()->json([
                'message' => 'Prompt generation failed. Please try again.',
                'copy_ready' => false
            ], 502);
        }
        return response()->json([
            'prompt' => $prompt,
            'copy_ready' => true
        ]);
    }
    public function summarizeNearby(Request $request)
    {
        $request->validate([
            'partnerships' => 'required|array',
            'city' => 'nullable|string'
        ]);
        $partnerships = $request->partnerships;
        $count = count($partnerships);
        $city = $request->get('city', 'your area');
        if ($count === 0) {
            return response()->json([
                'summary' => "There are no active partnerships detected in {$city} at the moment. This might be a great opportunity to be a pioneer in this region!"
            ]);
        }
        $categories = array_count_values(array_column($partnerships, 'cat'));
        arsort($categories);
        $topCategory = key($categories);
        $years = array_column($partnerships, 'year');
        $isRecent = in_array(date('Y'), $years) || in_array(date('Y', strtotime('-1 year')), $years);
        $summary = "You have {$count} partnership" . ($count > 1 ? 's' : '') . " within reach in {$city}. ";
        $summary .= "The local ecosystem seems strong in the " . strtolower($topCategory) . " sector. ";
        if ($isRecent) {
            $summary .= "We've noticed recent activity here, indicating a growing market presence.";
        } else {
            $summary .= "These established connections provide a solid foundation for future collaborations.";
        }
        return response()->json([
            'summary' => $summary,
            'insights' => [
                'count' => $count,
                'top_sector' => $topCategory,
                'is_recent' => $isRecent
            ]
        ]);
    }
}
