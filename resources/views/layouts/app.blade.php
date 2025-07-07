<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <title>@yield('title', 'Mail Template Builder')</title>
    
    <!-- Tailwind CSS via Vite -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    
    <!-- Custom Styles -->
    <style>
        /* Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
        
        /* Drag and drop styles */
        .drag-over {
            border: 2px dashed #3b82f6 !important;
            background-color: rgba(59, 130, 246, 0.1) !important;
        }
        
        .dragging {
            opacity: 0.5;
        }
        
        /* Component hover effects */
        .component-item:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        /* Grid overlay */
        .grid-overlay {
            background-image: 
                linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
            background-size: 20px 20px;
        }
        
        /* Selection outline */
        .selected-element {
            outline: 2px solid #3b82f6;
            outline-offset: 2px;
        }
        
        /* Preview device frames */
        .device-frame {
            border-radius: 20px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
        }
        
        .mobile-frame {
            width: 375px;
            height: 667px;
        }
        
        .tablet-frame {
            width: 768px;
            height: 1024px;
        }
        
        .desktop-frame {
            width: 1200px;
            height: 800px;
        }
    </style>
    
    @stack('styles')
</head>
<body class="bg-gray-50 font-sans antialiased">
    @yield('content')
    
    <!-- Global JavaScript Variables -->
    <script>
        window.csrfToken = '{{ csrf_token() }}';
        window.apiBaseUrl = '{{ url("/api/mail-templates") }}';
        window.uploadUrl = '{{ url("/api/mail-templates/upload-image") }}';
        window.storageUrl = '{{ asset("storage") }}';
    </script>
    
    @stack('scripts')
</body>
</html> 