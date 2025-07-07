export class ImageProperties {
    static getDefinition(element) {
        const computedStyle = window.getComputedStyle(element);
        const isCentered = computedStyle.marginLeft === 'auto' && computedStyle.marginRight === 'auto';
        let align = 'left';
        if (isCentered) {
            align = 'center';
        } else if (computedStyle.float === 'right' || computedStyle.display === 'block' && computedStyle.marginLeft === 'auto') {
            align = 'right';
        }

        return {
            source: {
                label: 'Image Source',
                type: 'group',
                properties: {
                    src: { label: 'Image URL', type: 'url', value: element.src || '' },
                    alt: { label: 'Alt Text', type: 'text', value: element.alt || '' },
                }
            },
            sizing: {
                label: 'Sizing & Fit',
                type: 'group',
                properties: {
                    width: { label: 'Width', type: 'range', value: parseInt(element.style.width) || element.offsetWidth, min: 10, max: 800, unit: 'px' },
                    height: { label: 'Height', type: 'range', value: parseInt(element.style.height) || element.offsetHeight, min: 10, max: 800, unit: 'px' },
                    objectFit: {
                        label: 'Object Fit', type: 'select', value: computedStyle.objectFit,
                        options: [{value: 'fill', label: 'Fill'}, {value: 'contain', label: 'Contain'}, {value: 'cover', label: 'Cover'}, {value: 'none', label: 'None'}, {value: 'scale-down', label: 'Scale Down'}]
                    },
                }
            },
            layout: {
                label: 'Layout & Spacing',
                type: 'group',
                properties: {
                    horizontalAlign: {
                        label: 'Alignment', type: 'select', value: align,
                        options: [{value: 'left', label: 'Left'}, {value: 'center', label: 'Center'}, {value: 'right', label: 'Right'}]
                    },
                    margin: { label: 'Margin', type: 'text', value: computedStyle.margin },
                    padding: { label: 'Padding', type: 'text', value: computedStyle.padding },
                }
            },
            border: {
                label: 'Border & Corners',
                type: 'group',
                properties: {
                    borderRadius: { label: 'Border Radius', type: 'range', value: parseInt(computedStyle.borderRadius) || 0, min: 0, max: 200, unit: 'px' },
                    borderWidth: { label: 'Border Width', type: 'range', value: parseInt(computedStyle.borderWidth) || 0, min: 0, max: 50, unit: 'px' },
                    borderStyle: {
                        label: 'Border Style', type: 'select', value: computedStyle.borderStyle,
                        options: [{value: 'none', label: 'None'}, {value: 'solid', label: 'Solid'}, {value: 'dashed', label: 'Dashed'}, {value: 'dotted', label: 'Dotted'}]
                    },
                    borderColor: { label: 'Border Color', type: 'color', value: this.rgbToHex(computedStyle.borderColor) },
                }
            },
            effects: {
                label: 'Effects',
                type: 'group',
                properties: {
                    opacity: { label: 'Opacity', type: 'range', value: computedStyle.opacity, min: 0, max: 1, step: 0.1 },
                    boxShadow: { label: 'Box Shadow', type: 'text', value: computedStyle.boxShadow },
                }
            },
            positioning: {
                label: 'Positioning (Advanced)',
                type: 'group',
                properties: {
                    position: {
                        label: 'Position', type: 'select', value: computedStyle.position,
                        options: [{value: 'static', label: 'Static'}, {value: 'relative', label: 'Relative'}, {value: 'absolute', label: 'Absolute'}]
                    },
                    top: { label: 'Top', type: 'text', value: computedStyle.top },
                    left: { label: 'Left', type: 'text', value: computedStyle.left },
                    zIndex: { label: 'Z-Index', type: 'number', value: computedStyle.zIndex },
                }
            }
        };
    }

    static applyStyle(element, property, value) {
        if (element.tagName !== 'IMG') return false;

        switch (property) {
            case 'src': element.src = value; break;
            case 'alt': element.alt = value; break;
            case 'width': element.style.width = value + 'px'; break;
            case 'height': element.style.height = value + 'px'; break;
            case 'objectFit': element.style.objectFit = value; break;
            case 'horizontalAlign':
                if (value === 'center') {
                    element.style.display = 'block';
                    element.style.marginLeft = 'auto';
                    element.style.marginRight = 'auto';
                } else if (value === 'right') {
                    element.style.display = 'block';
                    element.style.marginLeft = 'auto';
                    element.style.marginRight = '0';
                } else {
                    element.style.display = 'block';
                    element.style.marginLeft = '0';
                    element.style.marginRight = 'auto';
                }
                break;
            case 'margin': element.style.margin = value; break;
            case 'padding': element.style.padding = value; break;
            case 'borderRadius': element.style.borderRadius = value + 'px'; break;
            case 'borderWidth': element.style.borderWidth = value + 'px'; break;
            case 'borderStyle': element.style.borderStyle = value; break;
            case 'borderColor': element.style.borderColor = value; break;
            case 'opacity': element.style.opacity = value; break;
            case 'boxShadow': element.style.boxShadow = value; break;
            case 'position': element.style.position = value; break;
            case 'top': element.style.top = value; break;
            case 'left': element.style.left = value; break;
            case 'zIndex': element.style.zIndex = value; break;
            default: return false;
        }
        return true;
    }

    static rgbToHex(rgb) {
        if (!rgb || !rgb.match) return '#000000';
        const result = rgb.match(/\d+/g);
        if (!result) return '#000000';
        const r = parseInt(result[0]);
        const g = parseInt(result[1]);
        const b = parseInt(result[2]);
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }
} 