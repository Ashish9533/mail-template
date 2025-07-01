<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome!</title>
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
            padding: 40px;
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
            background-color: #28a745;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: bold;
        }
        .highlight-box {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #007bff;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Welcome!</h1>
        <p>We're excited to have you on board</p>
    </div>
    
    <div class="content">
        <p>Hi {{ $user->name }},</p>
        
        <p>Welcome to {{ config('app.name') }}! We're thrilled to have you join our community.</p>
        
        <div class="highlight-box">
            <h3>What's Next?</h3>
            <ul>
                <li>Complete your profile</li>
                <li>Explore our features</li>
                <li>Connect with other users</li>
            </ul>
        </div>
        
        <div style="text-align: center;">
            <a href="{{ route('login') }}" class="button">Get Started</a>
        </div>
        
        <p>If you have any questions, feel free to reach out to our support team at {{ config('mail.support_email', 'support@example.com') }}.</p>
        
        <p>Best regards,<br>
        The {{ config('app.name') }} Team</p>
    </div>
    
    <div class="footer">
        <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
    </div>
</body>
</html> 