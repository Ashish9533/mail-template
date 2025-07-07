// Toolbar Manager Module
export class ToolbarManager {
    constructor() {
        this.builder = null;
        this.currentDevice = 'desktop';
        this.currentView = 'design';
        this.activeTool = null;
    }
    
    async init(builder) {
        this.builder = builder;
        this.setupToolbarEvents();
        this.setupColorPicker();
    }
    
    setupToolbarEvents() {
        // Device buttons
        const deviceBtns = document.querySelectorAll('.device-btn');
        deviceBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchDevice(e.target.dataset.device);
            });
        });
        
        // View mode buttons
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.dataset.view);
            });
        });
        
        // Tool buttons
        const toolBtns = document.querySelectorAll('.tool-btn');
        toolBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleToolClick(e.target.dataset.tool);
            });
        });
    }
    
    setupColorPicker() {
        const colorPickerModal = document.getElementById('colorPickerModal');
        const colorPicker = document.getElementById('colorPicker');
        const hexInput = document.getElementById('hexInput');
        const cancelBtn = document.getElementById('cancelColorPicker');
        const applyBtn = document.getElementById('applyColorPicker');
        
        if (!colorPickerModal) return;
        
        // Preset color buttons
        const presetColors = colorPickerModal.querySelectorAll('.preset-color');
        presetColors.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const color = e.target.dataset.color;
                if (colorPicker) colorPicker.value = color;
                if (hexInput) hexInput.value = color;
            });
        });
        
        // Color picker input
        colorPicker?.addEventListener('input', (e) => {
            if (hexInput) hexInput.value = e.target.value;
        });
        
        // Hex input
        hexInput?.addEventListener('input', (e) => {
            if (this.isValidHex(e.target.value) && colorPicker) {
                colorPicker.value = e.target.value;
            }
        });
        
        // Cancel button
        cancelBtn?.addEventListener('click', () => {
            this.hideColorPicker();
        });
        
        // Apply button
        applyBtn?.addEventListener('click', () => {
            this.applyColor();
        });
        
        // Close on backdrop click
        colorPickerModal.addEventListener('click', (e) => {
            if (e.target === colorPickerModal) {
                this.hideColorPicker();
            }
        });
    }
    
    switchDevice(device) {
        this.currentDevice = device;
        
        // Update button states
        const deviceBtns = document.querySelectorAll('.device-btn');
        deviceBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.device === device);
        });
        
        // Apply device styling to canvas
        const canvasContainer = document.getElementById('canvasContainer');
        if (canvasContainer) {
            canvasContainer.className = canvasContainer.className.replace(/device-\w+/g, '');
            canvasContainer.classList.add(`device-${device}`);
        }
        
        // Update device selector in canvas controls
        const deviceSelector = document.getElementById('deviceSelector');
        if (deviceSelector) {
            deviceSelector.value = device;
        }
        
        this.builder.getManager('component')?.updateCanvasDimensions();
    }
    
    switchView(view) {
        this.currentView = view;
        
        // Update button states
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        // Handle view changes
        switch (view) {
            case 'design':
                this.showDesignView();
                break;
            case 'code':
                this.showCodeView();
                break;
            case 'split':
                this.showSplitView();
                break;
        }
    }
    
    handleToolClick(tool) {
        const selectedElement = this.builder.getSelectedElement();
        
        switch (tool) {
            case 'align-left':
            case 'align-center':
            case 'align-right':
                this.applyAlignment(tool, selectedElement);
                break;
                
            case 'bold':
            case 'italic':
            case 'underline':
                this.applyTextFormat(tool, selectedElement);
                break;
                
            case 'bring-forward':
            case 'send-backward':
                this.adjustLayer(tool, selectedElement);
                break;
                
            case 'text-color':
            case 'bg-color':
                this.showColorPicker(tool);
                break;
                
            case 'responsive-preview':
                this.showResponsivePreview();
                break;
                
            case 'help':
                this.showHelp();
                break;
        }
    }
    
    applyAlignment(alignment, element) {
        if (!element) {
            this.builder.getManager('notification')?.show('warning', 'Please select an element first');
            return;
        }
        
        const alignmentMap = {
            'align-left': 'left',
            'align-center': 'center',
            'align-right': 'right'
        };
        
        element.style.textAlign = alignmentMap[alignment];
        this.builder.getManager('template')?.markAsModified();
        
        // Update tool button state
        this.updateToolState(alignment, true);
    }
    
    applyTextFormat(format, element) {
        if (!element) {
            this.builder.getManager('notification')?.show('warning', 'Please select an element first');
            return;
        }
        
        const formatMap = {
            'bold': 'fontWeight',
            'italic': 'fontStyle',
            'underline': 'textDecoration'
        };
        
        const valueMap = {
            'bold': element.style.fontWeight === 'bold' ? 'normal' : 'bold',
            'italic': element.style.fontStyle === 'italic' ? 'normal' : 'italic',
            'underline': element.style.textDecoration === 'underline' ? 'none' : 'underline'
        };
        
        element.style[formatMap[format]] = valueMap[format];
        this.builder.getManager('template')?.markAsModified();
        
        // Update tool button state
        this.updateToolState(format, valueMap[format] !== 'normal' && valueMap[format] !== 'none');
    }
    
    adjustLayer(action, element) {
        if (!element) {
            this.builder.getManager('notification')?.show('warning', 'Please select an element first');
            return;
        }
        
        const parent = element.parentNode;
        const siblings = Array.from(parent.children);
        const currentIndex = siblings.indexOf(element);
        
        if (action === 'bring-forward' && currentIndex < siblings.length - 1) {
            parent.insertBefore(element, siblings[currentIndex + 2]);
        } else if (action === 'send-backward' && currentIndex > 0) {
            parent.insertBefore(element, siblings[currentIndex - 1]);
        }
        
        this.builder.getManager('template')?.markAsModified();
    }
    
    showColorPicker(colorType) {
        this.currentColorType = colorType;
        const modal = document.getElementById('colorPickerModal');
        if (modal) {
            modal.classList.remove('hidden');
            
            // Set current color if element is selected
            const element = this.builder.getSelectedElement();
            if (element) {
                const currentColor = colorType === 'text-color' 
                    ? window.getComputedStyle(element).color 
                    : window.getComputedStyle(element).backgroundColor;
                
                const hexColor = this.rgbToHex(currentColor);
                const colorPicker = document.getElementById('colorPicker');
                const hexInput = document.getElementById('hexInput');
                
                if (colorPicker) colorPicker.value = hexColor;
                if (hexInput) hexInput.value = hexColor;
            }
        }
    }
    
    hideColorPicker() {
        const modal = document.getElementById('colorPickerModal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.currentColorType = null;
    }
    
    applyColor() {
        const element = this.builder.getSelectedElement();
        if (!element) {
            this.builder.getManager('notification')?.show('warning', 'Please select an element first');
            this.hideColorPicker();
            return;
        }
        
        const colorPicker = document.getElementById('colorPicker');
        const color = colorPicker?.value || '#000000';
        
        if (this.currentColorType === 'text-color') {
            element.style.color = color;
        } else if (this.currentColorType === 'bg-color') {
            element.style.backgroundColor = color;
        }
        
        this.builder.getManager('template')?.markAsModified();
        this.hideColorPicker();
        
        this.builder.getManager('notification')?.show('success', 'Color applied successfully');
    }
    
    showDesignView() {
        const canvas = document.getElementById('emailCanvas');
        if (canvas) {
            canvas.style.display = 'block';
        }
        // Hide code editor if it exists
    }
    
    showCodeView() {
        this.builder.getManager('modal')?.openModal('codeModal');
    }
    
    showSplitView() {
        // Implementation for split view would go here
        this.builder.getManager('notification')?.show('info', 'Split view coming soon!');
    }
    
    showResponsivePreview() {
        const devices = ['mobile', 'tablet', 'desktop'];
        let currentIndex = devices.indexOf(this.currentDevice);
        currentIndex = (currentIndex + 1) % devices.length;
        
        this.switchDevice(devices[currentIndex]);
    }
    
    showHelp() {
        const helpContent = `
            <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Keyboard Shortcuts</h3>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span>Save Template</span>
                            <code class="bg-gray-100 px-2 py-1 rounded">Ctrl+S</code>
                        </div>
                        <div class="flex justify-between">
                            <span>Undo</span>
                            <code class="bg-gray-100 px-2 py-1 rounded">Ctrl+Z</code>
                        </div>
                        <div class="flex justify-between">
                            <span>Redo</span>
                            <code class="bg-gray-100 px-2 py-1 rounded">Ctrl+Shift+Z</code>
                        </div>
                        <div class="flex justify-between">
                            <span>Delete Selected</span>
                            <code class="bg-gray-100 px-2 py-1 rounded">Delete</code>
                        </div>
                        <div class="flex justify-between">
                            <span>Deselect</span>
                            <code class="bg-gray-100 px-2 py-1 rounded">Escape</code>
                        </div>
                    </div>
                    <div class="text-center mt-6">
                        <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const helpModal = document.createElement('div');
        helpModal.innerHTML = helpContent;
        document.body.appendChild(helpModal.firstElementChild);
    }
    
    updateToolState(tool, active) {
        const toolBtn = document.querySelector(`[data-tool="${tool}"]`);
        if (toolBtn) {
            toolBtn.classList.toggle('active', active);
            toolBtn.setAttribute('data-active', active);
        }
    }
    
    rgbToHex(rgb) {
        if (!rgb || rgb === 'rgba(0, 0, 0, 0)') return '#ffffff';
        
        const result = rgb.match(/\d+/g);
        if (!result) return '#000000';
        
        const r = parseInt(result[0]);
        const g = parseInt(result[1]);
        const b = parseInt(result[2]);
        
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    isValidHex(hex) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    }
} 