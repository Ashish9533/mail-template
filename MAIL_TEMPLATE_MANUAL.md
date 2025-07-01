# 📧 Mail Template Builder - Complete Usage Manual

## Table of Contents
1. [Creating Mail Templates](#creating-mail-templates)
2. [Using Templates with Laravel Mail](#using-templates-with-laravel-mail)
3. [Advanced Email Features](#advanced-email-features)
4. [Best Practices](#best-practices)
5. [Troubleshooting](#troubleshooting)

---

## 1. Creating Mail Templates

### Step 1: Access the Template Builder
1. Start your Laravel server: `php artisan serve --port=9087`
2. Visit: `http://127.0.0.1:9087/mail-template`

### Step 2: Building Your Template

#### **Option A: Use Pre-built Templates**
1. In the left sidebar, scroll to "Templates" section
2. Click on:
   - **Newsletter** - Professional newsletter layout
   - **Welcome Email** - Onboarding email template
   - **Promotion** - Marketing campaign template

#### **Option B: Build from Scratch**
1. **Drag Components** from the sidebar to the canvas:
   - **Layout**: Container, Row, Column, Spacer
   - **Content**: Heading, Text, Image, Button
   - **Advanced**: Header, Footer, Social Media, Divider

2. **Customize Components**:
   - Click any component to open properties panel
   - Edit text, colors, fonts, spacing, links
   - Adjust alignment and styling

### Step 3: Save Your Template
1. Enter a **Template Name** in the header
2. Click **Save** button
3. Template is saved and will appear in the Load modal

### Step 4: Preview and Export
- **Preview**: Opens template in new window for testing
- **Export**: Downloads template as standalone HTML file
- **Code View**: Edit raw HTML/CSS if needed

---

## 2. Using Templates with Laravel Mail

### Step 1: Create Mail Classes

Create mail classes that will use your templates:

```bash
# Create a newsletter mail class
php artisan make:mail NewsletterMail

# Create a welcome email class
php artisan make:mail WelcomeEmail

# Create a promotional email class
php artisan make:mail PromotionalEmail
```

### Step 2: Create Template Service

Create a service to manage templates:

```php
<?php
// app/Services/MailTemplateService.php

namespace App\Services;

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
        
        // Replace placeholders with actual data
        foreach ($data as $key => $value) {
            $html = str_replace("{{" . $key . "}}", $value, $html);
        }
        
        return $html;
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
}
```

### Step 3: Update Mail Classes

**Example 1: Newsletter Mail**

```php
<?php
// app/Mail/NewsletterMail.php

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

    public function __construct(array $templateData = [], string $templateId = null)
    {
        $this->templateData = $templateData;
        $this->templateId = $templateId;
    }

    public function build()
    {
        $templateService = new MailTemplateService();
        
        // Use specific template or find by name
        $templateId = $this->templateId ?: $this->findTemplateByName('Newsletter');
        
        if ($templateId) {
            $htmlContent = $templateService->renderTemplate($templateId, $this->templateData);
            
            return $this->subject('Weekly Newsletter')
                        ->html($htmlContent);
        }
        
        // Fallback to default view if template not found
        return $this->subject('Weekly Newsletter')
                    ->view('emails.newsletter')
                    ->with($this->templateData);
    }

    private function findTemplateByName(string $name): ?string
    {
        $templateService = new MailTemplateService();
        $template = $templateService->getTemplateByName($name);
        return $template['id'] ?? null;
    }
}
```

**Example 2: Welcome Email**

```php
<?php
// app/Mail/WelcomeEmail.php

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

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function build()
    {
        $templateService = new MailTemplateService();
        $template = $templateService->getTemplateByName('Welcome Email');
        
        if ($template) {
            $templateData = [
                'user_name' => $this->user->name,
                'user_email' => $this->user->email,
                'welcome_message' => "Welcome to our platform, {$this->user->name}!",
                'login_url' => route('login'),
                'support_email' => config('mail.support_email', 'support@example.com')
            ];
            
            $htmlContent = $templateService->renderTemplate($template['id'], $templateData);
            
            return $this->subject('Welcome to Our Platform!')
                        ->to($this->user->email)
                        ->html($htmlContent);
        }
        
        // Fallback
        return $this->subject('Welcome!')
                    ->view('emails.welcome')
                    ->with(['user' => $this->user]);
    }
}
```

### Step 4: Send Emails

**In Controllers:**

```php
<?php
// app/Http/Controllers/EmailController.php

namespace App\Http\Controllers;

use App\Mail\NewsletterMail;
use App\Mail\WelcomeEmail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EmailController extends Controller
{
    /**
     * Send newsletter to all users
     */
    public function sendNewsletter(Request $request)
    {
        $templateData = [
            'newsletter_title' => 'Weekly Update',
            'main_article_title' => 'New Features Released!',
            'main_article_content' => 'We are excited to announce new features...',
            'cta_url' => 'https://example.com/features',
            'cta_text' => 'Learn More',
            'company_name' => 'Your Company',
            'unsubscribe_url' => route('unsubscribe')
        ];

        $users = User::whereNotNull('email_verified_at')->get();

        foreach ($users as $user) {
            $personalizedData = array_merge($templateData, [
                'user_name' => $user->name,
                'personalized_greeting' => "Hi {$user->name},"
            ]);

            Mail::to($user->email)->send(new NewsletterMail($personalizedData));
        }

        return response()->json(['message' => 'Newsletter sent successfully!']);
    }

    /**
     * Send welcome email to new user
     */
    public function sendWelcomeEmail(User $user)
    {
        Mail::send(new WelcomeEmail($user));
        
        return response()->json(['message' => 'Welcome email sent!']);
    }

    /**
     * Send promotional email
     */
    public function sendPromotion(Request $request)
    {
        $templateData = [
            'promotion_title' => '50% OFF Everything!',
            'discount_code' => 'SAVE50',
            'expiry_date' => 'Midnight Tonight',
            'shop_url' => 'https://shop.example.com',
            'terms_url' => 'https://example.com/terms'
        ];

        $subscribers = User::where('marketing_emails', true)->get();

        foreach ($subscribers as $user) {
            Mail::to($user->email)->send(new PromotionalEmail($templateData));
        }

        return response()->json(['message' => 'Promotional emails sent!']);
    }
}
```

**In Event Listeners:**

```php
<?php
// app/Listeners/SendWelcomeEmail.php

namespace App\Listeners;

use App\Events\UserRegistered;
use App\Mail\WelcomeEmail;
use Illuminate\Support\Facades\Mail;

class SendWelcomeEmail
{
    public function handle(UserRegistered $event)
    {
        Mail::send(new WelcomeEmail($event->user));
    }
}
```

---

## 3. Advanced Email Features

### Template Variables

Create templates with placeholders that will be replaced with actual data:

```html
<!-- In your template builder, use placeholders like: -->
<h1>Hello {{user_name}}!</h1>
<p>Welcome to {{company_name}}. Your email is {{user_email}}.</p>
<a href="{{cta_url}}">{{cta_text}}</a>
```

### Queue Configuration

For bulk emails, use Laravel queues:

```php
// config/queue.php - Configure queue driver

// In your controller
Mail::to($user->email)->queue(new NewsletterMail($data));

// Or delay sending
Mail::to($user->email)->later(now()->addMinutes(5), new WelcomeEmail($user));
```

### Email Tracking

Add tracking to templates:

```php
<?php
// app/Services/EmailTrackingService.php

namespace App\Services;

class EmailTrackingService
{
    public function addTrackingToTemplate(string $html, string $trackingId): string
    {
        // Add tracking pixel
        $trackingPixel = '<img src="' . route('email.track', $trackingId) . '" width="1" height="1" style="display:none;">';
        
        // Add click tracking to links
        $html = preg_replace_callback(
            '/<a\s+href="([^"]+)"([^>]*)>/i',
            function($matches) use ($trackingId) {
                $originalUrl = $matches[1];
                $trackedUrl = route('email.link-click', [
                    'tracking_id' => $trackingId,
                    'url' => base64_encode($originalUrl)
                ]);
                return '<a href="' . $trackedUrl . '"' . $matches[2] . '>';
            },
            $html
        );
        
        return $html . $trackingPixel;
    }
}
```

### Responsive Email Templates

Ensure templates work on mobile:

```css
/* Add this CSS to your templates */
@media screen and (max-width: 600px) {
    .email-container {
        width: 100% !important;
        padding: 10px !important;
    }
    
    .email-row {
        flex-direction: column !important;
    }
    
    .email-col {
        width: 100% !important;
        margin: 5px 0 !important;
    }
    
    .email-button {
        display: block !important;
        width: 100% !important;
        text-align: center !important;
    }
}
```

---

## 4. Best Practices

### Template Organization

1. **Use Consistent Naming**:
   - `Welcome - New User`
   - `Newsletter - Weekly`
   - `Promotion - Holiday Sale`

2. **Version Control Templates**:
   - Save different versions with dates
   - Test templates before going live

3. **Template Variables**:
   - Document all available variables
   - Use clear, descriptive placeholder names

### Email Sending Best Practices

1. **Use Queues for Bulk Emails**:
```php
// Instead of sending immediately
foreach ($users as $user) {
    Mail::to($user)->queue(new NewsletterMail($data));
}
```

2. **Implement Rate Limiting**:
```php
// In your controller
if (RateLimiter::tooManyAttempts('send-email:' . $user->id, 5)) {
    return response()->json(['error' => 'Too many emails sent'], 429);
}

RateLimiter::hit('send-email:' . $user->id);
```

3. **Handle Failed Emails**:
```php
// app/Listeners/EmailFailureListener.php
public function handle($event)
{
    \Log::error('Email failed to send', [
        'to' => $event->data['to'],
        'subject' => $event->data['subject'],
        'error' => $event->data['error']
    ]);
}
```

### Testing Templates

1. **Preview Before Sending**:
   - Use the preview function in the builder
   - Test on different email clients

2. **Send Test Emails**:
```php
// Create a test route
Route::get('/test-email/{template}', function($template) {
    $templateService = new MailTemplateService();
    $testData = [
        'user_name' => 'Test User',
        'company_name' => 'Test Company',
        'cta_url' => 'https://example.com'
    ];
    
    Mail::to('test@example.com')->send(new NewsletterMail($testData, $template));
    
    return 'Test email sent!';
});
```

---

## 5. Troubleshooting

### Common Issues

**1. Template Not Found**
```php
// Add error handling
try {
    $template = $templateService->getTemplate($templateId);
    if (!$template) {
        throw new \Exception("Template not found: {$templateId}");
    }
} catch (\Exception $e) {
    \Log::error('Template error: ' . $e->getMessage());
    // Use fallback template
}
```

**2. Mail Configuration Issues**
```php
// Check mail configuration
php artisan config:clear
php artisan queue:work  // If using queues

// Test mail configuration
php artisan tinker
Mail::raw('Test message', function($msg) {
    $msg->to('test@example.com')->subject('Test');
});
```

**3. Template Variables Not Replacing**
- Ensure placeholder format: `{{variable_name}}`
- Check data array keys match placeholder names
- Debug template data:

```php
\Log::info('Template data', $templateData);
\Log::info('Rendered HTML', ['html' => substr($html, 0, 200)]);
```

### Debugging Tools

1. **Mail Testing Tools**:
   - Mailtrap (for development)
   - MailHog (local testing)
   - Laravel Telescope (monitoring)

2. **Template Preview Route**:
```php
Route::get('/preview-template/{id}', function($id) {
    $service = new MailTemplateService();
    $template = $service->getTemplate($id);
    return response($template['html'])->header('Content-Type', 'text/html');
});
```

---

## Quick Start Example

**1. Create a simple welcome email:**

```bash
# Create the mail class
php artisan make:mail QuickWelcome
```

```php
<?php
// app/Mail/QuickWelcome.php
namespace App\Mail;

use Illuminate\Mail\Mailable;

class QuickWelcome extends Mailable
{
    public $userName;

    public function __construct($userName)
    {
        $this->userName = $userName;
    }

    public function build()
    {
        // Get welcome template
        $templates = json_decode(file_get_contents(storage_path('app/mail-templates.json')), true);
        $welcomeTemplate = collect($templates)->firstWhere('name', 'Welcome Email');
        
        if ($welcomeTemplate) {
            $html = str_replace('{{user_name}}', $this->userName, $welcomeTemplate['html']);
            return $this->subject('Welcome!')->html($html);
        }
        
        return $this->subject('Welcome!')->view('emails.welcome');
    }
}
```

**2. Send the email:**
```php
Mail::to('user@example.com')->send(new QuickWelcome('John Doe'));
```

That's it! You now have a complete system for creating beautiful email templates and sending them with Laravel! 🚀 