export class HeaderProperties {
    static getDefinition(element) {
        const computedStyle = window.getComputedStyle(element);
        const titleElement = element.querySelector('h1');
        const subtitleElement = element.querySelector('p');
        const logoElement = element.querySelector('img');

        const titleStyle = titleElement ? window.getComputedStyle(titleElement) : {};
        const subtitleStyle = subtitleElement ? window.getComputedStyle(subtitleElement) : {};

        return {
            logoAndSubtitle: {
                label: 'Logo & Subtitle',
                type: 'group',
                properties: {
                    logoUrl: {
                        label: 'Logo URL',
                        type: 'url',
                        value: logoElement ? logoElement.src : '',
                    },
                    logoAlt: {
                        label: 'Logo Alt Text',
                        type: 'text',
                        value: logoElement ? logoElement.alt : '',
                    },
                    subtitleText: {
                        label: 'Subtitle Text',
                        type: 'text',
                        value: subtitleElement ? subtitleElement.textContent : '',
                    }
                }
            },
            typography: {
                label: 'Typography',
                type: 'group',
                properties: {
                    headerFontFamily: {
                        label: 'Font Family',
                        type: 'select',
                        value: titleStyle.fontFamily?.split(',')[0].replace(/"/g, '').trim() || 'Arial',
                        options: this.getFontOptions(),
                    },
                    headerFontSize: {
                        label: 'Title Font Size',
                        type: 'range',
                        value: parseInt(titleStyle.fontSize) || 24,
                        min: 12, max: 72, unit: 'px'
                    },
                    headerFontWeight: {
                        label: 'Title Font Weight',
                        type: 'select',
                        value: titleStyle.fontWeight || '700',
                        options: this.getFontWeightOptions()
                    },
                    headerLineHeight: {
                        label: 'Title Line Height',
                        type: 'range',
                        value: parseFloat(titleStyle.lineHeight) || 1.2,
                        min: 0.8, max: 2.5, step: 0.1
                    },
                    subtitleFontSize: {
                        label: 'Subtitle Font Size',
                        type: 'range',
                        value: parseInt(subtitleStyle.fontSize) || 16,
                        min: 10, max: 36, unit: 'px'
                    },
                    headerLetterSpacing: {
                        label: 'Letter Spacing',
                        type: 'range',
                        value: parseFloat(titleStyle.letterSpacing) || 0,
                        min: -2, max: 10, unit: 'px'
                    },
                    headerTextAlign: {
                        label: 'Text Align',
                        type: 'select',
                        value: computedStyle.textAlign,
                        options: this.getTextAlignOptions(),
                    },
                    headerTextTransform: {
                        label: 'Text Transform',
                        type: 'select',
                        value: titleStyle.textTransform || 'none',
                        options: this.getTextTransformOptions(),
                    },
                }
            },
            layout: {
                label: 'Layout & Spacing',
                type: 'group',
                properties: {
                    paddingTop: {
                        label: 'Padding Top',
                        type: 'range',
                        value: parseInt(computedStyle.paddingTop) || 0,
                        min: 0, max: 100, unit: 'px'
                    },
                    paddingBottom: {
                        label: 'Padding Bottom',
                        type: 'range',
                        value: parseInt(computedStyle.paddingBottom) || 0,
                        min: 0, max: 100, unit: 'px'
                    },
                }
            },
            background: {
                label: 'Background',
                type: 'group',
                properties: {
                    headerBgColor: {
                        label: 'Background Color',
                        type: 'color',
                        value: this.rgbToHex(computedStyle.backgroundColor) || '#ffffff',
                    },
                    headerBgImage: {
                        label: 'Background Image URL',
                        type: 'url',
                        value: computedStyle.backgroundImage.slice(4, -1).replace(/"/g, ""),
                    }
                }
            },
            border: {
                label: 'Border',
                type: 'group',
                properties: {
                    headerBorderStyle: {
                        label: 'Border Style',
                        type: 'select',
                        value: computedStyle.borderStyle,
                        options: [{value: 'none', label: 'None'}, {value: 'solid', label: 'Solid'}, {value: 'dashed', label: 'Dashed'}, {value: 'dotted', label: 'Dotted'}]
                    },
                    headerBorderWidth: {
                        label: 'Border Width',
                        type: 'range',
                        value: parseInt(computedStyle.borderWidth) || 0,
                        min: 0, max: 20, unit: 'px'
                    },
                    headerBorderColor: {
                        label: 'Border Color',
                        type: 'color',
                        value: this.rgbToHex(computedStyle.borderColor) || '#000000'
                    }
                }
            }
        };
    }

    static applyStyle(element, property, value) {
        const titleElement = element.querySelector('h1');
        const subtitleElement = element.querySelector('p');
        let logoElement = element.querySelector('img');

        switch (property) {
            // Content
            case 'logoUrl':
                if (!logoElement) {
                    logoElement = document.createElement('img');
                    logoElement.style.maxWidth = '150px';
                    logoElement.style.margin = '0 auto 1rem';
                    element.prepend(logoElement);
                }
                logoElement.src = value;
                if (!value) logoElement.remove();
                break;
            case 'logoAlt':
                if (logoElement) logoElement.alt = value;
                break;
            case 'subtitleText':
                if (!subtitleElement) {
                    subtitleElement = document.createElement('p');
                    element.append(subtitleElement);
                }
                subtitleElement.textContent = value;
                break;

            // Typography
            case 'headerFontFamily': if (titleElement) titleElement.style.fontFamily = value; break;
            case 'headerFontSize': if (titleElement) titleElement.style.fontSize = value + 'px'; break;
            case 'headerFontWeight': if (titleElement) titleElement.style.fontWeight = value; break;
            case 'headerLineHeight': if (titleElement) titleElement.style.lineHeight = value; break;
            case 'subtitleFontSize': if (subtitleElement) subtitleElement.style.fontSize = value + 'px'; break;
            case 'headerLetterSpacing': if (titleElement) titleElement.style.letterSpacing = value + 'px'; break;
            case 'headerTextAlign': element.style.textAlign = value; break;
            case 'headerTextTransform': if (titleElement) titleElement.style.textTransform = value; break;
            
            // Layout
            case 'paddingTop': element.style.paddingTop = value + 'px'; break;
            case 'paddingBottom': element.style.paddingBottom = value + 'px'; break;
            
            // Background
            case 'headerBgColor': element.style.backgroundColor = value; break;
            case 'headerBgImage': element.style.backgroundImage = value ? `url(${value})` : 'none'; break;
            
            // Border
            case 'headerBorderStyle': element.style.borderStyle = value; break;
            case 'headerBorderWidth': element.style.borderWidth = value + 'px'; break;
            case 'headerBorderColor': element.style.borderColor = value; break;

            default:
                return false; // Property not handled
        }
        return true; // Property handled
    }
    
    // Helper methods for options
    static getFontOptions() {
        return [
            { value: 'Arial, sans-serif', label: 'Arial' },
            { value: 'Helvetica, sans-serif', label: 'Helvetica' },
            { value: 'Georgia, serif', label: 'Georgia' },
            { value: 'Times New Roman, serif', label: 'Times New Roman' },
            { value: 'Verdana, sans-serif', label: 'Verdana' },
            { value: 'Courier New, monospace', label: 'Courier New' },
            { value: 'Roboto, sans-serif', label: 'Roboto'},
            { value: 'Open Sans, sans-serif', label: 'Open Sans'},
            { value: 'Montserrat, sans-serif', label: 'Montserrat'},
        ];
    }

    static getFontWeightOptions() {
        return [
            { value: '300', label: 'Light' },
            { value: '400', label: 'Normal' },
            { value: '500', label: 'Medium' },
            { value: '700', label: 'Bold' },
            { value: '900', label: 'Black' },
        ];
    }
    
    static getTextAlignOptions() {
        return [
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
        ];
    }

    static getTextTransformOptions() {
        return [
            { value: 'none', label: 'None' },
            { value: 'uppercase', label: 'Uppercase' },
            { value: 'lowercase', label: 'Lowercase' },
            { value: 'capitalize', label: 'Capitalize' },
        ];
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