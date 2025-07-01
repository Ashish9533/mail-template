<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Mail Template Builder</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Allura&family=Pacifico&display=swap" rel="stylesheet">
    
    <style>
        /* Enhanced Sticker Styles */
        .email-sticker {
            transition: all 0.3s ease;
            position: relative;
        }
        
        .email-sticker:hover {
            transform: scale(1.1) rotate(5deg);
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
        }
        
        /* Draggable Component Indicators */
        .email-component {
            position: relative;
            transition: all 0.2s ease;
        }
        
        .email-component:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .email-component::before {
            content: '⋮⋮';
            position: absolute;
            top: 5px;
            right: 5px;
            color: #d1d5db;
            font-size: 12px;
            line-height: 8px;
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
            z-index: 10;
        }
        
        .email-component:hover::before {
            opacity: 1;
            color: #6b7280;
        }
        
        /* Sticker Gallery Enhancements */
        .sticker-gallery {
            max-height: 120px;
            overflow-y: auto;
            scrollbar-width: thin;
        }
        
        .sticker-gallery::-webkit-scrollbar {
            width: 4px;
        }
        
        .sticker-gallery::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 2px;
        }
        
        .sticker-gallery::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 2px;
        }
        
        .sticker-preview {
            font-size: 16px;
            line-height: 1.2;
            transition: all 0.2s ease;
        }
        
        .sticker-preview:hover {
            transform: scale(1.2);
            background: rgba(59, 130, 246, 0.1) !important;
        }
        
        /* Component repositioning visual feedback */
        .email-component.dragging {
            opacity: 0.5;
            transform: rotate(2deg) scale(0.95);
            z-index: 1000;
        }
        
        /* Drop zone enhancements */
        .droppable-container.drop-highlight {
            position: relative;
        }
        
        .droppable-container.drop-highlight::after {
            content: '📌 Drop here';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(59, 130, 246, 0.9);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            pointer-events: none;
            z-index: 20;
            animation: pulse 1s infinite;
        }
        
        /* Fun sticker animation */
        .email-sticker.animate {
            animation: stickerBounce 0.6s ease;
        }
        
        @keyframes stickerBounce {
            0% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.2) rotate(10deg); }
            100% { transform: scale(1) rotate(0deg); }
        }
        
        /* Quick add menu styling */
        .quick-add-menu {
            animation: fadeInScale 0.2s ease;
        }
        
        @keyframes fadeInScale {
            0% { opacity: 0; transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1); }
        }
        
        /* Enhanced drag feedback */
        .component-item.dragging {
            transform: rotate(-5deg) scale(0.9);
            opacity: 0.7;
        }
        
        /* Visual improvements for the sticker component item */
        .component-item[data-component="sticker"] {
            background: linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 100%);
            border-color: #e879f9;
        }
        
        .component-item[data-component="sticker"]:hover {
            background: linear-gradient(135deg, #fce7f3 0%, #ede9fe 100%);
            border-color: #d946ef;
            transform: scale(1.02);
        }
        
        /* Visual improvements for the image upload component */
        .component-item[data-component="imageUpload"] {
            background: linear-gradient(135deg, #ecfdf5 0%, #dbeafe 100%);
            border-color: #10b981;
        }
        
        .component-item[data-component="imageUpload"]:hover {
            background: linear-gradient(135deg, #d1fae5 0%, #bfdbfe 100%);
            border-color: #059669;
            transform: scale(1.02);
        }
        
        /* Free dragging styles */
        .draggable-sticker, .draggable-image {
            transition: all 0.2s ease;
        }
        
        .draggable-sticker:hover, .draggable-image:hover {
            transform: scale(1.05);
            z-index: 10;
        }
        
        /* Image upload specific styles */
        .email-image-upload {
            position: relative;
        }
        
        .email-image-upload img {
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .email-image-upload img:hover {
            filter: brightness(1.1);
            transform: scale(1.02);
        }
        
        .email-image-upload img.animate {
            animation: imageUploadSuccess 0.6s ease;
        }
        
        @keyframes imageUploadSuccess {
            0% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
        }
        
        /* Upload indicator */
        .upload-indicator {
            backdrop-filter: blur(4px);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        /* Draggable positioning feedback */
        .email-sticker.dragging, .email-image-upload.dragging {
            opacity: 0.7;
            transform: scale(0.95) rotate(1deg);
            z-index: 1000;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }
        
        /* Position controls in properties panel */
        .position-controls {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }
        
        /* Enhanced component borders for absolute positioned elements */
        .email-component .draggable-sticker,
        .email-component .draggable-image {
            border: 1px dashed transparent;
            border-radius: 4px;
            padding: 2px;
            transition: border-color 0.2s ease;
        }
        
        .email-component:hover .draggable-sticker,
        .email-component:hover .draggable-image {
            border-color: #93c5fd;
        }
        
        .email-component.selected .draggable-sticker,
        .email-component.selected .draggable-image {
            border-color: #3b82f6;
        }
        
        /* Enhanced Heading Styles */
        .draggable-heading {
            transition: all 0.2s ease;
            min-height: 30px;
            min-width: 50px;
            position: relative;
        }
        
        .draggable-heading:hover {
            background: rgba(59, 130, 246, 0.05) !important;
        }
        
        .draggable-heading:focus {
            background: rgba(59, 130, 246, 0.1) !important;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
            cursor: text !important;
        }
        
        .draggable-heading[contenteditable="true"]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            font-style: italic;
            pointer-events: none;
        }
        
        /* Heading drag handle */
        .heading-drag-handle {
            font-family: 'Courier New', monospace;
            font-weight: bold;
            user-select: none;
            line-height: 1;
            letter-spacing: -1px;
        }
        
        .heading-drag-handle:hover {
            background: #2563eb !important;
            transform: scale(1.15) !important;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
        }
        
        .heading-drag-handle:active {
            background: #1d4ed8 !important;
            transform: scale(1.05) !important;
        }
        
        /* Position indicator for dragged headings */
        .draggable-heading.dragging {
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4) !important;
            z-index: 1000 !important;
        }
        
        /* Enhanced heading component wrapper */
        .email-component[data-component-type="heading"] {
            min-height: 60px;
            display: flex;
            align-items: flex-start;
            overflow: visible;
        }
        
        .email-component[data-component-type="heading"]:hover {
            background: rgba(59, 130, 246, 0.02);
            border-radius: 4px;
        }
        
        /* Transform-based positioning for smooth dragging */
        .draggable-heading.drag-transform {
            transition: none !important;
        }
        
        /* Drag cursor states */
        .draggable-heading.drag-mode {
            cursor: grab !important;
        }
        
        .draggable-heading.drag-mode:active {
            cursor: grabbing !important;
        }
        
        /* Responsive heading adjustments */
        @media (max-width: 768px) {
            .draggable-heading {
                font-size: 18px !important;
            }
            
            .heading-drag-handle {
                width: 18px !important;
                height: 18px !important;
                font-size: 9px !important;
            }
        }
        
        /* Text selection styles for headings */
        .draggable-heading::selection {
            background: rgba(59, 130, 246, 0.3);
        }
        
        /* Heading level visual indicators in properties */
        .heading-level-preview {
            font-weight: bold;
            margin-left: 8px;
            color: #6b7280;
        }
        
        /* Smooth drag feedback */
        .heading-drag-active {
            pointer-events: none;
            user-select: none;
        }
        
        /* Container positioning context */
        .email-component[data-component-type="heading"] {
            position: relative;
            contain: layout;
        }
        
        /* Enhanced container styles for better heading positioning */
        .droppable-container {
            position: relative;
            min-height: 50px;
        }
        
        .droppable-container:hover {
            background: rgba(59, 130, 246, 0.02);
            border-color: rgba(59, 130, 246, 0.2) !important;
        }
        
        /* Visual feedback for heading positioning within containers */
        .droppable-container.heading-drag-active {
            background: rgba(59, 130, 246, 0.08) !important;
            border: 2px dashed rgba(59, 130, 246, 0.4) !important;
        }
        
        .droppable-container.heading-drag-active::after {
            content: 'Heading positioning area';
            position: absolute;
            top: 4px;
            left: 4px;
            font-size: 10px;
            color: rgba(59, 130, 246, 0.7);
            background: rgba(255, 255, 255, 0.9);
            padding: 2px 6px;
            border-radius: 3px;
            pointer-events: none;
            z-index: 5;
        }
        
        /* Better visibility for nested headings */
        .droppable-container .email-component[data-component-type="heading"] {
            position: relative;
            z-index: 2;
        }
        
        .droppable-container .draggable-heading {
            position: relative;
            z-index: 3;
        }
        
        /* Enhanced drag handle visibility in containers */
        .droppable-container .heading-drag-handle {
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        
        /* Enhanced Text Component Styles */
        .email-text {
            transition: all 0.2s ease;
        }
        
        .email-text:hover {
            transform: translateY(-1px);
        }
        
        .email-text[contenteditable="true"]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            font-style: italic;
            pointer-events: none;
        }
        
        .email-text::selection {
            background: rgba(16, 185, 129, 0.3);
        }
        
        /* Enhanced Signature Styles */
        .email-signature {
            transition: all 0.2s ease;
            position: relative;
        }
        
        .email-signature:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
        }
        
        .signature-content {
            transition: all 0.2s ease;
        }
        
        .signature-content:focus {
            transform: none !important;
        }
        
        .signature-content[contenteditable="true"]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            font-style: italic;
            pointer-events: none;
        }
        
        .signature-content::selection {
            background: rgba(245, 158, 11, 0.3);
        }
        
        /* Visual improvements for the signature component item */
        .component-item[data-component="signature"] {
            background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
            border-color: #f59e0b;
        }
        
        .component-item[data-component="signature"]:hover {
            background: linear-gradient(135deg, #fef0c7 0%, #fed0a4 100%);
            border-color: #d97706;
            transform: scale(1.02);
        }
        
        /* Signature Creator Modal Styles */
        .tab-button {
            transition: all 0.2s ease;
        }
        
        .tab-button.active {
            background: #3b82f6 !important;
            color: white !important;
        }
        
        .tab-button:not(.active):hover {
            background: #e5e7eb !important;
            color: #374151 !important;
        }
        
        .tab-content {
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        #signature-canvas {
            touch-action: none;
        }
        
        #typed-signature-preview {
            transition: all 0.3s ease;
        }
        
        .signature-font-preview {
            font-size: 24px;
            color: #1f2937;
        }
    </style>
</head>
<body class="bg-gray-100 font-sans">
    <!-- Hidden CSRF token as backup -->
    <input type="hidden" name="_token" value="{{ csrf_token() }}" id="csrf-token-input">
    
    <div id="mail-template-builder" class="h-screen flex flex-col">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b border-gray-200 p-4 flex justify-between items-center">
            <div class="flex items-center space-x-4">
                <h1 class="text-2xl font-bold text-gray-800">
                    <i class="fas fa-envelope-open-text text-blue-600"></i>
                    Mail Template Builder
                </h1>
                <div class="flex items-center space-x-2">
                    <input type="text" id="template-name" placeholder="Template Name" 
                           class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <button id="new-template-btn" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors">
                    <i class="fas fa-plus"></i> New
                </button>
                <button id="preview-btn" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors">
                    <i class="fas fa-eye"></i> Preview
                </button>
                <button id="save-btn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                    <i class="fas fa-save"></i> Save
                </button>
                <button id="load-btn" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors">
                    <i class="fas fa-folder-open"></i> Load
                </button>
                <button id="export-btn" class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md transition-colors">
                    <i class="fas fa-download"></i> Export
                </button>
                <button id="clear-btn" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors">
                    <i class="fas fa-trash"></i> Clear
                </button>
            </div>
        </header>

        <div class="flex flex-1 overflow-hidden">
            <!-- Sidebar - Component Library -->
            <aside class="w-80 bg-white border-r border-gray-200 overflow-y-auto">
                <div class="p-4">
                    <h2 class="text-lg font-semibold text-gray-800 mb-4">Components</h2>
                    
                    <!-- Component Categories -->
                    <div class="space-y-4">
                        <!-- Layout Components -->
                        <div class="component-category">
                            <h3 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <i class="fas fa-th-large mr-2"></i> Layout
                            </h3>
                            <div class="grid grid-cols-2 gap-2">
                                <div class="component-item cursor-pointer bg-gray-50 hover:bg-gray-100 p-3 rounded-md border-2 border-dashed border-gray-300 transition-all"
                                     data-component="container" draggable="true">
                                    <i class="fas fa-square text-gray-500"></i>
                                    <span class="text-xs block mt-1">Container</span>
                                </div>
                                <div class="component-item cursor-pointer bg-gray-50 hover:bg-gray-100 p-3 rounded-md border-2 border-dashed border-gray-300 transition-all"
                                     data-component="row" draggable="true">
                                    <i class="fas fa-grip-lines text-gray-500"></i>
                                    <span class="text-xs block mt-1">Row</span>
                                </div>
                                <div class="component-item cursor-pointer bg-gray-50 hover:bg-gray-100 p-3 rounded-md border-2 border-dashed border-gray-300 transition-all"
                                     data-component="column" draggable="true">
                                    <i class="fas fa-columns text-gray-500"></i>
                                    <span class="text-xs block mt-1">Column</span>
                                </div>
                                <div class="component-item cursor-pointer bg-gray-50 hover:bg-gray-100 p-3 rounded-md border-2 border-dashed border-gray-300 transition-all"
                                     data-component="spacer" draggable="true">
                                    <i class="fas fa-arrows-alt-v text-gray-500"></i>
                                    <span class="text-xs block mt-1">Spacer</span>
                                </div>
                                <div class="component-item cursor-pointer bg-gray-50 hover:bg-gray-100 p-3 rounded-md border-2 border-dashed border-gray-300 transition-all"
                                     data-component="grid" draggable="true">
                                    <i class="fas fa-th text-gray-500"></i>
                                    <span class="text-xs block mt-1">Grid</span>
                                </div>
                                <div class="component-item cursor-pointer bg-gray-50 hover:bg-gray-100 p-3 rounded-md border-2 border-dashed border-gray-300 transition-all"
                                     data-component="section" draggable="true">
                                    <i class="fas fa-layer-group text-gray-500"></i>
                                    <span class="text-xs block mt-1">Section</span>
                                </div>
                            </div>
                        </div>

                        <!-- Content Components -->
                        <div class="component-category">
                            <h3 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <i class="fas fa-font mr-2"></i> Content
                            </h3>
                            <div class="grid grid-cols-2 gap-2">
                                <div class="component-item cursor-pointer bg-gray-50 hover:bg-gray-100 p-3 rounded-md border-2 border-dashed border-gray-300 transition-all"
                                     data-component="heading" draggable="true">
                                    <i class="fas fa-heading text-gray-500"></i>
                                    <span class="text-xs block mt-1">Heading</span>
                                </div>
                                <div class="component-item cursor-pointer bg-gray-50 hover:bg-gray-100 p-3 rounded-md border-2 border-dashed border-gray-300 transition-all"
                                     data-component="text" draggable="true">
                                    <i class="fas fa-paragraph text-gray-500"></i>
                                    <span class="text-xs block mt-1">Text</span>
                                </div>
                                <div class="component-item cursor-pointer bg-gray-50 hover:bg-gray-100 p-3 rounded-md border-2 border-dashed border-gray-300 transition-all"
                                     data-component="image" draggable="true">
                                    <i class="fas fa-image text-gray-500"></i>
                                    <span class="text-xs block mt-1">Image</span>
                                </div>
                                <div class="component-item cursor-pointer bg-gradient-to-r from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100 p-3 rounded-md border-2 border-dashed border-green-300 transition-all"
                                     data-component="imageUpload" draggable="true">
                                    <i class="fas fa-upload text-green-500"></i>
                                    <span class="text-xs block mt-1 text-green-600 font-medium">Upload</span>
                                </div>
                                <div class="component-item cursor-pointer bg-gray-50 hover:bg-gray-100 p-3 rounded-md border-2 border-dashed border-gray-300 transition-all"
                                     data-component="button" draggable="true">
                                    <i class="fas fa-hand-pointer text-gray-500"></i>
                                    <span class="text-xs block mt-1">Button</span>
                                </div>
                                <div class="component-item cursor-pointer bg-gray-50 hover:bg-gray-100 p-3 rounded-md border-2 border-dashed border-gray-300 transition-all"
                                     data-component="list" draggable="true">
                                    <i class="fas fa-list text-gray-500"></i>
                                    <span class="text-xs block mt-1">List</span>
                                </div>
                                <div class="component-item cursor-pointer bg-gray-50 hover:bg-gray-100 p-3 rounded-md border-2 border-dashed border-gray-300 transition-all"
                                     data-component="table" draggable="true">
                                    <i class="fas fa-table text-gray-500"></i>
                                    <span class="text-xs block mt-1">Table</span>
                                </div>
                                <div class="component-item cursor-pointer bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 p-3 rounded-md border-2 border-dashed border-amber-300 transition-all"
                                     data-component="signature" draggable="true">
                                    <i class="fas fa-signature text-amber-600"></i>
                                    <span class="text-xs block mt-1 text-amber-700 font-medium">Signature</span>
                                </div>
                            </div>
                        </div>

                        <!-- Advanced Components -->
                        <div class="component-category">
                            <h3 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <i class="fas fa-puzzle-piece mr-2"></i> Advanced
                            </h3>
                            <div class="grid grid-cols-2 gap-2">
                                <div class="component-item cursor-pointer bg-gray-50 hover:bg-gray-100 p-3 rounded-md border-2 border-dashed border-gray-300 transition-all"
                                     data-component="header" draggable="true">
                                    <i class="fas fa-window-maximize text-gray-500"></i>
                                    <span class="text-xs block mt-1">Header</span>
                                </div>
                                <div class="component-item cursor-pointer bg-gray-50 hover:bg-gray-100 p-3 rounded-md border-2 border-dashed border-gray-300 transition-all"
                                     data-component="footer" draggable="true">
                                    <i class="fas fa-window-minimize text-gray-500"></i>
                                    <span class="text-xs block mt-1">Footer</span>
                                </div>
                                <div class="component-item cursor-pointer bg-gray-50 hover:bg-gray-100 p-3 rounded-md border-2 border-dashed border-gray-300 transition-all"
                                     data-component="social" draggable="true">
                                    <i class="fas fa-share-alt text-gray-500"></i>
                                    <span class="text-xs block mt-1">Social</span>
                                </div>
                                <div class="component-item cursor-pointer bg-gray-50 hover:bg-gray-100 p-3 rounded-md border-2 border-dashed border-gray-300 transition-all"
                                     data-component="divider" draggable="true">
                                    <i class="fas fa-minus text-gray-500"></i>
                                    <span class="text-xs block mt-1">Divider</span>
                                </div>
                                <div class="component-item cursor-pointer bg-gray-50 hover:bg-gray-100 p-3 rounded-md border-2 border-dashed border-gray-300 transition-all"
                                     data-component="card" draggable="true">
                                    <i class="fas fa-id-card text-gray-500"></i>
                                    <span class="text-xs block mt-1">Card</span>
                                </div>
                                <div class="component-item cursor-pointer bg-gray-50 hover:bg-gray-100 p-3 rounded-md border-2 border-dashed border-gray-300 transition-all"
                                     data-component="banner" draggable="true">
                                    <i class="fas fa-flag text-gray-500"></i>
                                    <span class="text-xs block mt-1">Banner</span>
                                </div>
                            </div>
                        </div>

                        <!-- Stickers & Decorative -->
                        <div class="component-category">
                            <h3 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <i class="fas fa-star mr-2"></i> Stickers & Fun
                            </h3>
                            <div class="space-y-2">
                                <div class="component-item cursor-pointer bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 p-3 rounded-md border-2 border-dashed border-pink-300 transition-all"
                                     data-component="sticker" draggable="true">
                                    <div class="text-center">
                                        <span class="text-2xl">🎉</span>
                                        <span class="text-xs block mt-1 text-pink-600 font-medium">Sticker</span>
                                    </div>
                                </div>
                                <div class="sticker-gallery grid grid-cols-4 gap-1 p-2 bg-gray-50 rounded-md">
                                    <div class="sticker-preview cursor-pointer text-center p-1 hover:bg-white rounded transition-all" data-sticker="🎉" title="Party">🎉</div>
                                    <div class="sticker-preview cursor-pointer text-center p-1 hover:bg-white rounded transition-all" data-sticker="✨" title="Sparkles">✨</div>
                                    <div class="sticker-preview cursor-pointer text-center p-1 hover:bg-white rounded transition-all" data-sticker="🔥" title="Fire">🔥</div>
                                    <div class="sticker-preview cursor-pointer text-center p-1 hover:bg-white rounded transition-all" data-sticker="⭐" title="Star">⭐</div>
                                    <div class="sticker-preview cursor-pointer text-center p-1 hover:bg-white rounded transition-all" data-sticker="❤️" title="Heart">❤️</div>
                                    <div class="sticker-preview cursor-pointer text-center p-1 hover:bg-white rounded transition-all" data-sticker="👍" title="Thumbs Up">👍</div>
                                    <div class="sticker-preview cursor-pointer text-center p-1 hover:bg-white rounded transition-all" data-sticker="🎯" title="Target">🎯</div>
                                    <div class="sticker-preview cursor-pointer text-center p-1 hover:bg-white rounded transition-all" data-sticker="💡" title="Idea">💡</div>
                                    <div class="sticker-preview cursor-pointer text-center p-1 hover:bg-white rounded transition-all" data-sticker="🚀" title="Rocket">🚀</div>
                                    <div class="sticker-preview cursor-pointer text-center p-1 hover:bg-white rounded transition-all" data-sticker="💎" title="Diamond">💎</div>
                                    <div class="sticker-preview cursor-pointer text-center p-1 hover:bg-white rounded transition-all" data-sticker="🎊" title="Confetti">🎊</div>
                                    <div class="sticker-preview cursor-pointer text-center p-1 hover:bg-white rounded transition-all" data-sticker="🌟" title="Glowing Star">🌟</div>
                                    <div class="sticker-preview cursor-pointer text-center p-1 hover:bg-white rounded transition-all" data-sticker="💯" title="100">💯</div>
                                    <div class="sticker-preview cursor-pointer text-center p-1 hover:bg-white rounded transition-all" data-sticker="⚡" title="Lightning">⚡</div>
                                    <div class="sticker-preview cursor-pointer text-center p-1 hover:bg-white rounded transition-all" data-sticker="🎁" title="Gift">🎁</div>
                                    <div class="sticker-preview cursor-pointer text-center p-1 hover:bg-white rounded transition-all" data-sticker="🏆" title="Trophy">🏆</div>
                                </div>
                            </div>
                        </div>

                        <!-- Pre-built Templates -->
                        <div class="component-category">
                            <h3 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <i class="fas fa-clipboard-list mr-2"></i> Templates
                            </h3>
                            <div class="space-y-2">
                                <div class="template-item cursor-pointer bg-blue-50 hover:bg-blue-100 p-3 rounded-md border border-blue-200 transition-all"
                                     data-template="newsletter">
                                    <i class="fas fa-newspaper text-blue-500"></i>
                                    <span class="text-sm block mt-1">Newsletter</span>
                                </div>
                                <div class="template-item cursor-pointer bg-green-50 hover:bg-green-100 p-3 rounded-md border border-green-200 transition-all"
                                     data-template="welcome">
                                    <i class="fas fa-hand-wave text-green-500"></i>
                                    <span class="text-sm block mt-1">Welcome Email</span>
                                </div>
                                <div class="template-item cursor-pointer bg-purple-50 hover:bg-purple-100 p-3 rounded-md border border-purple-200 transition-all"
                                     data-template="promotion">
                                    <i class="fas fa-percentage text-purple-500"></i>
                                    <span class="text-sm block mt-1">Promotion</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            <!-- Main Content Area -->
            <main class="flex-1 flex flex-col">
                <!-- Enhanced Toolbar -->
                <div class="bg-white border-b border-gray-200 p-3 flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <div class="flex items-center space-x-2">
                            <label class="text-sm font-medium text-gray-700">Device:</label>
                            <select id="device-selector" class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="desktop">Desktop</option>
                                <option value="tablet">Tablet</option>
                                <option value="mobile">Mobile</option>
                            </select>
                        </div>
                        <div class="flex items-center space-x-2">
                            <label class="text-sm font-medium text-gray-700">Zoom:</label>
                            <select id="zoom-selector" class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="0.5">50%</option>
                                <option value="0.75">75%</option>
                                <option value="1" selected>100%</option>
                                <option value="1.25">125%</option>
                                <option value="1.5">150%</option>
                            </select>
                        </div>
                        <div class="border-l border-gray-300 h-6 mx-2"></div>
                        <div class="flex items-center space-x-1">
                            <button id="grid-toggle" class="px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors" title="Toggle Grid">
                                <i class="fas fa-th"></i>
                            </button>
                            <button id="snap-toggle" class="px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors" title="Toggle Snap">
                                <i class="fas fa-magnet"></i>
                            </button>
                            <button id="rulers-toggle" class="px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors" title="Toggle Rulers">
                                <i class="fas fa-ruler-combined"></i>
                            </button>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button id="copy-component" class="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors" title="Copy Component">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button id="paste-component" class="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors" title="Paste Component">
                            <i class="fas fa-paste"></i>
                        </button>
                        <button id="duplicate-component" class="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors" title="Duplicate Component">
                            <i class="fas fa-clone"></i>
                        </button>
                        <div class="border-l border-gray-300 h-6 mx-2"></div>
                        <button id="undo-btn" class="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors" title="Undo">
                            <i class="fas fa-undo"></i>
                        </button>
                        <button id="redo-btn" class="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors" title="Redo">
                            <i class="fas fa-redo"></i>
                        </button>
                        <div class="border-l border-gray-300 h-6 mx-2"></div>
                        <button id="align-left" class="px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors" title="Align Left">
                            <i class="fas fa-align-left"></i>
                        </button>
                        <button id="align-center" class="px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors" title="Align Center">
                            <i class="fas fa-align-center"></i>
                        </button>
                        <button id="align-right" class="px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors" title="Align Right">
                            <i class="fas fa-align-right"></i>
                        </button>
                        <div class="border-l border-gray-300 h-6 mx-2"></div>
                        <button id="code-view-btn" class="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors">
                            <i class="fas fa-code"></i> Code
                        </button>
                    </div>
                </div>

                <!-- Canvas Container with Grid and Rulers -->
                <div class="flex-1 bg-gray-100 p-4 overflow-auto relative">
                    <!-- Rulers -->
                    <div id="ruler-horizontal" class="absolute top-0 left-0 right-0 h-6 bg-gray-200 border-b hidden" style="z-index: 10;"></div>
                    <div id="ruler-vertical" class="absolute top-0 left-0 bottom-0 w-6 bg-gray-200 border-r hidden" style="z-index: 10;"></div>
                    
                    <!-- Canvas -->
                    <div id="canvas-container" class="mx-auto bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 relative"
                         style="width: 600px; min-height: 800px;">
                        <!-- Grid Overlay -->
                        <div id="grid-overlay" class="absolute inset-0 pointer-events-none hidden" style="z-index: 1;"></div>
                        
                        <!-- Drop Zones -->
                        <div id="drop-zones" class="absolute inset-0 pointer-events-none" style="z-index: 2;"></div>
                        
                        <div id="email-canvas" class="relative min-h-screen p-4 border-2 border-dashed border-gray-300" style="z-index: 3;">
                            <div class="text-center text-gray-500 mt-32">
                                <i class="fas fa-mouse-pointer text-4xl mb-4"></i>
                                <p class="text-lg">Drag components here to start building your email template</p>
                                <p class="text-sm mt-2">Or choose from pre-built templates in the sidebar</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <!-- Enhanced Properties Panel -->
            <aside id="properties-panel" class="w-80 bg-white border-l border-gray-200 overflow-y-auto hidden">
                <div class="p-4">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-semibold text-gray-800">Properties</h2>
                        <button id="close-properties" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div id="properties-content">
                        <p class="text-gray-500 text-center py-8">Select an element to edit its properties</p>
                    </div>
                </div>
            </aside>
        </div>
    </div>

    <!-- Modals -->
    <!-- New Template Modal -->
    <div id="new-template-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-semibold">Create New Template</h3>
                <button class="modal-close text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <form id="new-template-form" class="space-y-6">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                        <input type="text" id="new-template-name" required 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                               placeholder="My Awesome Template">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select id="new-template-category" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="newsletter">Newsletter</option>
                            <option value="marketing">Marketing</option>
                            <option value="transactional">Transactional</option>
                            <option value="announcement">Announcement</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea id="new-template-description" rows="3" 
                              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Brief description of your template..."></textarea>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                        <input type="text" id="new-template-audience" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                               placeholder="e.g., Customers, Subscribers">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
                        <input type="text" id="new-template-subject" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                               placeholder="Default subject line">
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Template Variables</label>
                    <div id="template-variables" class="space-y-2">
                        <div class="flex items-center space-x-2">
                            <input type="text" placeholder="Variable name (e.g., user_name)" 
                                   class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <input type="text" placeholder="Default value" 
                                   class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <button type="button" class="remove-variable text-red-500 hover:text-red-700">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <button type="button" id="add-variable" class="mt-2 text-blue-600 hover:text-blue-800 text-sm">
                        <i class="fas fa-plus mr-1"></i> Add Variable
                    </button>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-3">Starting Layout</label>
                    <div class="grid grid-cols-3 gap-3">
                        <div class="template-layout cursor-pointer border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                             data-layout="blank">
                            <div class="h-16 bg-gray-100 rounded mb-2"></div>
                            <p class="text-xs text-center">Blank Canvas</p>
                        </div>
                        <div class="template-layout cursor-pointer border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                             data-layout="basic">
                            <div class="space-y-1 mb-2">
                                <div class="h-3 bg-blue-200 rounded"></div>
                                <div class="h-8 bg-gray-100 rounded"></div>
                                <div class="h-3 bg-gray-200 rounded"></div>
                            </div>
                            <p class="text-xs text-center">Basic Layout</p>
                        </div>
                        <div class="template-layout cursor-pointer border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                             data-layout="advanced">
                            <div class="space-y-1 mb-2">
                                <div class="h-2 bg-blue-200 rounded"></div>
                                <div class="grid grid-cols-2 gap-1">
                                    <div class="h-6 bg-gray-100 rounded"></div>
                                    <div class="h-6 bg-gray-100 rounded"></div>
                                </div>
                                <div class="h-2 bg-gray-200 rounded"></div>
                            </div>
                            <p class="text-xs text-center">Advanced Layout</p>
                        </div>
                    </div>
                </div>
                
                <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button type="button" class="modal-close px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors">
                        Create Template
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Load Template Modal -->
    <div id="load-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-screen overflow-y-auto">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold">Load Template</h3>
                <button class="modal-close text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <!-- Template Filters -->
            <div class="flex items-center space-x-4 mb-6">
                <div class="flex-1">
                    <input type="text" id="template-search" placeholder="Search templates..." 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <select id="template-filter-category" 
                        class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Categories</option>
                    <option value="newsletter">Newsletter</option>
                    <option value="marketing">Marketing</option>
                    <option value="transactional">Transactional</option>
                    <option value="announcement">Announcement</option>
                    <option value="custom">Custom</option>
                </select>
            </div>
            
            <div id="templates-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- Templates will be loaded here -->
            </div>
        </div>
    </div>

    <!-- Code View Modal -->
    <div id="code-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 w-full max-w-6xl mx-4 h-5/6 flex flex-col">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold">HTML/CSS Code</h3>
                <div class="flex items-center space-x-2">
                    <button id="format-code" class="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors">
                        Format
                    </button>
                    <button class="modal-close text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="flex-1 flex space-x-4">
                <div class="flex-1 flex flex-col">
                    <label class="text-sm font-medium text-gray-700 mb-2">HTML</label>
                    <textarea id="html-code" class="flex-1 font-mono text-sm border border-gray-300 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
                <div class="flex-1 flex flex-col">
                    <label class="text-sm font-medium text-gray-700 mb-2">CSS</label>
                    <textarea id="css-code" class="flex-1 font-mono text-sm border border-gray-300 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
            </div>
            <div class="mt-4 flex justify-end space-x-2">
                <button id="apply-code" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                    Apply Changes
                </button>
                <button class="modal-close bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors">
                    Close
                </button>
            </div>
        </div>
    </div>

    <!-- Signature Creator Modal -->
    <div id="signature-creator-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-semibold">Create Signature</h3>
                <button class="modal-close text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="mb-6">
                <div class="flex space-x-4 mb-4">
                    <button id="draw-signature-tab" class="tab-button active px-4 py-2 bg-blue-600 text-white rounded-md transition-colors">
                        <i class="fas fa-pen mr-2"></i>Draw Signature
                    </button>
                    <button id="upload-signature-tab" class="tab-button px-4 py-2 bg-gray-200 text-gray-700 rounded-md transition-colors">
                        <i class="fas fa-upload mr-2"></i>Upload Image
                    </button>
                    <button id="type-signature-tab" class="tab-button px-4 py-2 bg-gray-200 text-gray-700 rounded-md transition-colors">
                        <i class="fas fa-keyboard mr-2"></i>Type Text
                    </button>
                </div>

                <!-- Draw Signature Tab -->
                <div id="draw-signature-content" class="tab-content">
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
                        <canvas id="signature-canvas" width="500" height="200" class="border border-gray-300 rounded cursor-crosshair w-full" style="background: white;"></canvas>
                        <div class="flex justify-between mt-3">
                            <button id="clear-signature" class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
                                <i class="fas fa-eraser mr-1"></i>Clear
                            </button>
                            <div class="flex items-center space-x-2">
                                <label class="text-sm text-gray-600">Pen Size:</label>
                                <input type="range" id="pen-size" min="1" max="5" value="2" class="w-16">
                                <span id="pen-size-value" class="text-sm text-gray-600">2px</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Upload Signature Tab -->
                <div id="upload-signature-content" class="tab-content hidden">
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input type="file" id="signature-file-input" accept="image/*" class="hidden">
                        <button id="upload-signature-btn" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors">
                            <i class="fas fa-cloud-upload-alt mr-2"></i>Choose Signature Image
                        </button>
                        <p class="text-sm text-gray-500 mt-2">Supports PNG, JPG, GIF (Max 2MB)</p>
                        <div id="uploaded-signature-preview" class="mt-4 hidden">
                            <img id="uploaded-signature-img" class="max-w-full h-auto max-h-40 mx-auto border rounded">
                        </div>
                    </div>
                </div>

                <!-- Type Signature Tab -->
                <div id="type-signature-content" class="tab-content hidden">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                            <input type="text" id="typed-signature" placeholder="Enter your name" 
                                   class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Font Style</label>
                            <select id="signature-font" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="cursive" style="font-family: cursive;">Cursive</option>
                                <option value="'Dancing Script', cursive" style="font-family: 'Dancing Script', cursive;">Dancing Script</option>
                                <option value="'Great Vibes', cursive" style="font-family: 'Great Vibes', cursive;">Great Vibes</option>
                                <option value="'Allura', cursive" style="font-family: 'Allura', cursive;">Allura</option>
                                <option value="'Pacifico', cursive" style="font-family: 'Pacifico', cursive;">Pacifico</option>
                            </select>
                        </div>
                        <div id="typed-signature-preview" class="border border-gray-300 rounded-lg p-4 text-center bg-gray-50 min-h-20 flex items-center justify-center">
                            <span class="text-gray-400">Preview will appear here</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="flex justify-end space-x-3">
                <button class="modal-close px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                    Cancel
                </button>
                <button id="save-signature" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors">
                    <i class="fas fa-check mr-2"></i>Add to Email
                </button>
            </div>
        </div>
    </div>

    <!-- Notification -->
    <div id="notification" class="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-md shadow-lg transform translate-x-full transition-transform duration-300 z-50">
        <div class="flex items-center">
            <i class="fas fa-check-circle mr-2"></i>
            <span id="notification-text">Success!</span>
        </div>
    </div>

    <script src="{{ asset('js/mail-template-builder.js') }}"></script>
</body>
</html> 