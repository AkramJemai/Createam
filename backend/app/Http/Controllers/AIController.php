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
}
