<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $newsletter_title ?? 'Newsletter' }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background: white;
            padding: 30px;
            border: 1px solid #ddd;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-radius: 0 0 8px 8px;
        }
        .button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $newsletter_title ?? 'Newsletter' }}</h1>
        <p>{{ $company_name ?? 'Your Company' }}</p>
    </div>
    
    <div class="content">
        @if(isset($user_name))
        <p>Hi {{ $user_name }},</p>
        @endif
        
        <h2>{{ $main_article_title ?? 'Welcome to our Newsletter!' }}</h2>
        
        <p>{{ $main_article_content ?? 'Thank you for subscribing to our newsletter. We are excited to share updates and insights with you.' }}</p>
        
        @if(isset($cta_url) && isset($cta_text))
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ $cta_url }}" class="button">{{ $cta_text }}</a>
        </div>
        @endif
        
        <p>Best regards,<br>
        The {{ $company_name ?? 'Our' }} Team</p>
    </div>
    
    <div class="footer">
        <p>&copy; {{ date('Y') }} {{ $company_name ?? 'Your Company' }}. All rights reserved.</p>
        @if(isset($unsubscribe_url))
        <p><a href="{{ $unsubscribe_url }}">Unsubscribe</a> from our newsletter</p>
        @endif
    </div>
</body>
</html> 