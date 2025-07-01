<?php

namespace App\Http\Controllers;

use App\Mail\NewsletterMail;
use App\Mail\WelcomeEmail;
use App\Models\User;
use App\Services\MailTemplateService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;

class EmailController extends Controller
{
    protected $templateService;

    public function __construct(MailTemplateService $templateService)
    {
        $this->templateService = $templateService;
    }

    /**
     * Display email templates dashboard
     */
    public function index()
    {
        $templates = $this->templateService->getTemplatesList();
        $stats = $this->templateService->getTemplateStats();
        
        return view('emails.dashboard', compact('templates', 'stats'));
    }

    /**
     * Preview a template with sample data
     */
    public function previewTemplate(Request $request, string $templateId)
    {
        try {
            $sampleData = $request->input('data', []);
            $html = $this->templateService->previewTemplate($templateId, $sampleData);
            
            return response($html)->header('Content-Type', 'text/html');
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }

    /**
     * Send test email using a template
     */
    public function sendTestEmail(Request $request, string $templateId)
    {
        $request->validate([
            'email' => 'required|email',
            'data' => 'array'
        ]);

        try {
            $testData = array_merge([
                'user_name' => 'Test User',
                'company_name' => config('app.name'),
                'cta_url' => config('app.url'),
                'cta_text' => 'Visit Website',
                'support_email' => config('mail.from.address'),
                'year' => date('Y')
            ], $request->input('data', []));

            $html = $this->templateService->renderTemplate($templateId, $testData);
            
            Mail::send([], [], function ($message) use ($request, $html) {
                $message->to($request->email)
                        ->subject('Test Email - ' . config('app.name'))
                        ->html($html);
            });

            return response()->json(['message' => 'Test email sent successfully!']);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Send newsletter to all subscribed users
     */
    public function sendNewsletter(Request $request)
    {
        $request->validate([
            'template_id' => 'required|string',
            'newsletter_title' => 'required|string',
            'main_article_title' => 'required|string',
            'main_article_content' => 'required|string',
            'cta_url' => 'required|url',
            'cta_text' => 'required|string'
        ]);

        try {
            $templateData = [
                'newsletter_title' => $request->newsletter_title,
                'main_article_title' => $request->main_article_title,
                'main_article_content' => $request->main_article_content,
                'cta_url' => $request->cta_url,
                'cta_text' => $request->cta_text,
                'company_name' => config('app.name'),
                'year' => date('Y'),
                'unsubscribe_url' => route('unsubscribe')
            ];

            // Get all users who want to receive newsletters
            $users = User::whereNotNull('email_verified_at')
                        ->where('newsletter_subscription', true)
                        ->get();

            $emailsSent = 0;

            foreach ($users as $user) {
                $personalizedData = array_merge($templateData, [
                    'user_name' => $user->name,
                    'user_email' => $user->email,
                    'personalized_greeting' => "Hi {$user->name},"
                ]);

                // Queue the email to avoid timeout
                Queue::push(function() use ($user, $personalizedData, $request) {
                    Mail::to($user->email)->send(new NewsletterMail($personalizedData, $request->template_id));
                });

                $emailsSent++;
            }

            return response()->json([
                'message' => "Newsletter queued for {$emailsSent} subscribers!",
                'emails_sent' => $emailsSent
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Send welcome email to new user
     */
    public function sendWelcomeEmail(User $user)
    {
        try {
            Mail::send(new WelcomeEmail($user));
            
            return response()->json(['message' => 'Welcome email sent successfully!']);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Send bulk promotional email
     */
    public function sendPromotion(Request $request)
    {
        $request->validate([
            'template_id' => 'required|string',
            'promotion_title' => 'required|string',
            'discount_code' => 'required|string',
            'expiry_date' => 'required|string',
            'shop_url' => 'required|url'
        ]);

        try {
            $templateData = [
                'promotion_title' => $request->promotion_title,
                'discount_code' => $request->discount_code,
                'expiry_date' => $request->expiry_date,
                'shop_url' => $request->shop_url,
                'company_name' => config('app.name'),
                'terms_url' => config('app.url') . '/terms',
                'unsubscribe_url' => route('unsubscribe'),
                'year' => date('Y')
            ];

            // Get users who opted in for marketing emails
            $subscribers = User::where('marketing_emails', true)
                             ->whereNotNull('email_verified_at')
                             ->get();

            $emailsSent = 0;

            foreach ($subscribers as $user) {
                $personalizedData = array_merge($templateData, [
                    'user_name' => $user->name,
                    'user_email' => $user->email
                ]);

                // Queue promotional emails
                Queue::push(function() use ($user, $personalizedData, $request) {
                    $html = app(MailTemplateService::class)->renderTemplate($request->template_id, $personalizedData);
                    
                    Mail::send([], [], function ($message) use ($user, $html, $request) {
                        $message->to($user->email, $user->name)
                                ->subject($request->promotion_title)
                                ->html($html);
                    });
                });

                $emailsSent++;
            }

            return response()->json([
                'message' => "Promotional emails queued for {$emailsSent} subscribers!",
                'emails_sent' => $emailsSent
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get template variables for a specific template
     */
    public function getTemplateVariables(string $templateId)
    {
        try {
            $variables = $this->templateService->getTemplateVariables($templateId);
            $template = $this->templateService->getTemplate($templateId);
            
            return response()->json([
                'template_name' => $template['name'],
                'variables' => $variables,
                'variable_count' => count($variables)
            ]);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }

    /**
     * Test email sending configuration
     */
    public function testMailConfig(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        try {
            Mail::raw('This is a test email to verify mail configuration.', function ($message) use ($request) {
                $message->to($request->email)
                        ->subject('Mail Configuration Test - ' . config('app.name'));
            });

            return response()->json(['message' => 'Test email sent successfully!']);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Mail configuration error: ' . $e->getMessage()], 500);
        }
    }
} 