# 🚀 Quick Start Guide - Mail Template Builder

## 1. Immediate Setup (5 minutes)

### Start the Server
```bash
cd mailtemplate
php artisan serve --port=9087
```

### Access the Builder
Visit: **http://127.0.0.1:9087/mail-template**

## 2. Create Your First Template (2 minutes)

### Step 1: Choose a Template
1. In the left sidebar, click on **"Newsletter"** under Templates section
2. The template loads automatically in the canvas

### Step 2: Customize the Template
1. Click on the **heading** to change the text
2. Click on the **paragraph** to edit content
3. Click on the **button** to change the link and text

### Step 3: Save the Template
1. Enter **"My First Newsletter"** in the template name field
2. Click the **Save** button
3. You'll see a success notification

## 3. Send Your First Email (3 minutes)

### Option A: Quick Test (Easiest)

Visit: **http://127.0.0.1:9087/test-newsletter**

This sends a test newsletter email immediately!

### Option B: Using PHP Code

```php
// In tinker or any controller
use App\Mail\NewsletterMail;
use Illuminate\Support\Facades\Mail;

$templateData = [
    'newsletter_title' => 'Welcome Newsletter',
    'main_article_title' => 'Getting Started!',
    'main_article_content' => 'Thank you for using our email template builder.',
    'cta_url' => 'https://example.com',
    'cta_text' => 'Learn More',
    'user_name' => 'John Doe',
    'company_name' => 'Your Company'
];

Mail::to('your-email@example.com')->send(new NewsletterMail($templateData));
```

## 4. Test Everything Works

### Test the API
Visit: **http://127.0.0.1:9087/test-api.html**

This page will:
- ✅ Check CSRF token
- ✅ Test save functionality  
- ✅ Show any errors

### Test Mail Configuration
```bash
php artisan tinker
```
```php
Mail::raw('Test message', function($msg) {
    $msg->to('your-email@example.com')->subject('Laravel Test');
});
```

## 5. Available Templates & Usage

### Pre-built Templates:

1. **Newsletter Template**
   ```php
   // Usage
   $data = [
       'newsletter_title' => 'Weekly Update',
       'main_article_title' => 'New Features',
       'main_article_content' => 'We released amazing features...',
       'cta_url' => 'https://yoursite.com/features',
       'cta_text' => 'Learn More',
       'user_name' => 'Customer Name',
       'company_name' => 'Your Company'
   ];
   Mail::to($email)->send(new NewsletterMail($data));
   ```

2. **Welcome Email Template**
   ```php
   // Usage (automatic with user data)
   Mail::to($user->email)->send(new WelcomeEmail($user));
   ```

3. **Promotional Template**
   ```php
   // Usage
   $data = [
       'promotion_title' => '50% OFF Sale!',
       'discount_code' => 'SAVE50',
       'expiry_date' => 'End of month',
       'shop_url' => 'https://shop.example.com',
       'user_name' => 'Customer Name'
   ];
   ```

## 6. Common Variables for Templates

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
- `{{main_article_title}}` - Article headline
- `{{main_article_content}}` - Article content
- `{{newsletter_title}}` - Newsletter subject

### System Variables
- `{{year}}` - Current year
- `{{unsubscribe_url}}` - Unsubscribe link

## 7. Quick Commands

### Create New Mail Class
```bash
php artisan make:mail YourMailClass
```

### Clear Caches
```bash
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Test Routes
- Template Builder: `http://127.0.0.1:9087/mail-template`
- API Test: `http://127.0.0.1:9087/test-api.html`
- Email Dashboard: `http://127.0.0.1:9087/emails`
- Quick Newsletter Test: `http://127.0.0.1:9087/test-newsletter`

## 8. Troubleshooting

### Save Button Not Working?
1. Check browser console (F12)
2. Visit test page: `http://127.0.0.1:9087/test-api.html`
3. Ensure server is running on port 9087

### Email Not Sending?
1. Check `.env` mail configuration:
   ```env
   MAIL_MAILER=smtp
   MAIL_HOST=your-smtp-host
   MAIL_PORT=587
   MAIL_USERNAME=your-username
   MAIL_PASSWORD=your-password
   ```

2. Test mail config:
   ```bash
   php artisan tinker
   Mail::raw('test', function($m){ $m->to('test@example.com'); });
   ```

### Template Not Found?
1. Check if template is saved: visit `http://127.0.0.1:9087/mail-template` → Load button
2. Verify template name matches exactly in code
3. Check `storage/app/mail-templates.json` exists

## 9. Production Setup

### Environment Configuration
```env
# .env file
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-server.com
MAIL_PORT=587
MAIL_USERNAME=your-smtp-username
MAIL_PASSWORD=your-smtp-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yoursite.com
MAIL_FROM_NAME="${APP_NAME}"
```

### Queue Configuration (Recommended)
```env
QUEUE_CONNECTION=database
```

```bash
php artisan queue:table
php artisan migrate
php artisan queue:work
```

## 10. Next Steps

1. **Create Custom Templates**: Use the builder to create templates for your specific needs
2. **Set Up Queues**: For sending bulk emails without timeouts
3. **Add Email Tracking**: Track opens and clicks (optional)
4. **Database Integration**: Store templates in database instead of files
5. **User Management**: Add authentication and user-specific templates

---

## 📞 Need Help?

- Check the complete manual: `MAIL_TEMPLATE_MANUAL.md`
- Test your setup: `http://127.0.0.1:9087/test-api.html`
- Debug with: `debugging-guide.md`

**You're ready to send beautiful emails! 🎉** 