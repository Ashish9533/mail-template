import { HeaderProperties } from './header-properties.js';
import { ImageProperties } from './image-properties.js';
import { SignatureProperties } from './signature-properties.js';

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
            panel.addEventListener('input', (e) => this.handlePropertyChange(e));
            panel.addEventListener('change', (e) => this.handlePropertyChange(e));
            panel.addEventListener('click', (e) => this.handlePropertyClick(e));
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
        let properties = this.getBaseProperties(element);
        const tagName = element.tagName.toLowerCase();

        switch (tagName) {
            case 'header':
                properties = { ...properties, ...HeaderProperties.getDefinition(element) };
                break;
            case 'img':
                properties = { ...properties, ...ImageProperties.getDefinition(element) };
                break;
            case 'a':
                properties = { ...properties, ...this.getLinkProperties(element) };
                break;
            case 'button':
                properties = { ...properties, ...this.getButtonProperties(element) };
                break;
        }

        if (element.classList.contains('signature-placeholder') || element.classList.contains('signature-applied')) {
            properties = { ...properties, ...SignatureProperties.getDefinition(element) };
        }

        if (element.classList.contains('sticker')) {
            properties.rotation = {
                label: 'Rotation',
                type: 'range',
                value: this.getCurrentRotation(element),
                min: 0,
                max: 360,
                unit: '°'
            };
        }
        
        return properties;
    }
    
    getBaseProperties(element) {
        const computedStyle = window.getComputedStyle(element);
        let base = {
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

        // Text properties only for non-image elements
        if(element.tagName !== 'IMG' && !element.classList.contains('signature-placeholder')) {
            base.content = {
                label: 'Content',
                type: 'textarea',
                value: this.getElementContent(element)
            };
            base.fontSize = {
                label: 'Font Size',
                type: 'range',
                value: parseInt(computedStyle.fontSize) || 16,
                min: 8,
                max: 72,
                unit: 'px'
            };
            base.color = {
                label: 'Text Color',
                type: 'color',
                value: this.rgbToHex(computedStyle.color) || '#000000'
            };
        }
        
        return base;
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
            if (!prop) return '';
            if (prop.type === 'group') {
                const groupPropertiesHtml = this.renderPropertyControls(prop.properties);
                return `
                    <div class="w-full border-t border-gray-200 pt-4 mt-4">
                        <h4 class="text-md font-semibold text-gray-800 mb-3">${prop.label}</h4>
                        <div class="space-y-4">
                            ${groupPropertiesHtml}
                        </div>
                    </div>
                `;
            }
            
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
                        <input type="range" data-property="${key}" value="${prop.value}" min="${prop.min}" max="${prop.max}" ${prop.step ? `step="${prop.step}"` : ''} class="flex-1">
                        <span class="text-sm text-gray-600 w-16">${prop.value}${prop.unit || ''}</span>
                    </div>
                `;
            
            case 'select':
                const options = prop.options.map(opt => `<option value="${opt.value}" ${opt.value === prop.value ? 'selected' : ''}>${opt.label}</option>`).join('');
                return `<select data-property="${key}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">${options}</select>`;
            
            case 'button':
                return `<button type="button" data-property="${key}" class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">${prop.buttonText}</button>`;
            
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
                valueSpan.textContent = input.value + (unit || '');
            });
        });
    }
    
    handlePropertyClick(e) {
        const button = e.target.closest('button[data-property]');
        if (!button) return;

        e.preventDefault();
        const propertyKey = button.dataset.property;
        const prop = this.findPropertyDefinition(propertyKey);
        
        if (prop && typeof prop.onClick === 'function') {
            prop.onClick(this.builder);
        }
    }
    
    handlePropertyChange(e) {
        if (!this.currentElement || !e.target.dataset.property) return;

        // Button clicks are handled by a separate event listener
        if (e.target.matches('button[data-property]')) {
            return;
        }
        
        const property = e.target.dataset.property;
        let value = e.target.value;
        
        if (e.target.type === 'range') {
            const step = e.target.step;
            if (step && step.includes('.')) {
                value = parseFloat(value).toFixed(step.split('.')[1].length);
            }
        }

        this.applyPropertyToElement(this.currentElement, property, value);
        this.builder.getManager('template')?.markAsModified();
    }
    
    applyPropertyToElement(element, property, value) {
        if (HeaderProperties.applyStyle(element, property, value)) {
            return;
        }
        if (ImageProperties.applyStyle(element, property, value)) {
            return;
        }
        if (SignatureProperties.applyStyle(element, property, value)) {
            return;
        }

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
            case 'href':
                if (element.tagName === 'A') element.href = value;
                break;
            case 'target':
                if (element.tagName === 'A') element.target = value;
                break;
            case 'rotation':
                element.style.transform = `rotate(${value}deg)`;
                this.builder.getManager('component')?.updateSelectionBox(element);
                this.builder.getManager('component')?.showResizeHandles(element);
                break;
            default:
                // Fallback for unhandled properties, particularly for custom components
                if(!HeaderProperties.applyStyle(element, property, value)) {
                    // If not handled, you could log this for debugging
                    console.warn(`Unhandled property: ${property}`);
                }
        }
    }
    
    getElementContent(element) {
        if (element.tagName === 'IMG') return element.alt || '';
        
        // For headers, target the H1 tag for the main content
        if (element.tagName === 'HEADER') {
            const title = element.querySelector('h1');
            if (title) {
                return title.innerHTML.replace(/<br\s*\/?>/gi, '\\n');
            }
        }

        let content = element.innerHTML || '';
        return content.replace(/<br\s*\/?>/gi, '\\n');
    }
    
    setElementContent(element, content) {
        if (element.tagName === 'IMG') {
            element.alt = content;
        } 
        // For headers, target the H1 tag
        else if (element.tagName === 'HEADER') {
            const title = element.querySelector('h1');
            if(title) {
                title.innerHTML = content.replace(/\\n/g, '<br>');
            }
        }
        else {
            element.innerHTML = content.replace(/\\n/g, '<br>');
        }
    }
    
    getCurrentRotation(element) {
        const transform = window.getComputedStyle(element).transform;
        if (transform === 'none') return 0;
        
        const matrix = transform.match(/^matrix\((.+)\)$/);
        if (matrix) {
            const values = matrix[1].split(', ').map(parseFloat);
            let angle = Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));
            return angle < 0 ? angle + 360 : angle;
        }
        return 0;
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
    
    findPropertyDefinition(propertyKey) {
        const properties = this.getElementProperties(this.currentElement);
        let foundProp = null;

        function find(props) {
            for (const [key, prop] of Object.entries(props)) {
                if (key === propertyKey) {
                    foundProp = prop;
                    return;
                }
                if (prop.type === 'group') {
                    find(prop.properties);
                }
                if (foundProp) return;
            }
        }

        find(properties);
        return foundProp;
    }
} 