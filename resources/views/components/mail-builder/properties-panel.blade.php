<aside class="bg-white border-l border-gray-200 overflow-y-auto custom-scrollbar" style="width: var(--properties-width);" id="propertiesPanel">
    <!-- Panel Header -->
    <div class="p-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Properties</h3>
        <p class="text-sm text-gray-500 mt-1">Customize the selected element</p>
    </div>
    
    <!-- Properties Content -->
    <div id="propertiesContent" class="p-4 flex-1  overflow-y-auto">
        <!-- Default State - No Selection -->
        <div id="noSelection" class="text-center py-8">
            <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
            </svg>
            <p class="text-gray-500 text-sm">Select an element to edit its properties</p>
        </div>
        
        <!-- Dynamic Properties Form -->
        <div id="dynamicProperties" class="hidden space-y-6">
            <!-- Properties will be dynamically loaded here -->
        </div>
    </div>
    
    <!-- Quick Actions -->
    <div class="border-t border-gray-200 p-4">
        <h4 class="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
        <div class="grid grid-cols-2 gap-2">
            <button onclick="duplicateSelected()" class="text-xs px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                Duplicate
            </button>
            <button onclick="deleteSelected()" class="text-xs px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors">
                Delete
            </button>
        </div>
    </div>
</aside> 

<style>
    #propertiesPanel {
        height: calc(100vh - var(--header-height) - 120px);
        overflow-y: auto;
    }
</style>