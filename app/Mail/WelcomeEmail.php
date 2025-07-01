<?php

namespace App\Mail;

use App\Models\User;
use App\Services\MailTemplateService;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WelcomeEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $templateService = new MailTemplateService();
        
        try {
            $template = $templateService->getTemplateByName('Welcome Email');
            
            if ($template) {
                $templateData = [
                    'user_name' => $this->user->name,
                    'user_email' => $this->user->email,
                    'company_name' => config('app.name', 'Our Platform'),
                    'welcome_message' => "Welcome to our platform, {$this->user->name}!",
                    'login_url' => route('login'),
                    'support_email' => config('mail.support_email', 'support@example.com'),
                    'cta_text' => 'Get Started',
                    'cta_url' => route('dashboard'),
                    'year' => date('Y')
                ];
                
                $htmlContent = $templateService->renderTemplate($template['id'], $templateData);
                
                return $this->subject('Welcome to ' . config('app.name') . '!')
                            ->to($this->user->email, $this->user->name)
                            ->html($htmlContent);
            }
            
        } catch (\Exception $e) {
            \Log::error('Welcome email template error: ' . $e->getMessage());
        }
        
        // Fallback to default view if template not found
        return $this->subject('Welcome!')
                    ->to($this->user->email, $this->user->name)
                    ->view('emails.welcome')
                    ->with(['user' => $this->user]);
    }
} 