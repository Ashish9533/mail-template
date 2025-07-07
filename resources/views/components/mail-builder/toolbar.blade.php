<div class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between" style="height: var(--toolbar-height);">
    <!-- Left Section - Device & View Controls -->
    <div class="flex items-center space-x-4">
        <!-- Device Selector -->
        <div class="flex items-center bg-gray-100 rounded-lg p-1">
            <button class="device-btn px-3 py-1 text-sm rounded-md transition-colors active" data-device="desktop" title="Desktop View">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
            </button>
            <button class="device-btn px-3 py-1 text-sm rounded-md transition-colors" data-device="tablet" title="Tablet View">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
            </button>
            <button class="device-btn px-3 py-1 text-sm rounded-md transition-colors" data-device="mobile" title="Mobile View">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
            </button>
        </div>
        
        <!-- View Mode Toggle -->
        <div class="flex items-center bg-gray-100 rounded-lg p-1">
            <button class="view-btn px-3 py-1 text-sm rounded-md transition-colors active" data-view="design" title="Design View">
                Design
            </button>
            <button class="view-btn px-3 py-1 text-sm rounded-md transition-colors" data-view="code" title="Code View">
                Code
            </button>
            <button class="view-btn px-3 py-1 text-sm rounded-md transition-colors" data-view="split" title="Split View">
                Split
            </button>
        </div>
    </div>
    
    <!-- Center Section - Editing Tools -->
    <div class="flex items-center space-x-1">
        <!-- Alignment Tools -->
        <div class="flex items-center border border-gray-200 rounded-md">
            <button class="tool-btn p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50" data-tool="align-left" title="Align Left">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16"></path>
                </svg>
            </button>
            <button class="tool-btn p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l border-gray-200" data-tool="align-center" title="Align Center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M8 12h8M6 18h12"></path>
                </svg>
            </button>
            <button class="tool-btn p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l border-gray-200" data-tool="align-right" title="Align Right">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M12 12h8M6 18h16"></path>
                </svg>
            </button>
        </div>
        
        <!-- Text Formatting -->
        <div class="flex items-center border border-gray-200 rounded-md">
            <button class="tool-btn p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50" data-tool="bold" title="Bold">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"></path>
                </svg>
            </button>
            <button class="tool-btn p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l border-gray-200" data-tool="italic" title="Italic">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 4l4 16"></path>
                </svg>
            </button>
            <button class="tool-btn p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l border-gray-200" data-tool="underline" title="Underline">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 3v9a5 5 0 0010 0V3m-5-3h0m-5 21h10"></path>
                </svg>
            </button>
        </div>
        
        <!-- Layer Controls -->
        <div class="flex items-center border border-gray-200 rounded-md">
            <button class="tool-btn p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50" data-tool="bring-forward" title="Bring Forward">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                </svg>
            </button>
            <button class="tool-btn p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l border-gray-200" data-tool="send-backward" title="Send Backward">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
                </svg>
            </button>
        </div>
        
        <!-- Color Picker -->
        <div class="flex items-center border border-gray-200 rounded-md">
            <button class="tool-btn p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50" data-tool="text-color" title="Text Color">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M11 7h6"></path>
                </svg>
                <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-black"></div>
            </button>
            <button class="tool-btn p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l border-gray-200" data-tool="bg-color" title="Background Color">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M11 7h6"></path>
                </svg>
                <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-yellow-400"></div>
            </button>
        </div>
    </div>
    
    <!-- Right Section - Actions & Settings -->
    <div class="flex items-center space-x-3">
        <!-- Responsive Preview -->
        <button class="tool-btn px-3 py-2 text-sm border border-gray-200 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50" data-tool="responsive-preview" title="Responsive Preview">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            Preview
        </button>
        
        <!-- Settings -->
        <div class="relative" data-dropdown="settings">
            <button class="tool-btn p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 rounded-md" data-dropdown-trigger title="Settings">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
            </button>
            
            <!-- Settings Dropdown -->
            <div class="hidden absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-10" data-dropdown-menu>
                <div class="py-2">
                    <div class="px-4 py-2 border-b border-gray-200">
                        <h4 class="text-sm font-medium text-gray-900">Canvas Settings</h4>
                    </div>
                    
                    <!-- Grid Settings -->
                    <div class="px-4 py-2">
                        <label class="flex items-center justify-between">
                            <span class="text-sm text-gray-700">Show Grid</span>
                            <input type="checkbox" id="showGrid" checked class="form-checkbox h-4 w-4 text-blue-600">
                        </label>
                    </div>
                    
                    <!-- Snap to Grid -->
                    <div class="px-4 py-2">
                        <label class="flex items-center justify-between">
                            <span class="text-sm text-gray-700">Snap to Grid</span>
                            <input type="checkbox" id="snapToGrid" class="form-checkbox h-4 w-4 text-blue-600">
                        </label>
                    </div>
                    
                    <!-- Grid Size -->
                    <div class="px-4 py-2">
                        <label class="block text-sm text-gray-700 mb-1">Grid Size</label>
                        <select id="gridSize" class="w-full text-sm border border-gray-300 rounded px-2 py-1">
                            <option value="10">10px</option>
                            <option value="20" selected>20px</option>
                            <option value="25">25px</option>
                            <option value="50">50px</option>
                        </select>
                    </div>
                    
                    <!-- Auto Save -->
                    <div class="px-4 py-2 border-t border-gray-200">
                        <label class="flex items-center justify-between">
                            <span class="text-sm text-gray-700">Auto Save</span>
                            <input type="checkbox" id="autoSave" checked class="form-checkbox h-4 w-4 text-blue-600">
                        </label>
                    </div>
                    
                    <!-- Save Interval -->
                    <div class="px-4 py-2">
                        <label class="block text-sm text-gray-700 mb-1">Save Interval</label>
                        <select id="saveInterval" class="w-full text-sm border border-gray-300 rounded px-2 py-1">
                            <option value="30">30 seconds</option>
                            <option value="60" selected>1 minute</option>
                            <option value="300">5 minutes</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Help -->
        <button class="tool-btn p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 rounded-md" data-tool="help" title="Help & Shortcuts">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        </button>
    </div>
    
    <!-- Color Picker Modal -->
    <div id="colorPickerModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Choose Color</h3>
            <div class="space-y-4">
                <!-- Color Input -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Color</label>
                    <input type="color" id="colorPicker" class="w-full h-10 rounded border border-gray-300">
                </div>
                
                <!-- Hex Input -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Hex Code</label>
                    <input type="text" id="hexInput" placeholder="#000000" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                </div>
                
                <!-- Preset Colors -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Presets</label>
                    <div class="grid grid-cols-8 gap-2">
                        <button class="preset-color w-8 h-8 rounded border border-gray-300" style="background-color: #000000" data-color="#000000"></button>
                        <button class="preset-color w-8 h-8 rounded border border-gray-300" style="background-color: #ffffff" data-color="#ffffff"></button>
                        <button class="preset-color w-8 h-8 rounded border border-gray-300" style="background-color: #ef4444" data-color="#ef4444"></button>
                        <button class="preset-color w-8 h-8 rounded border border-gray-300" style="background-color: #f97316" data-color="#f97316"></button>
                        <button class="preset-color w-8 h-8 rounded border border-gray-300" style="background-color: #eab308" data-color="#eab308"></button>
                        <button class="preset-color w-8 h-8 rounded border border-gray-300" style="background-color: #22c55e" data-color="#22c55e"></button>
                        <button class="preset-color w-8 h-8 rounded border border-gray-300" style="background-color: #3b82f6" data-color="#3b82f6"></button>
                        <button class="preset-color w-8 h-8 rounded border border-gray-300" style="background-color: #8b5cf6" data-color="#8b5cf6"></button>
                    </div>
                </div>
                
                <!-- Actions -->
                <div class="flex justify-end space-x-3 pt-4">
                    <button id="cancelColorPicker" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                        Cancel
                    </button>
                    <button id="applyColorPicker" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                        Apply
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
/* Toolbar specific styles */
.device-btn.active,
.view-btn.active {
    background-color: white;
    color: #1f2937;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.tool-btn {
    transition: all 0.15s ease;
    position: relative;
}

.tool-btn:hover {
    transform: translateY(-1px);
}

.tool-btn.active {
    background-color: #3b82f6;
    color: white;
}

/* Color indicator bars */
.tool-btn[data-tool="text-color"] .absolute,
.tool-btn[data-tool="bg-color"] .absolute {
    transition: background-color 0.15s ease;
}

/* Dropdown animations */
.dropdown-enter {
    animation: dropdownEnter 0.15s ease-out;
}

@keyframes dropdownEnter {
    from {
        opacity: 0;
        transform: scale(0.95) translateY(-5px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

/* Color picker styles */
.preset-color {
    transition: all 0.15s ease;
}

.preset-color:hover {
    transform: scale(1.1);
    border-color: #3b82f6;
}

/* Form elements */
.form-checkbox:checked {
    background-color: #3b82f6;
    border-color: #3b82f6;
}

/* Tool state indicators */
.tool-btn[data-active="true"] {
    background-color: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
}
</style> 