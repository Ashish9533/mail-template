<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\MailTemplateService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class MailTemplateController extends Controller
{
    protected $mailTemplateService;

    public function __construct(MailTemplateService $mailTemplateService)
    {
        $this->mailTemplateService = $mailTemplateService;
    }

    /**
     * Display the mail template dashboard
     */
    public function dashboard()
    {
        $stats = $this->mailTemplateService->getTemplateStats();
        $templates = $this->mailTemplateService->getTemplatesList();
        
        return view('mail-template.dashboard', compact('stats', 'templates'));
    }

    /**
     * Display the mail template builder
     */
    public function builder(Request $request)
    {
        $templateName = $request->get('template', '');
        $templateId = $request->get('id');
        
        $template = null;
        if ($templateId) {
            $template = $this->mailTemplateService->getTemplate($templateId);
        }
        
        return view('mail-template.builder', compact('templateName', 'template'));
    }

    /**
     * Get all templates
     */
    public function index(): JsonResponse
    {
        $templates = $this->mailTemplateService->getTemplatesList();
        return response()->json($templates);
    }

    /**
     * Get specific template
     */
    public function show(string $id): JsonResponse
    {
        $template = $this->mailTemplateService->getTemplate($id);
        
        if (!$template) {
            return response()->json(['error' => 'Template not found'], 404);
        }
        
        return response()->json($template);
    }

    /**
     * Save template
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'html' => 'required|string',
            'css' => 'nullable|string',
            'variables' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $templates = $this->getStoredTemplates();
        
        $template = [
            'id' => uniqid('tpl_'),
            'name' => $request->name,
            'html' => $request->html,
            'css' => $request->css ?? '',
            'variables' => $request->variables ?? [],
            'created_at' => now()->toISOString(),
            'updated_at' => now()->toISOString()
        ];

        $templates[] = $template;
        $this->saveTemplates($templates);

        return response()->json(['message' => 'Template saved successfully', 'template' => $template]);
    }

    /**
     * Update template
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'html' => 'required|string',
            'css' => 'nullable|string',
            'variables' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $templates = $this->getStoredTemplates();
        $templateIndex = collect($templates)->search(function ($template) use ($id) {
            return $template['id'] === $id;
        });

        if ($templateIndex === false) {
            return response()->json(['error' => 'Template not found'], 404);
        }

        $templates[$templateIndex] = array_merge($templates[$templateIndex], [
            'name' => $request->name,
            'html' => $request->html,
            'css' => $request->css ?? '',
            'variables' => $request->variables ?? [],
            'updated_at' => now()->toISOString()
        ]);

        $this->saveTemplates($templates);

        return response()->json(['message' => 'Template updated successfully', 'template' => $templates[$templateIndex]]);
    }

    /**
     * Delete template
     */
    public function destroy(string $id): JsonResponse
    {
        $templates = $this->getStoredTemplates();
        $templates = array_filter($templates, function ($template) use ($id) {
            return $template['id'] !== $id;
        });

        $this->saveTemplates(array_values($templates));

        return response()->json(['message' => 'Template deleted successfully']);
    }

    /**
     * Preview template
     */
    public function preview(Request $request, string $id): JsonResponse
    {
        try {
            $sampleData = $request->get('data', []);
            $html = $this->mailTemplateService->previewTemplate($id, $sampleData);
            
            return response()->json(['html' => $html]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Get template variables
     */
    public function variables(string $id): JsonResponse
    {
        $variables = $this->mailTemplateService->getTemplateVariables($id);
        return response()->json(['variables' => $variables]);
    }

    /**
     * Upload image for templates
     */
    public function uploadImage(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $file = $request->file('image');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('mail-template-images', $filename, 'public');
        
        return response()->json([
            'message' => 'Image uploaded successfully',
            'url' => Storage::url($path),
            'filename' => $filename
        ]);
    }

    /**
     * Export template as HTML
     */
    public function export(string $id): JsonResponse
    {
        $template = $this->mailTemplateService->getTemplate($id);
        
        if (!$template) {
            return response()->json(['error' => 'Template not found'], 404);
        }

        $html = $template['html'];
        $css = $template['css'] ?? '';
        
        if (!empty($css)) {
            $html = "<style>{$css}</style>" . $html;
        }

        return response()->json([
            'html' => $html,
            'filename' => $template['name'] . '.html'
        ]);
    }

    /**
     * Duplicate template
     */
    public function duplicate(string $id): JsonResponse
    {
        $template = $this->mailTemplateService->getTemplate($id);
        
        if (!$template) {
            return response()->json(['error' => 'Template not found'], 404);
        }

        $templates = $this->getStoredTemplates();
        
        $newTemplate = $template;
        $newTemplate['id'] = uniqid('tpl_');
        $newTemplate['name'] = $template['name'] . ' (Copy)';
        $newTemplate['created_at'] = now()->toISOString();
        $newTemplate['updated_at'] = now()->toISOString();

        $templates[] = $newTemplate;
        $this->saveTemplates($templates);

        return response()->json(['message' => 'Template duplicated successfully', 'template' => $newTemplate]);
    }

    /**
     * Get stored templates
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
     * Save templates to storage
     */
    private function saveTemplates(array $templates): void
    {
        $path = storage_path('app/mail-templates.json');
        file_put_contents($path, json_encode($templates, JSON_PRETTY_PRINT));
    }
} 