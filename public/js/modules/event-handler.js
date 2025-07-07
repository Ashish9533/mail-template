// Event Handler Module
export class EventHandler {
    constructor() {
        this.builder = null;
        this.eventListeners = new Map();
    }
    
    async init(builder) {
        this.builder = builder;
        this.setupGlobalEvents();
        this.setupHeaderEvents();
        this.setupSidebarEvents();
        this.setupCanvasEvents();
        this.setupModalEvents();
    }
    
    setupGlobalEvents() {
        // Keyboard shortcuts
        this.addEventListener(document, 'keydown', (e) => {
            this.handleGlobalKeyboard(e);
        });
        
        // Window resize
        this.addEventListener(window, 'resize', () => {
            this.builder.handleWindowResize();
        });
        
        // Before unload
        this.addEventListener(window, 'beforeunload', (e) => {
            this.builder.handleBeforeUnload(e);
        });
    }
    
    setupHeaderEvents() {
        // Save button
        this.setupButton('saveBtn', () => {
            this.builder.saveTemplate();
        });
        
        // Preview button
        this.setupButton('previewBtn', () => {
            this.showPreview();
        });
        
        // Test send button
        this.setupButton('testSendBtn', () => {
            this.showTestSend();
        });
        
        // Undo/Redo
        this.setupButton('undoBtn', () => {
            this.builder.getManager('history')?.undo();
        });
        
        this.setupButton('redoBtn', () => {
            this.builder.getManager('history')?.redo();
        });
        
        // Dropdown toggles
        this.setupDropdowns();
    }
    
    setupSidebarEvents() {
        // Category toggles
        const categoryToggles = document.querySelectorAll('.category-toggle');
        categoryToggles.forEach(toggle => {
            this.addEventListener(toggle, 'click', (e) => {
                this.builder.getManager('component')?.toggleCategory(e.currentTarget);
            });
        });

        // Component Search
        const searchInput = document.getElementById('componentSearch');
        if (searchInput) {
            this.addEventListener(searchInput, 'input', (e) => {
                this.builder.getManager('component')?.filterComponents(e.target.value);
            });
        }
    }
    
    setupCanvasEvents() {
        // Device selector
        const deviceSelector = document.getElementById('deviceSelector');
        if (deviceSelector) {
            this.addEventListener(deviceSelector, 'change', (e) => {
                this.switchDevice(e.target.value);
            });
        }
        
        // Zoom controls
        this.setupButton('zoomIn', () => {
            this.adjustZoom(1.25);
        });
        
        this.setupButton('zoomOut', () => {
            this.adjustZoom(0.8);
        });
        
        // Grid and rulers toggles
        this.setupToggle('gridToggle', (enabled) => {
            this.toggleGrid(enabled);
        });
        
        this.setupToggle('rulersToggle', (enabled) => {
            this.toggleRulers(enabled);
        });
    }
    
    setupModalEvents() {
        // Global modal functions
        window.newTemplate = () => {
            this.builder.getManager('modal')?.openModal('newTemplateModal');
        };
        
        window.loadTemplate = () => {
            this.builder.getManager('modal')?.openModal('loadTemplateModal');
        };
        
        window.showCode = () => {
            this.builder.getManager('modal')?.openModal('codeModal');
        };
        
        window.exportTemplate = () => {
            this.builder.getManager('template')?.exportAsHTML();
        };
        
        window.duplicateTemplate = () => {
            this.builder.getManager('template')?.duplicateTemplate();
        };
        
        window.showVariables = () => {
            this.showVariablesModal();
        };
        
        window.duplicateSelected = () => {
            const selected = this.builder.getSelectedElement();
            if (selected) {
                this.builder.getManager('component')?.duplicateElement(selected);
            }
        };
        
        window.deleteSelected = () => {
            const selected = this.builder.getSelectedElement();
            if (selected) {
                this.builder.getManager('component')?.deleteElement(selected);
            }
        };
    }
    
    setupButton(id, handler) {
        const button = document.getElementById(id);
        if (button) {
            this.addEventListener(button, 'click', handler);
        }
    }
    
    setupToggle(id, handler) {
        const toggle = document.getElementById(id);
        if (toggle) {
            this.addEventListener(toggle, 'change', (e) => {
                handler(e.target.checked);
            });
        }
    }
    
    setupDropdowns() {
        const dropdowns = document.querySelectorAll('[data-dropdown]');
        
        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('[data-dropdown-trigger]');
            const menu = dropdown.querySelector('[data-dropdown-menu]');
            
            if (trigger && menu) {
                this.addEventListener(trigger, 'click', (e) => {
                    e.stopPropagation();
                    this.toggleDropdown(menu);
                });
            }
        });
        
        // Close dropdowns when clicking outside
        this.addEventListener(document, 'click', () => {
            this.closeAllDropdowns();
        });
    }
    
    handleGlobalKeyboard(e) {
        // Prevent default browser shortcuts when builder is active
        if (document.activeElement && 
            !document.activeElement.matches('input, textarea, [contenteditable]')) {
            
            // Ctrl/Cmd + S - Save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.builder.saveTemplate();
            }
            
            // Ctrl/Cmd + Z - Undo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                this.builder.getManager('history')?.undo();
            }
            
            // Ctrl/Cmd + Shift + Z - Redo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
                e.preventDefault();
                this.builder.getManager('history')?.redo();
            }
            
            // Delete - Delete selected element
            if (e.key === 'Delete' && this.builder.getSelectedElement()) {
                e.preventDefault();
                this.builder.deleteSelectedElement();
            }
            
            // Escape - Deselect
            if (e.key === 'Escape') {
                this.builder.deselectElement();
            }
        }
    }
    
    showPreview() {
        const templateData = this.builder.getManager('template')?.getCurrentTemplateData();
        if (!templateData) return;
        
        // Create preview window
        const previewWindow = window.open('', '_blank', 'width=800,height=600');
        
        const previewHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Template Preview - ${templateData.name}</title>
                <style>
                    body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                    ${templateData.css || ''}
                </style>
            </head>
            <body>
                ${templateData.html}
            </body>
            </html>
        `;
        
        previewWindow.document.write(previewHTML);
        previewWindow.document.close();
    }
    
    showTestSend() {
        this.builder.getManager('notification')?.show('info', 'Test send feature coming soon!');
    }
    
    switchDevice(device) {
        const canvas = document.getElementById('emailCanvas');
        const container = document.getElementById('canvasContainer');
        
        // Remove existing device classes
        container.classList.remove('device-mobile', 'device-tablet', 'device-desktop');
        
        // Add new device class
        container.classList.add(`device-${device}`);
        
        // Update device buttons
        const deviceBtns = document.querySelectorAll('.device-btn');
        deviceBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.device === device) {
                btn.classList.add('active');
            }
        });
        
        // Update canvas dimensions
        this.builder.getManager('component')?.updateCanvasDimensions();
    }
    
    adjustZoom(factor) {
        const canvas = document.getElementById('emailCanvas');
        const zoomLevel = document.getElementById('zoomLevel');
        
        if (!canvas || !zoomLevel) return;
        
        const currentTransform = canvas.style.transform;
        const currentScale = currentTransform.match(/scale\(([\d.]+)\)/);
        const scale = currentScale ? parseFloat(currentScale[1]) * factor : factor;
        
        // Limit zoom range
        const clampedScale = Math.max(0.25, Math.min(2, scale));
        
        canvas.style.transform = `scale(${clampedScale})`;
        zoomLevel.textContent = Math.round(clampedScale * 100) + '%';
    }
    
    toggleGrid(enabled) {
        const gridOverlay = document.getElementById('gridOverlay');
        if (gridOverlay) {
            gridOverlay.style.display = enabled ? 'block' : 'none';
        }
    }
    
    toggleRulers(enabled) {
        const horizontalRuler = document.getElementById('horizontalRuler');
        const verticalRuler = document.getElementById('verticalRuler');
        
        if (horizontalRuler) {
            horizontalRuler.classList.toggle('hidden', !enabled);
        }
        
        if (verticalRuler) {
            verticalRuler.classList.toggle('hidden', !enabled);
        }
    }
    
    toggleDropdown(menu) {
        const isVisible = !menu.classList.contains('hidden');
        
        // Close all dropdowns first
        this.closeAllDropdowns();
        
        // Open this dropdown if it wasn't visible
        if (!isVisible) {
            menu.classList.remove('hidden');
            menu.classList.add('show');
        }
    }
    
    closeAllDropdowns() {
        const dropdownMenus = document.querySelectorAll('[data-dropdown-menu]');
        dropdownMenus.forEach(menu => {
            menu.classList.add('hidden');
            menu.classList.remove('show');
        });
    }
    
    showVariablesModal() {
        const templateData = this.builder.getManager('template')?.getCurrentTemplateData();
        if (!templateData) return;
        
        const variables = templateData.variables || [];
        
        if (variables.length === 0) {
            this.builder.getManager('notification')?.show('info', 'No variables found in template');
            return;
        }
        
        const variablesList = variables.map(variable => 
            `<div class="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                <code class="text-sm">{{${variable}}}</code>
                <span class="text-xs text-gray-500">Variable</span>
            </div>`
        ).join('');
        
        // Create temporary modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50';
        modal.innerHTML = `
            <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div class="mt-3">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Template Variables</h3>
                    <div class="space-y-2 mb-4">
                        ${variablesList}
                    </div>
                    <div class="text-center">
                        <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 10000);
    }
    
    addEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        
        // Store for cleanup
        const key = `${element.id || 'global'}_${event}`;
        if (!this.eventListeners.has(key)) {
            this.eventListeners.set(key, []);
        }
        this.eventListeners.get(key).push({ element, event, handler });
    }
    
    removeAllEventListeners() {
        this.eventListeners.forEach(listeners => {
            listeners.forEach(({ element, event, handler }) => {
                element.removeEventListener(event, handler);
            });
        });
        this.eventListeners.clear();
    }
} 