# 📧 Laravel Mail Template Builder

A comprehensive and advanced email template builder with drag-and-drop functionality, built with Laravel 12, Tailwind CSS 4.0, and vanilla JavaScript. Create beautiful, responsive email templates visually and send them using Laravel's powerful mail system.

## 🚀 Quick Start

### 1. Start Building Templates (2 minutes)
```bash
php artisan serve --port=9087
```
Visit: **http://127.0.0.1:9087/mail-template**

### 2. Send Your First Email (1 minute)
Visit: **http://127.0.0.1:9087/test-newsletter**

### 3. Complete Setup Guide
📖 **Read:** [`QUICK_START_GUIDE.md`](QUICK_START_GUIDE.md) for detailed instructions

### 4. Full Documentation  
📚 **Read:** [`MAIL_TEMPLATE_MANUAL.md`](MAIL_TEMPLATE_MANUAL.md) for complete usage guide

## 🎯 Ready-to-Use Features

### ✅ Template Builder
- **Drag & Drop Visual Editor** - Intuitive component placement
- **11 Pre-built Components** - Layout, content, and advanced components
- **3 Complete Email Templates** - Newsletter, Welcome, Promotional
- **Live Preview & Editing** - Real-time property modifications
- **Export to HTML** - Download templates as standalone files

### ✅ Laravel Mail Integration
- **MailTemplateService Class** - Complete template management
- **Mail Classes** - NewsletterMail, WelcomeEmail ready to use
- **Template Variables** - Dynamic content replacement
- **Fallback Views** - Graceful degradation
- **Error Handling** - Comprehensive logging and validation

### ✅ Email Management Dashboard
- **Email Dashboard** - Complete management interface at `/emails`
- **Send Test Emails** - Test templates with sample data
- **Bulk Operations** - Newsletter and promotional campaigns
- **Template Statistics** - Usage analytics and insights
- **Mail Configuration Testing** - Verify email setup

### ✅ Developer Tools
- **API Testing Page** - Debug save functionality
- **Template Variable Extraction** - Automatic placeholder detection
- **Comprehensive Error Handling** - Detailed logging and validation
- **Debug Tools** - Complete troubleshooting guides

## 🛠️ Immediate Usage Examples

### Send Newsletter
```php
use App\Mail\NewsletterMail;
use Illuminate\Support\Facades\Mail;

$data = [
    'newsletter_title' => 'Weekly Update',
    'main_article_title' => 'New Features Released!',
    'main_article_content' => 'Check out our latest updates...',
    'cta_url' => 'https://yoursite.com/features',
    'cta_text' => 'Learn More',
    'user_name' => 'John Doe',
    'company_name' => 'Your Company'
];

Mail::to('user@example.com')->send(new NewsletterMail($data));
```

### Send Welcome Email
```php
use App\Mail\WelcomeEmail;

$user = User::find(1);
Mail::to($user->email)->send(new WelcomeEmail($user));
```

### Use Template Service Directly
```php
use App\Services\MailTemplateService;

$templateService = new MailTemplateService();
$html = $templateService->renderTemplateByName('Newsletter', [
    'user_name' => 'Customer Name',
    'newsletter_title' => 'Monthly Update'
]);

Mail::send([], [], function ($message) use ($html) {
    $message->to('customer@example.com')
            ->subject('Monthly Newsletter')
            ->html($html);
});
```

## 🌐 Access Points

| Feature | URL | Description |
|---------|-----|-------------|
| **Template Builder** | `http://127.0.0.1:9087/mail-template` | Visual email template builder |
| **Email Dashboard** | `http://127.0.0.1:9087/emails` | Email management interface |
| **API Testing** | `http://127.0.0.1:9087/test-api.html` | Debug and test functionality |
| **Quick Newsletter Test** | `http://127.0.0.1:9087/test-newsletter` | Send test newsletter immediately |

## 📖 Documentation

- 🚀 **[Quick Start Guide](QUICK_START_GUIDE.md)** - Get up and running in 5 minutes
- 📚 **[Complete Manual](MAIL_TEMPLATE_MANUAL.md)** - Full documentation with examples
- 🔧 **[Debugging Guide](debugging-guide.md)** - Troubleshooting and solutions

## 🎨 Available Components

### Layout Components
- **Container** - Main wrapper with customizable styling
- **Row** - Horizontal layout container
- **Column** - Vertical sections with adjustable width
- **Spacer** - Adjustable vertical spacing

### Content Components
- **Heading** - H1-H6 with typography controls
- **Text** - Rich paragraphs with formatting
- **Image** - Responsive images with alt text
- **Button** - Call-to-action buttons with hover effects

### Advanced Components
- **Header** - Branded email headers with gradients
- **Footer** - Contact information and legal text
- **Social Media** - Social platform button collections
- **Divider** - Visual section separators

## 📧 Pre-built Templates

### 📰 Newsletter Template
Perfect for weekly/monthly updates with:
- Professional header with company branding
- Article sections with images
- Call-to-action buttons
- Social media links
- Unsubscribe footer

### 👋 Welcome Email Template
Ideal for user onboarding with:
- Welcome message personalization
- Next steps guidance
- Getting started call-to-action
- Support contact information

### 🎯 Promotional Template
Great for marketing campaigns with:
- Eye-catching promotional banners
- Discount code highlighting
- Urgency messaging
- Shop now buttons
- Terms and conditions

## 🔧 Template Variables

Use these placeholders in your templates:

### User Variables
- `{{user_name}}` - Customer's name
- `{{user_email}}` - Customer's email

### Company Variables  
- `{{company_name}}` - Your company name
- `{{support_email}}` - Support email address

### Action Variables
- `{{cta_url}}` - Call-to-action URL
- `{{cta_text}}` - Button text
- `{{login_url}}` - Login page URL

### Content Variables
- `{{newsletter_title}}` - Newsletter subject
- `{{main_article_title}}` - Article headline
- `{{main_article_content}}` - Article content

### System Variables
- `{{year}}` - Current year
- `{{unsubscribe_url}}` - Unsubscribe link

## ⚡ Advanced Features

### Queue Integration
```php
// Queue emails for better performance
Mail::to($user->email)->queue(new NewsletterMail($data));

// Delayed sending
Mail::to($user->email)->later(now()->addMinutes(5), new WelcomeEmail($user));
```

### Bulk Email Sending
```php
$users = User::where('newsletter_subscription', true)->get();

foreach ($users as $user) {
    $personalizedData = array_merge($templateData, [
        'user_name' => $user->name,
        'user_email' => $user->email
    ]);
    
    Mail::to($user->email)->queue(new NewsletterMail($personalizedData));
}
```

### Template Validation
```php
$templateService = new MailTemplateService();
$missingVars = $templateService->validateTemplateData($templateId, $data);

if (!empty($missingVars)) {
    throw new Exception('Missing template variables: ' . implode(', ', $missingVars));
}
```

## 🚀 Installation & Setup

### 1. Clone and Install
```bash
git clone <repository-url>
cd mailtemplate
composer install
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
php artisan key:generate
```

### 3. Configure Mail Settings
```env
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yoursite.com
MAIL_FROM_NAME="${APP_NAME}"
```

### 4. Build Assets
```bash
npm run build
# or for development
npm run dev
```

### 5. Start Development Server
```bash
php artisan serve --port=9087
```

## 🔧 Development Commands

### Clear Caches
```bash
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
```

### Create New Mail Classes
```bash
php artisan make:mail YourCustomMail
```

### Test Mail Configuration
```bash
php artisan tinker
Mail::raw('Test message', function($msg) {
    $msg->to('test@example.com')->subject('Test');
});
```

## 🏗️ Architecture

### File Structure
```
├── app/
│   ├── Http/Controllers/
│   │   ├── MailTemplateController.php    # Template builder API
│   │   └── EmailController.php           # Email management
│   ├── Mail/
│   │   ├── NewsletterMail.php           # Newsletter mail class
│   │   └── WelcomeEmail.php             # Welcome mail class
│   └── Services/
│       └── MailTemplateService.php      # Template management service
├── resources/views/
│   ├── mail-template/
│   │   ├── builder.blade.php            # Template builder interface
│   │   └── preview.blade.php            # Template preview
│   └── emails/
│       ├── dashboard.blade.php          # Email management dashboard
│       ├── newsletter.blade.php         # Fallback newsletter view
│       └── welcome.blade.php            # Fallback welcome view
├── public/js/
│   ├── mail-template-builder.js         # Builder functionality
│   └── email-dashboard.js              # Dashboard functionality
└── storage/app/
    └── mail-templates.json              # Template storage
```

### Technology Stack
- **Backend:** Laravel 12, PHP 8.2+
- **Frontend:** Tailwind CSS 4.0, Vanilla JavaScript
- **Email:** Laravel Mail with queue support
- **Storage:** JSON files (easily upgradeable to database)
- **Assets:** Vite build system

## 🛠️ Troubleshooting

### Common Issues

**Save Button Not Working?**
1. Check browser console (F12) for errors
2. Visit API test page: `http://127.0.0.1:9087/test-api.html`
3. Verify CSRF token in page source

**Email Not Sending?**
1. Test mail configuration with `php artisan tinker`
2. Check `.env` mail settings
3. Verify firewall/port settings

**Template Not Found?**
1. Check `storage/app/mail-templates.json` exists
2. Verify template name matches exactly
3. Check file permissions on storage directory

## 🔮 Roadmap

- [ ] **Database Integration** - Store templates in database instead of files
- [ ] **User Authentication** - Multi-user template management
- [ ] **Template Sharing** - Share templates between users
- [ ] **Advanced Image Handling** - Upload and manage images
- [ ] **Email Tracking** - Open rates, click tracking, analytics
- [ ] **A/B Testing** - Template performance comparison
- [ ] **Custom CSS Injection** - Advanced styling options
- [ ] **Component Marketplace** - Share and download components
- [ ] **Template Versioning** - Version control for templates
- [ ] **API Integration** - RESTful API for external systems

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 🙏 Acknowledgments

- Built with [Laravel](https://laravel.com)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Icons by [Font Awesome](https://fontawesome.com)

---

**Ready to create beautiful emails? Get started in 5 minutes!** 🚀

📖 [Quick Start Guide](QUICK_START_GUIDE.md) | 📚 [Full Manual](MAIL_TEMPLATE_MANUAL.md) | 🔧 [Debugging](debugging-guide.md)
