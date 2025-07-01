<?php

namespace App\Services;

use Illuminate\Support\Collection;

class MailTemplateService
{
    /**
     * Get template by ID
     */
    public function getTemplate(string $templateId): ?array
    {
        $templates = $this->getStoredTemplates();
        return collect($templates)->firstWhere('id', $templateId);
    }

    /**
     * Get template by name
     */
    public function getTemplateByName(string $name): ?array
    {
        $templates = $this->getStoredTemplates();
        return collect($templates)->firstWhere('name', $name);
    }

    /**
     * Render template with data
     */
    public function renderTemplate(string $templateId, array $data = []): string
    {
        $template = $this->getTemplate($templateId);
        
        if (!$template) {
            throw new \Exception("Template not found: {$templateId}");
        }

        $html = $template['html'];
        $css = $template['css'] ?? '';
        
        // Replace placeholders with actual data
        foreach ($data as $key => $value) {
            $placeholder = "{{" . $key . "}}";
            $html = str_replace($placeholder, $value, $html);
        }
        
        // If we have CSS, wrap the HTML with style tag
        if (!empty($css)) {
            $html = "<style>{$css}</style>" . $html;
        }
        
        return $html;
    }

    /**
     * Render template by name with data
     */
    public function renderTemplateByName(string $name, array $data = []): string
    {
        $template = $this->getTemplateByName($name);
        
        if (!$template) {
            throw new \Exception("Template not found: {$name}");
        }

        return $this->renderTemplate($template['id'], $data);
    }

    /**
     * Get all stored templates
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
     * Get templates list for selection
     */
    public function getTemplatesList(): array
    {
        $templates = $this->getStoredTemplates();
        return collect($templates)->map(function ($template) {
            return [
                'id' => $template['id'],
                'name' => $template['name'],
                'created_at' => $template['created_at']
            ];
        })->toArray();
    }

    /**
     * Get template variables/placeholders from HTML
     */
    public function getTemplateVariables(string $templateId): array
    {
        $template = $this->getTemplate($templateId);
        
        if (!$template) {
            return [];
        }

        $html = $template['html'];
        
        // Find all {{variable}} patterns
        preg_match_all('/\{\{([^}]+)\}\}/', $html, $matches);
        
        return array_unique($matches[1]);
    }

    /**
     * Validate template data against required variables
     */
    public function validateTemplateData(string $templateId, array $data): array
    {
        $requiredVariables = $this->getTemplateVariables($templateId);
        $missingVariables = [];
        
        foreach ($requiredVariables as $variable) {
            if (!array_key_exists($variable, $data)) {
                $missingVariables[] = $variable;
            }
        }
        
        return $missingVariables;
    }

    /**
     * Create a safe preview of template with sample data
     */
    public function previewTemplate(string $templateId, array $sampleData = []): string
    {
        $template = $this->getTemplate($templateId);
        
        if (!$template) {
            throw new \Exception("Template not found: {$templateId}");
        }

        $variables = $this->getTemplateVariables($templateId);
        
        // Provide default sample data for missing variables
        $defaultSampleData = [
            'user_name' => 'John Doe',
            'company_name' => 'Your Company',
            'email' => 'user@example.com',
            'cta_url' => '#',
            'cta_text' => 'Click Here',
            'support_email' => 'support@example.com',
            'unsubscribe_url' => '#',
            'date' => date('Y-m-d'),
            'year' => date('Y')
        ];
        
        $previewData = array_merge($defaultSampleData, $sampleData);
        
        // Ensure all variables have values
        foreach ($variables as $variable) {
            if (!isset($previewData[$variable])) {
                $previewData[$variable] = '[' . strtoupper($variable) . ']';
            }
        }
        
        return $this->renderTemplate($templateId, $previewData);
    }

    /**
     * Get template statistics
     */
    public function getTemplateStats(): array
    {
        $templates = $this->getStoredTemplates();
        
        return [
            'total_templates' => count($templates),
            'templates_by_type' => $this->categorizeTemplates($templates),
            'recent_templates' => $this->getRecentTemplates($templates, 5)
        ];
    }

    /**
     * Categorize templates by name patterns
     */
    private function categorizeTemplates(array $templates): array
    {
        $categories = [
            'welcome' => 0,
            'newsletter' => 0,
            'promotion' => 0,
            'notification' => 0,
            'other' => 0
        ];
        
        foreach ($templates as $template) {
            $name = strtolower($template['name']);
            
            if (str_contains($name, 'welcome')) {
                $categories['welcome']++;
            } elseif (str_contains($name, 'newsletter')) {
                $categories['newsletter']++;
            } elseif (str_contains($name, 'promotion') || str_contains($name, 'sale') || str_contains($name, 'discount')) {
                $categories['promotion']++;
            } elseif (str_contains($name, 'notification') || str_contains($name, 'alert')) {
                $categories['notification']++;
            } else {
                $categories['other']++;
            }
        }
        
        return $categories;
    }

    /**
     * Get most recently created templates
     */
    private function getRecentTemplates(array $templates, int $limit): array
    {
        return collect($templates)
            ->sortByDesc('created_at')
            ->take($limit)
            ->map(function ($template) {
                return [
                    'id' => $template['id'],
                    'name' => $template['name'],
                    'created_at' => $template['created_at']
                ];
            })
            ->values()
            ->toArray();
    }
} 