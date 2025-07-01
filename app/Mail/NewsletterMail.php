<?php

namespace App\Mail;

use App\Services\MailTemplateService;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewsletterMail extends Mailable
{
    use Queueable, SerializesModels;

    public $templateData;
    public $templateId;

    /**
     * Create a new message instance.
     */
    public function __construct(array $templateData = [], string $templateId = null)
    {
        $this->templateData = $templateData;
        $this->templateId = $templateId;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $templateService = new MailTemplateService();
        
        try {
            // Use specific template ID or find by name
            $templateId = $this->templateId ?: $this->findTemplateByName('Newsletter');
            
            if ($templateId) {
                // Validate that we have all required data
                $missingVars = $templateService->validateTemplateData($templateId, $this->templateData);
                
                if (!empty($missingVars)) {
                    \Log::warning('Newsletter template missing variables', [
                        'missing' => $missingVars,
                        'provided' => array_keys($this->templateData)
                    ]);
                }
                
                // Render the template
                $htmlContent = $templateService->renderTemplate($templateId, $this->templateData);
                
                return $this->subject($this->templateData['newsletter_title'] ?? 'Newsletter')
                            ->html($htmlContent);
            }
            
        } catch (\Exception $e) {
            \Log::error('Newsletter template error: ' . $e->getMessage());
        }
        
        // Fallback to default view if template not found or error occurred
        return $this->subject('Newsletter')
                    ->view('emails.newsletter')
                    ->with($this->templateData);
    }

    /**
     * Find template by name
     */
    private function findTemplateByName(string $name): ?string
    {
        $templateService = new MailTemplateService();
        $template = $templateService->getTemplateByName($name);
        return $template['id'] ?? null;
    }
} 