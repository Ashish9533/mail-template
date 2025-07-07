// Rotation Manager Module
export class RotationManager {
    constructor() {
        this.builder = null;
        this.isRotating = false;
        this.rotatingElement = null;
        this.startAngle = 0;
        this.initialRotation = 0;
        this.rotationHandle = null;
    }

    async init(builder) {
        this.builder = builder;
    }

    makeRotatable(element, handle) {
        this.rotationHandle = handle;
        this.rotationHandle.addEventListener('mousedown', (e) => this.startRotation(e, element));
    }

    startRotation(e, element) {
        e.preventDefault();
        e.stopPropagation();

        this.isRotating = true;
        this.rotatingElement = element;

        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const startX = e.clientX;
        const startY = e.clientY;

        this.startAngle = Math.atan2(startY - centerY, startX - centerX) * (180 / Math.PI);
        this.initialRotation = this.getCurrentRotation(element);

        const handleMouseMove = (e) => this.handleRotation(e);
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            this.stopRotation();
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    handleRotation(e) {
        if (!this.isRotating || !this.rotatingElement) return;

        const rect = this.rotatingElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
        const rotationChange = currentAngle - this.startAngle;

        const newRotation = this.initialRotation + rotationChange;
        this.applyRotation(this.rotatingElement, newRotation);
    }

    stopRotation() {
        if (this.rotatingElement) {
            const finalRotation = this.getCurrentRotation(this.rotatingElement);
            this.builder.getManager('history')?.recordAction('rotate', {
                elementId: this.rotatingElement.dataset.componentId,
                oldRotation: this.initialRotation,
                newRotation: finalRotation,
            });
            this.builder.getManager('template')?.markAsModified();
        }
        this.isRotating = false;
        this.rotatingElement = null;
    }

    applyRotation(element, angle) {
        element.style.transform = `rotate(${angle}deg)`;
        this.builder.getManager('component').updateSelectionBox(element);
        this.builder.getManager('component').showResizeHandles(element);
    }

    getCurrentRotation(element) {
        const transform = window.getComputedStyle(element).transform;
        if (transform === 'none') return 0;
        
        const matrix = transform.match(/^matrix\((.+)\)$/);
        if (matrix) {
            const values = matrix[1].split(', ').map(parseFloat);
            return Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));
        }
        return 0;
    }
} 