<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mail Template Preview</title>
    <style>
        {!! $css !!}
    </style>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background-color: #f3f4f6;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .preview-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        .preview-header {
            background: #374151;
            color: white;
            padding: 15px 20px;
            display: flex;
            justify-content: between;
            align-items: center;
        }
        .preview-title {
            font-size: 18px;
            font-weight: 600;
        }
        .preview-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 20px;
        }
        .preview-content {
            padding: 0;
        }
    </style>
</head>
<body>
    <div class="preview-container">
        <div class="preview-header">
            <div class="preview-title">Email Preview</div>
            <button class="preview-close" onclick="window.close()">&times;</button>
        </div>
        <div class="preview-content">
            {!! $html !!}
        </div>
    </div>
</body>
</html> 