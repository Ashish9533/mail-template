// Properties Manager Module
export class PropertiesManager {
    constructor() {
        this.builder = null;
        this.currentElement = null;
        this.propertyControls = new Map();
    }
    
    async init(builder) {
        this.builder = builder;
        this.setupPropertyPanelEvents();
    }
    
    setupPropertyPanelEvents() {
        const panel = document.getElementById('propertiesPanel');
        if (panel) {
            panel.addEventListener('input', (e) => {
                this.handlePropertyChange(e);
            });
            
            panel.addEventListener('change', (e) => {
                this.handlePropertyChange(e);
            });
        }
    }
    
    loadPropertiesFor(element) {
        this.currentElement = element;
        this.showPropertiesPanel();
        this.generatePropertyControls(element);
    }
    
    clearProperties() {
        this.currentElement = null;
        this.hidePropertiesPanel();
    }
    
    showPropertiesPanel() {
        const noSelection = document.getElementById('noSelection');
        const dynamicProperties = document.getElementById('dynamicProperties');
        
        if (noSelection) noSelection.classList.add('hidden');
        if (dynamicProperties) dynamicProperties.classList.remove('hidden');
    }
    
    hidePropertiesPanel() {
        const noSelection = document.getElementById('noSelection');
        const dynamicProperties = document.getElementById('dynamicProperties');
        
        if (noSelection) noSelection.classList.remove('hidden');
        if (dynamicProperties) dynamicProperties.classList.add('hidden');
    }
    
    generatePropertyControls(element) {
        const container = document.getElementById('dynamicProperties');
        if (!container) return;
        
        const properties = this.getElementProperties(element);
        container.innerHTML = this.renderPropertyControls(properties);
        
        // Setup color pickers and special controls
        this.setupSpecialControls(container);
    }
    
    getElementProperties(element) {
        const tagName = element.tagName.toLowerCase();
        const computedStyle = window.getComputedStyle(element);
        
        const baseProperties = {
            content: {
                label: 'Content',
                type: 'textarea',
                value: this.getElementContent(element)
            },
            fontSize: {
                label: 'Font Size',
                type: 'range',
                value: parseInt(computedStyle.fontSize) || 16,
                min: 8,
                max: 72,
                unit: 'px'
            },
            color: {
                label: 'Text Color',
                type: 'color',
                value: this.rgbToHex(computedStyle.color) || '#000000'
            },
            backgroundColor: {
                label: 'Background Color',
                type: 'color',
                value: this.rgbToHex(computedStyle.backgroundColor) || '#ffffff'
            },
            padding: {
                label: 'Padding',
                type: 'range',
                value: parseInt(computedStyle.padding) || 0,
                min: 0,
                max: 50,
                unit: 'px'
            },
            margin: {
                label: 'Margin',
                type: 'range',
                value: parseInt(computedStyle.margin) || 0,
                min: 0,
                max: 50,
                unit: 'px'
            },
            borderRadius: {
                label: 'Border Radius',
                type: 'range',
                value: parseInt(computedStyle.borderRadius) || 0,
                min: 0,
                max: 30,
                unit: 'px'
            }
        };
        
        // Add element-specific properties
        switch (tagName) {
            case 'img':
                return { ...baseProperties, ...this.getImageProperties(element) };
            case 'a':
                return { ...baseProperties, ...this.getLinkProperties(element) };
            case 'button':
                return { ...baseProperties, ...this.getButtonProperties(element) };
            default:
                return baseProperties;
        }
    }
    
    getImageProperties(element) {
        return {
            src: {
                label: 'Image URL',
                type: 'url',
                value: element.src || ''
            },
            alt: {
                label: 'Alt Text',
                type: 'text',
                value: element.alt || ''
            },
            width: {
                label: 'Width',
                type: 'range',
                value: parseInt(element.style.width) || element.offsetWidth,
                min: 50,
                max: 800,
                unit: 'px'
            }
        };
    }
    
    getLinkProperties(element) {
        return {
            href: {
                label: 'Link URL',
                type: 'url',
                value: element.href || ''
            },
            target: {
                label: 'Target',
                type: 'select',
                value: element.target || '_self',
                options: [
                    { value: '_self', label: 'Same Window' },
                    { value: '_blank', label: 'New Window' }
                ]
            }
        };
    }
    
    getButtonProperties(element) {
        return {
            buttonStyle: {
                label: 'Button Style',
                type: 'select',
                value: 'primary',
                options: [
                    { value: 'primary', label: 'Primary' },
                    { value: 'secondary', label: 'Secondary' },
                    { value: 'outline', label: 'Outline' }
                ]
            }
        };
    }
    
    renderPropertyControls(properties) {
        return Object.entries(properties).map(([key, prop]) => {
            return `
                <div class="property-group mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">${prop.label}</label>
                    ${this.renderControl(key, prop)}
                </div>
            `;
        }).join('');
    }
    
    renderControl(key, prop) {
        switch (prop.type) {
            case 'text':
            case 'url':
                return `<input type="${prop.type}" data-property="${key}" value="${prop.value}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">`;
            
            case 'textarea':
                return `<textarea data-property="${key}" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">${prop.value}</textarea>`;
            
            case 'color':
                return `
                    <div class="flex space-x-2">
                        <input type="color" data-property="${key}" value="${prop.value}" class="w-12 h-8 border border-gray-300 rounded">
                        <input type="text" data-property="${key}-hex" value="${prop.value}" class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm">
                    </div>
                `;
            
            case 'range':
                return `
                    <div class="flex items-center space-x-3">
                        <input type="range" data-property="${key}" value="${prop.value}" min="${prop.min}" max="${prop.max}" class="flex-1">
                        <span class="text-sm text-gray-600 w-16">${prop.value}${prop.unit || ''}</span>
                    </div>
                `;
            
            case 'select':
                const options = prop.options.map(opt => `<option value="${opt.value}" ${opt.value === prop.value ? 'selected' : ''}>${opt.label}</option>`).join('');
                return `<select data-property="${key}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">${options}</select>`;
            
            default:
                return `<input type="text" data-property="${key}" value="${prop.value}" class="w-full px-3 py-2 border border-gray-300 rounded-md">`;
        }
    }
    
    setupSpecialControls(container) {
        // Color picker sync
        const colorInputs = container.querySelectorAll('input[type="color"]');
        colorInputs.forEach(input => {
            const hexInput = container.querySelector(`input[data-property="${input.dataset.property}-hex"]`);
            if (hexInput) {
                input.addEventListener('input', () => {
                    hexInput.value = input.value;
                });
                
                hexInput.addEventListener('input', () => {
                    if (this.isValidHex(hexInput.value)) {
                        input.value = hexInput.value;
                    }
                });
            }
        });
        
        // Range value updates
        const rangeInputs = container.querySelectorAll('input[type="range"]');
        rangeInputs.forEach(input => {
            const valueSpan = input.parentNode.querySelector('span');
            input.addEventListener('input', () => {
                const unit = input.dataset.unit || '';
                valueSpan.textContent = input.value + unit;
            });
        });
    }
    
    handlePropertyChange(e) {
        if (!this.currentElement || !e.target.dataset.property) return;
        
        const property = e.target.dataset.property;
        const value = e.target.value;
        
        this.applyPropertyToElement(this.currentElement, property, value);
        this.builder.getManager('template')?.markAsModified();
    }
    
    applyPropertyToElement(element, property, value) {
        switch (property) {
            case 'content':
                this.setElementContent(element, value);
                break;
            case 'fontSize':
                element.style.fontSize = value + 'px';
                break;
            case 'color':
                element.style.color = value;
                break;
            case 'backgroundColor':
                element.style.backgroundColor = value;
                break;
            case 'padding':
                element.style.padding = value + 'px';
                break;
            case 'margin':
                element.style.margin = value + 'px';
                break;
            case 'borderRadius':
                element.style.borderRadius = value + 'px';
                break;
            case 'src':
                if (element.tagName === 'IMG') element.src = value;
                break;
            case 'alt':
                if (element.tagName === 'IMG') element.alt = value;
                break;
            case 'href':
                if (element.tagName === 'A') element.href = value;
                break;
            case 'target':
                if (element.tagName === 'A') element.target = value;
                break;
            case 'width':
                element.style.width = value + 'px';
                break;
        }
    }
    
    getElementContent(element) {
        if (element.tagName === 'IMG') return element.alt || '';
        return element.textContent || element.innerHTML || '';
    }
    
    setElementContent(element, content) {
        if (element.tagName === 'IMG') {
            element.alt = content;
        } else {
            element.textContent = content;
        }
    }
    
    rgbToHex(rgb) {
        if (!rgb) return '#000000';
        
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