export class SignatureProperties {
    static getDefinition(element) {
        const computedStyle = window.getComputedStyle(element);

        return {
            actions: {
                label: 'Actions',
                type: 'group',
                properties: {
                    editSignature: {
                        label: 'Edit Signature',
                        type: 'button',
                        buttonText: 'Open Signature Editor',
                        onClick: (builder) => builder.getManager('signature').showModal(element)
                    }
                }
            },
            styling: {
                label: 'Styling',
                type: 'group',
                properties: {
                    signatureColor: {
                        label: 'Color',
                        type: 'color',
                        value: this.rgbToHex(computedStyle.color) || '#000000',
                    },
                    signatureFontSize: {
                        label: 'Font Size',
                        type: 'range',
                        value: parseInt(computedStyle.fontSize) || 16,
                        min: 10, max: 48, unit: 'px'
                    },
                    signatureTextAlign: {
                        label: 'Alignment',
                        type: 'select',
                        value: computedStyle.textAlign,
                        options: [
                            { value: 'left', label: 'Left' },
                            { value: 'center', label: 'Center' },
                            { value: 'right', label: 'Right' }
                        ]
                    }
                }
            }
        };
    }

    static applyStyle(element, property, value) {
        switch (property) {
            case 'signatureColor':
                element.style.color = value;
                // Apply to children if they exist (for typed signatures)
                element.querySelectorAll('*').forEach(child => child.style.color = value);
                return true;
            case 'signatureFontSize':
                element.style.fontSize = value + 'px';
                return true;
            case 'signatureTextAlign':
                element.style.textAlign = value;
                return true;
        }
        return false;
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