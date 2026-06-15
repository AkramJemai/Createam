<?php
namespace App\Services;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Exception\RequestException;
use RuntimeException;
class GeminiService
{
    private Client $client;
    private string $apiKey;
    private string $model;
    private string $endpoint;
    public function __construct(?Client $client = null)
    {
        $this->apiKey = (string) config('services.gemini.api_key');
        $this->model = (string) config('services.gemini.model');
        $this->endpoint = (string) config('services.gemini.endpoint');
        $this->client = $client ?: new Client([
            'timeout' => 30,
            'connect_timeout' => 10,
        ]);
    }
    public function generatePrompt(array $inputs): string
    {
        if ($this->apiKey === '') {
            throw new RuntimeException('Gemini API key is not configured.');
        }
        if ($this->model === '') {
            throw new RuntimeException('Gemini model is not configured.');
        }
        $payload = [
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [
                        ['text' => $this->buildInstruction($inputs)],
                    ],
                ],
            ],
            'generationConfig' => [
                'temperature' => 0.8,
                'topP' => 0.95,
                'maxOutputTokens' => 1024,
            ],
        ];
        try {
            $response = $this->client->post($this->endpoint, [
                'json' => $payload,
                'headers' => [
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                    'x-goog-api-key' => $this->apiKey,
                ],
            ]);
        } catch (RequestException $exception) {
            throw new RuntimeException($this->extractRequestError($exception), 0, $exception);
        } catch (GuzzleException $exception) {
            throw new RuntimeException('Unable to reach Gemini. Please try again.', 0, $exception);
        }
        $data = json_decode((string) $response->getBody(), true);
        $prompt = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;
        if (! is_string($prompt) || trim($prompt) === '') {
            throw new RuntimeException('Gemini returned an empty prompt.');
        }
        return trim($prompt);
    }
    private function buildInstruction(array $inputs): string
    {
        return implode("\n", [
            'Create one long, polished, copy-ready image generation prompt.',
            'Return only the final prompt text. Do not include markdown, labels, explanations, alternatives, or quotation marks.',
            'Make it professional, specific, vivid, and suitable for high-end commercial visual generation.',
            'The prompt should be one detailed paragraph of 90 to 140 words.',
            'Include the subject, category, style, mood, lighting, rendering quality, composition, materials or textures, camera/viewpoint, depth, color palette, atmosphere, and premium production details.',
            'Preserve the user inputs exactly as creative anchors, then enrich them with cinematic and commercial art-direction language.',
            'Use details like unreal engine 5 render, highly detailed textures, masterwork, 8k, photorealistic quality, harmonized color palette, and refined professional finish when they fit naturally.',
            'Avoid vague filler. Every phrase should improve the final image prompt.',
            '',
            'Input details:',
            'Subject: ' . $inputs['subject'],
            'Category: ' . $inputs['category'],
            'Style: ' . $inputs['style'],
            'Mood: ' . $inputs['mood'],
            'Lighting: ' . $inputs['lighting'],
            'Rendering: ' . $inputs['rendering'],
        ]);
    }
    private function extractRequestError(RequestException $exception): string
    {
        $response = $exception->getResponse();
        if ($response === null) {
            return 'Unable to reach Gemini. Please try again.';
        }
        $data = json_decode((string) $response->getBody(), true);
        $message = $data['error']['message'] ?? null;
        if (is_string($message) && $message !== '') {
            return 'Gemini request failed: ' . $message;
        }
        return 'Gemini request failed. Please try again.';
    }
}
