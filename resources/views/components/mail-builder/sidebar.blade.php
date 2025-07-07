<aside class="bg-white border-r border-gray-200 custom-scrollbar overflow-y-auto" style="width: var(--sidebar-width);">
    <!-- Sidebar Header -->
    <div class="p-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900 mb-3">Components</h2>
        
        <!-- Search Components -->
        <div class="relative">
            <input 
                type="text" 
                id="componentSearch" 
                placeholder="Search components..." 
                class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <svg class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
        </div>
    </div>
    
    <!-- Component Categories -->
    <div class="component-categories">
        <!-- Layout Components -->
        <x-mail-builder.component-category title="Layout" icon="layout" expanded="true">
            <x-mail-builder.component-item type="container" name="Container" icon="container" />
            <x-mail-builder.component-item type="row" name="Row" icon="rows" />
            <x-mail-builder.component-item type="column" name="Column" icon="columns" />
            <x-mail-builder.component-item type="section" name="Section" icon="section" />
            <x-mail-builder.component-item type="spacer" name="Spacer" icon="spacer" />
            <x-mail-builder.component-item type="grid" name="Grid" icon="grid" />
            <x-mail-builder.component-item type="divider" name="Divider" />
            <x-mail-builder.component-item type="social" name="Social Icons" />
            <x-mail-builder.component-item type="footer" name="Footer" />
            <x-mail-builder.component-item type="signature" name="Signature" />
        </x-mail-builder.component-category>
        
        <!-- Content Components -->
        <x-mail-builder.component-category title="Content" icon="content">
            <x-mail-builder.component-item type="heading" name="Heading" icon="heading" />
            <x-mail-builder.component-item type="text" name="Text" icon="text" />
            <x-mail-builder.component-item type="paragraph" name="Paragraph" icon="paragraph" />
            <x-mail-builder.component-item type="image" name="Image" icon="image" />
            <x-mail-builder.component-item type="button" name="Button" icon="button" />
            <x-mail-builder.component-item type="link" name="Link" icon="link" />
            <x-mail-builder.component-item type="list" name="List" icon="list" />
            <x-mail-builder.component-item type="table" name="Table" icon="table" />
        </x-mail-builder.component-category>
        
        <!-- Advanced Components -->
        <x-mail-builder.component-category title="Advanced" icon="advanced">
            <x-mail-builder.component-item type="header" name="Header" icon="header" />
            <x-mail-builder.component-item type="card" name="Card" icon="card" />
            <x-mail-builder.component-item type="banner" name="Banner" icon="banner" />
            <x-mail-builder.component-item type="hero" name="Hero Section" icon="hero" />
            <x-mail-builder.component-item type="testimonial" name="Testimonial" icon="testimonial" />
            <x-mail-builder.component-item type="pricing" name="Pricing" icon="pricing" />
        </x-mail-builder.component-category>
        
        <!-- Media Components -->
        <x-mail-builder.component-category title="Media" icon="media">
            <x-mail-builder.component-item type="image-gallery" name="Image Gallery" icon="gallery" />
            <x-mail-builder.component-item type="video" name="Video" icon="video" />
            <x-mail-builder.component-item type="gif" name="GIF" icon="gif" />
            <x-mail-builder.component-item type="icon" name="Icon" icon="icon" />
            <x-mail-builder.component-item type="logo" name="Logo" icon="logo" />
        </x-mail-builder.component-category>
        
        <!-- Form Components -->
        <x-mail-builder.component-category title="Forms" icon="forms">
            <x-mail-builder.component-item type="input" name="Input Field" icon="input" />
            <x-mail-builder.component-item type="textarea" name="Textarea" icon="textarea" />
            <x-mail-builder.component-item type="select" name="Select" icon="select" />
            <x-mail-builder.component-item type="checkbox" name="Checkbox" icon="checkbox" />
            <x-mail-builder.component-item type="radio" name="Radio" icon="radio" />
            <x-mail-builder.component-item type="form" name="Form" icon="form" />
        </x-mail-builder.component-category>
        
        <!-- Interactive Components -->
        <x-mail-builder.component-category title="Interactive" icon="interactive">
            <x-mail-builder.component-item type="cta" name="Call to Action" icon="cta" />
            <x-mail-builder.component-item type="countdown" name="Countdown" icon="countdown" />
            <x-mail-builder.component-item type="progress" name="Progress Bar" icon="progress" />
            <x-mail-builder.component-item type="rating" name="Rating" icon="rating" />
            <x-mail-builder.component-item type="tabs" name="Tabs" icon="tabs" />
            <x-mail-builder.component-item type="accordion" name="Accordion" icon="accordion" />
        </x-mail-builder.component-category>
        
        <!-- Stickers & Emojis -->
        <x-mail-builder.component-category title="Stickers & Emojis" icon="stickers">
            <div class="p-3">
                <!-- Emoji Categories -->
                <div class="flex flex-wrap gap-1 mb-3">
                    <button class="emoji-category-btn px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded active" data-category="smileys">😀</button>
                    <button class="emoji-category-btn px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded" data-category="people">👨</button>
                    <button class="emoji-category-btn px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded" data-category="nature">🌱</button>
                    <button class="emoji-category-btn px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded" data-category="food">🍎</button>
                    <button class="emoji-category-btn px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded" data-category="activities">⚽</button>
                    <button class="emoji-category-btn px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded" data-category="travel">✈️</button>
                    <button class="emoji-category-btn px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded" data-category="objects">💡</button>
                    <button class="emoji-category-btn px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded" data-category="symbols">❤️</button>
                </div>
                
                <!-- Emoji Grid -->
                <div id="emojiGrid" class="grid grid-cols-6 gap-1 text-lg">
                    <!-- Emojis will be populated by JavaScript -->
                </div>
                
                <!-- Stickers Section -->
                <div class="mt-4 pt-3 border-t border-gray-200">
                    <h4 class="text-sm font-medium text-gray-700 mb-2">Stickers</h4>
                    <div class="grid grid-cols-3 gap-2">
                        <div class="sticker-item p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50" draggable="true" data-type="sticker" data-sticker="celebration">
                            🎉
                        </div>
                        <div class="sticker-item p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50" draggable="true" data-type="sticker" data-sticker="fire">
                            🔥
                        </div>
                        <div class="sticker-item p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50" draggable="true" data-type="sticker" data-sticker="star">
                            ⭐
                        </div>
                        <div class="sticker-item p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50" draggable="true" data-type="sticker" data-sticker="check">
                            ✅
                        </div>
                        <div class="sticker-item p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50" draggable="true" data-type="sticker" data-sticker="heart">
                            💖
                        </div>
                        <div class="sticker-item p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50" draggable="true" data-type="sticker" data-sticker="thumbs-up">
                            👍
                        </div>
                    </div>
                </div>
            </div>
        </x-mail-builder.component-category>
        
        <!-- Templates Section -->
        <div class="border-t border-gray-200 p-4">
            <h3 class="text-sm font-medium text-gray-700 mb-3">Quick Templates</h3>
            <div class="space-y-2">
                <button class="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors" onclick="loadTemplate('welcome')">
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2"></path>
                            </svg>
                        </div>
                        <div>
                            <div class="text-sm font-medium text-gray-900">Welcome Email</div>
                            <div class="text-xs text-gray-500">Basic welcome template</div>
                        </div>
                    </div>
                </button>
                
                <button class="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors" onclick="loadTemplate('newsletter')">
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 011 1l4 4v9a2 2 0 01-2 2z"></path>
                            </svg>
                        </div>
                        <div>
                            <div class="text-sm font-medium text-gray-900">Newsletter</div>
                            <div class="text-xs text-gray-500">News and updates</div>
                        </div>
                    </div>
                </button>
                
                <button class="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors" onclick="loadTemplate('promotion')">
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                            </svg>
                        </div>
                        <div>
                            <div class="text-sm font-medium text-gray-900">Promotion</div>
                            <div class="text-xs text-gray-500">Sales and offers</div>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    </div>
</aside>

<style>
/* Sidebar specific styles */
.component-categories {
    height: calc(100vh - var(--header-height) - 120px);
    overflow-y: auto;
}

.emoji-category-btn.active {
    background-color: #3b82f6;
    color: white;
}

.emoji-item {
    transition: transform 0.15s ease;
    cursor: pointer;
}

.emoji-item:hover {
    transform: scale(1.2);
}

.sticker-item {
    font-size: 20px;
    text-align: center;
    transition: all 0.15s ease;
}

.sticker-item:hover {
    transform: scale(1.1);
    border-color: #3b82f6;
}

/* Search results */
.search-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #e5e7eb;
    border-top: none;
    border-radius: 0 0 0.375rem 0.375rem;
    max-height: 200px;
    overflow-y: auto;
    z-index: 10;
}

.search-result-item {
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid #f3f4f6;
    cursor: pointer;
    transition: background-color 0.15s ease;
}

.search-result-item:hover {
    background-color: #f9fafb;
}

.search-result-item:last-child {
    border-bottom: none;
}
</style> 