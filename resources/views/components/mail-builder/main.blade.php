<div class="mail-builder-container h-full" 
     data-template-name="{{ $templateName }}" 
     data-template="{{ $template ? json_encode($template) : '' }}">
    {{ $slot }}
    
    <!-- Quick Actions Menu (floating) -->
    <div id="quickActionsMenu" class="hidden fixed bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-2">
        <div class="grid grid-cols-2 gap-1">
            <button class="quick-action-btn p-2 text-xs text-gray-600 hover:bg-gray-100 rounded flex flex-col items-center" data-action="copy">
                <svg class="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-2m-6 4h8"></path>
                </svg>
                Copy
            </button>
            <button class="quick-action-btn p-2 text-xs text-gray-600 hover:bg-gray-100 rounded flex flex-col items-center" data-action="delete">
                <svg class="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Delete
            </button>
            <button class="quick-action-btn p-2 text-xs text-gray-600 hover:bg-gray-100 rounded flex flex-col items-center" data-action="move-up">
                <svg class="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                </svg>
                Up
            </button>
            <button class="quick-action-btn p-2 text-xs text-gray-600 hover:bg-gray-100 rounded flex flex-col items-center" data-action="move-down">
                <svg class="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
                Down
            </button>
        </div>
    </div>
    
    <!-- Context Menu -->
    <div id="contextMenu" class="hidden fixed bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
        <button class="context-menu-item w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100" data-action="edit">
            Edit Properties
        </button>
        <button class="context-menu-item w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100" data-action="duplicate">
            Duplicate
        </button>
        <hr class="my-1 border-gray-200">
        <button class="context-menu-item w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50" data-action="delete">
            Delete
        </button>
    </div>
    
    <!-- Global Loading State -->
    <div id="globalLoader" class="hidden fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 flex items-center space-x-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span class="text-gray-700 font-medium">Processing...</span>
        </div>
    </div>
    
    <!-- Drag Preview -->
    <div id="dragPreview" class="hidden fixed pointer-events-none z-50 bg-white border border-gray-200 rounded shadow-lg p-2 text-sm">
        <span id="dragPreviewText"></span>
    </div>
</div>

<style>
/* Component-specific styles */
.mail-builder-container {
    --sidebar-width: 280px;
    --properties-width: 320px;
    --toolbar-height: 60px;
    --header-height: 64px;
}

/* Animation for quick actions */
.quick-action-btn {
    transition: all 0.15s ease;
}

.quick-action-btn:hover {
    transform: scale(1.05);
}

/* Context menu animations */
#contextMenu {
    animation: fadeInUp 0.15s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Drag and drop states */
.drop-zone {
    min-height: 40px;
    border: 2px dashed transparent;
    transition: all 0.2s ease;
}

.drop-zone.drag-over {
    border-color: #3b82f6;
    background-color: rgba(59, 130, 246, 0.05);
}

.drop-zone:empty::before {
    content: "Drop components here";
    display: block;
    text-align: center;
    color: #9ca3af;
    font-size: 14px;
    padding: 20px;
}
</style> 