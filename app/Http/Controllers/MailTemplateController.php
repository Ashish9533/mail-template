<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View;

class MailTemplateController extends Controller
{
    /**
     * Display the mail template builder
     */
    public function index(): View
    {
        return view('mail-template.builder');
    }

    /**
     * Save a mail template
     */
    public function save(Request $request): JsonResponse
    {
        try {
            // Log the incoming request for debugging
            \Log::info('Template save request received', [
                'method' => $request->method(),
                'headers' => $request->headers->all(),
                'input' => $request->input()
            ]);

            $request->validate([
                'name' => 'required|string|max:255',
                'html' => 'required|string',
                'css' => 'nullable|string',
                'config' => 'nullable|array',
                'category' => 'nullable|string|max:100',
                'description' => 'nullable|string|max:1000',
                'audience' => 'nullable|string|max:255',
                'subject' => 'nullable|string|max:255',
                'variables' => 'nullable|array'
            ]);

            // Save to database or file system
            $template = [
                'id' => uniqid(),
                'name' => $request->name,
                'html' => $request->html,
                'css' => $request->css,
                'config' => $request->config,
                'category' => $request->category ?? 'custom',
                'description' => $request->description,
                'audience' => $request->audience,
                'subject' => $request->subject,
                'variables' => $request->variables ?? [],
                'created_at' => now()->toISOString(),
                'updated_at' => now()->toISOString()
            ];

            // For now, save to storage as JSON (you can implement database later)
            $templates = $this->getStoredTemplates();
            $templates[] = $template;
            $this->saveTemplatesToStorage($templates);

            \Log::info('Template saved successfully', ['template_id' => $template['id']]);

            return response()->json([
                'success' => true,
                'message' => 'Template saved successfully',
                'template' => $template
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::warning('Template save validation failed', ['errors' => $e->errors()]);
            
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            \Log::error('Template save failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while saving the template: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Load all templates
     */
    public function templates(): JsonResponse
    {
        $templates = $this->getStoredTemplates();
        return response()->json($templates);
    }

    /**
     * Load a specific template
     */
    public function load(string $id): JsonResponse
    {
        $templates = $this->getStoredTemplates();
        $template = collect($templates)->firstWhere('id', $id);

        if (!$template) {
            return response()->json(['error' => 'Template not found'], 404);
        }

        return response()->json($template);
    }

    /**
     * Delete a template
     */
    public function delete(string $id): JsonResponse
    {
        $templates = $this->getStoredTemplates();
        $templates = array_filter($templates, fn($template) => $template['id'] !== $id);
        $this->saveTemplatesToStorage(array_values($templates));

        return response()->json(['success' => true, 'message' => 'Template deleted successfully']);
    }

    /**
     * Preview template
     */
    public function preview(Request $request): View
    {
        $html = $request->input('html', '');
        $css = $request->input('css', '');
        
        return view('mail-template.preview', compact('html', 'css'));
    }

    /**
     * Export template as HTML
     */
    public function export(Request $request)
    {
        $html = $request->input('html', '');
        $css = $request->input('css', '');
        $name = $request->input('name', 'mail-template');

        $fullHtml = "<!DOCTYPE html>
<html>
<head>
    <meta charset=\"UTF-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <title>{$name}</title>
    <style>{$css}</style>
</head>
<body>
{$html}
</body>
</html>";

        return response($fullHtml)
            ->header('Content-Type', 'text/html')
            ->header('Content-Disposition', "attachment; filename=\"{$name}.html\"");
    }

    /**
     * Get stored templates from file
     */
    private function getStoredTemplates(): array
    {
        $path = storage_path('app/mail-templates.json');
        if (!file_exists($path)) {
            return [];
        }
        return json_decode(file_get_contents($path), true) ?: [];
    }

    /**
     * Save templates to file
     */
    private function saveTemplatesToStorage(array $templates): void
    {
        $path = storage_path('app/mail-templates.json');
        file_put_contents($path, json_encode($templates, JSON_PRETTY_PRINT));
    }
} 