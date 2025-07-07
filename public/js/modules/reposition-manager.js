export class RepositionManager {
    constructor() {
        this.builder = null;
    }

    async init(builder) {
        this.builder = builder;
    }

    repositionElement(dragData, event, draggedElementInfo) {
        const elementId = dragData.elementId;
        if (!elementId) return;

        const elementToMove = document.querySelector(`[data-component-id="${elementId}"]`);
        if (!elementToMove) {
            console.warn(`Could not find element to reposition: ${elementId}`);
            return;
        }

        const parentContainer = draggedElementInfo.sourceParent;
        if (!parentContainer) {
            console.warn('Could not find parent container for repositioning.');
            return;
        }

        const parentRect = parentContainer.getBoundingClientRect();

        const newLeft = event.clientX - parentRect.left - (dragData.offsetX || 0);
        const newTop = event.clientY - parentRect.top - (dragData.offsetY || 0);
        
        const oldPosition = {
            left: elementToMove.style.left,
            top: elementToMove.style.top,
        };

        elementToMove.style.position = 'absolute';
        elementToMove.style.left = `${newLeft}px`;
        elementToMove.style.top = `${newTop}px`;
        
        // The element is already in the correct container, no need to append it again.

        this.builder.getManager('history')?.recordAction('reposition', {
            elementId,
            oldPosition,
            newPosition: { left: `${newLeft}px`, top: `${newTop}px` },
        });

        this.builder.getManager('template')?.markAsModified();
        this.builder.getManager('notification')?.show('info', 'Element repositioned');
    }
} 