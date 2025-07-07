// Drag and Drop Manager Module
export class DragDropManager {
    constructor() {
        this.builder = null;
        this.draggedElement = null;
        this.dropIndicator = null;
        this.isGridSnapping = false;
        this.gridSize = 20;
    }
    
    async init(builder) {
        this.builder = builder;
        this.setupDragEvents();
        this.createDropIndicator();
        this.setupGridSnapping();
    }
    
    setupDraggableComponent(item) {
        this.builder.getManager('event').addEventListener(item, 'dragstart', (e) => {
            this.handleComponentDragStart(e);
        });

        this.builder.getManager('event').addEventListener(item, 'dragend', (e) => {
            this.handleDragEnd(e);
        });
    }
    
    setupDragEvents() {
        // Component items in sidebar
        this.setupSidebarDragEvents();
        
        // Canvas elements
        this.setupCanvasDragEvents();
        
        // Drop zones
        this.setupDropZones();
    }
    
    setupSidebarDragEvents() {
        const componentItems = document.querySelectorAll('.component-item[draggable="true"], .sticker-item[draggable="true"]');
        
        componentItems.forEach(item => {
            this.setupDraggableComponent(item);
        });
    }
    
    setupCanvasDragEvents() {
        const canvas = document.getElementById('emailCanvas');
        
        canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.handleCanvasDragOver(e);
        });
        
        canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            this.handleCanvasDrop(e);
        });
        
        canvas.addEventListener('dragleave', (e) => {
            this.handleCanvasDragLeave(e);
        });
    }
    
    setupDropZones() {
        const dropZones = document.querySelectorAll('.drop-zone');
        
        dropZones.forEach(zone => {
            this.setupDropZoneEvents(zone);
        });
    }
    
    setupDropZoneEvents(zone) {
        this.builder.getManager('event').addEventListener(zone, 'dragover', (e) => {
            e.preventDefault();
            this.handleDropZoneDragOver(e, zone);
        });
        
        this.builder.getManager('event').addEventListener(zone, 'drop', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent event from bubbling up to parent drop zones
            this.handleDropZoneDrop(e, zone);
        });
        
        this.builder.getManager('event').addEventListener(zone, 'dragleave', (e) => {
            e.stopPropagation();
            this.handleDropZoneDragLeave(e, zone);
        });
    }
    
    handleComponentDragStart(e) {
        const target = e.target.closest('[draggable="true"]');
        if (!target) return;

        const dataType = target.dataset.type;
        let dragData;

        if (dataType === 'emoji' || dataType === 'sticker') {
            dragData = {
                type: 'component', // Treat as component drop
                componentType: dataType,
                componentName: target.dataset.emoji || target.dataset.sticker,
                element: target
            };
        } else {
            dragData = {
                type: 'component',
                componentType: target.dataset.componentType,
                componentName: target.dataset.componentName,
                element: target
            };
        }

        this.draggedElement = dragData;
        
        // Set drag data
        e.dataTransfer.setData('text/plain', JSON.stringify(this.draggedElement));
        e.dataTransfer.effectAllowed = 'copy';
        
        // Visual feedback
        target.classList.add('dragging');
        this.showDragPreview(dragData.componentName);
        
        console.log('Started dragging component:', dragData.componentType);
    }
    
    handleCanvasDragOver(e) {
        const dropZone = this.findDropZone(e.target);
        if (dropZone) {
            this.showDropIndicator(e, dropZone);
        }
    }
    
    handleCanvasDrop(e) {
        const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));

        // Handle repositioning first, as it can happen anywhere on the canvas
        if (dragData.type === 'element' && dragData.reposition) {
            this.builder.getManager('reposition').repositionElement(dragData, e, this.draggedElement);
            this.hideDropIndicator();
            return; // Stop further processing
        }
        
        const dropZone = this.findDropZone(e.target);
        if (!dropZone) {
            this.hideDropIndicator();
            return;
        }
        
        if (dragData.type === 'component') {
            this.createComponent(dragData, dropZone, e);
        } else if (dragData.type === 'element') {
            this.moveElement(dragData, dropZone, e);
        }
        
        this.hideDropIndicator();
    }
    
    handleCanvasDragLeave(e) {
        // Only hide indicator if leaving canvas entirely
        if (!e.currentTarget.contains(e.relatedTarget)) {
            this.hideDropIndicator();
        }
    }
    
    handleDropZoneDragOver(e, zone) {
        zone.classList.add('drag-over');
        this.showDropIndicator(e, zone);
    }
    
    handleDropZoneDrop(e, zone) {
        const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));

        // If a repositionable element is dropped, reposition it instead of moving it.
        if (dragData.type === 'element' && dragData.reposition) {
            this.builder.getManager('reposition').repositionElement(dragData, e, this.draggedElement);
        } else if (dragData.type === 'component') {
            this.createComponent(dragData, zone, e);
        } else if (dragData.type === 'element') {
            this.moveElement(dragData, zone, e);
        }
        
        zone.classList.remove('drag-over');
        this.hideDropIndicator();
    }
    
    handleDropZoneDragLeave(e, zone) {
        zone.classList.remove('drag-over');
    }
    
    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        this.hideDragPreview();
        this.hideDropIndicator();
        this.draggedElement = null;
    }
    
    createComponent(dragData, dropZone, event) {
        const { componentType, componentName } = dragData;
        let componentHtml;
        let isSticker = componentType === 'sticker';
        let isEmoji = componentType === 'emoji';

        if (isEmoji || isSticker) {
            componentHtml = this.builder.getManager('sticker').getComponentHtml(componentType, componentName);
        } else {
            componentHtml = this.getComponentHtml(componentType);
        }

        if (componentHtml) {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = componentHtml;
            const newElement = wrapper.firstElementChild;

            newElement.classList.add('email-component');
            newElement.setAttribute('data-component-id', this.generateComponentId());
            this.makeElementInteractive(newElement);

            if (isSticker || isEmoji) {
                const canvasContent = document.getElementById('canvasContent');
                const canvasRect = canvasContent.getBoundingClientRect();
                const left = event.clientX - canvasRect.left - 25; // Centering adjustment for 50px
                const top = event.clientY - canvasRect.top - 25;  // Centering adjustment for 50px
                newElement.style.left = `${left}px`;
                newElement.style.top = `${top}px`;
                canvasContent.appendChild(newElement);
            } else {
                const insertPosition = this.calculateInsertPosition(event, dropZone);
                const children = Array.from(dropZone.children);
                if (insertPosition >= children.length) {
                    dropZone.appendChild(newElement);
                } else {
                    dropZone.insertBefore(newElement, children[insertPosition]);
                }
            }
            
            this.builder.getManager('history')?.recordAction('add', {
                elementId: newElement.dataset.componentId,
                html: componentHtml,
                parent: newElement.parentNode,
                position: Array.from(newElement.parentNode.children).indexOf(newElement)
            });
            
            this.builder.getManager('template')?.markAsModified();
            this.builder.getManager('notification')?.show('success', `${dragData.componentName} added successfully!`);
        }
    }
    
    getComponentHtml(componentType) {
        const componentTemplates = {
            heading: '<h2 class="text-2xl font-bold text-gray-900 mb-4">Your Heading Here</h2>',
            text: '<p class="text-gray-700 mb-4">Your text content goes here. Edit this text to customize your message.</p>',
            button: '<a href="#" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">Click Here</a>',
            image: '<img src="https://via.placeholder.com/400x200" alt="Placeholder" class="w-full h-auto rounded-md">',
            container: `
                <div class="container-wrapper" style="background-color: transparent; padding: 10px 0;">
                    <div class="container drop-zone" style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px dashed #ccc; min-height: 100px; position: relative;">
                    </div>
                </div>
            `,
            row: '<div class="flex flex-wrap -mx-2 border border-dashed border-gray-300 drop-zone min-h-[80px]" style="position: relative;"></div>',
            column: '<div class="flex-1 px-2 border border-dashed border-gray-300 drop-zone min-h-[60px]" style="position: relative;"></div>',
            spacer: '<div class="h-8"></div>',
            divider: '<hr class="border-gray-300 my-6">',
            signature: '<div class="signature-placeholder" style="padding: 2rem; border: 2px dashed #ccc; text-align: center; color: #6b7280;">Click to add signature</div>',
            social: this.getSocialIconsHtml(),
            footer: this.getFooterHtml(),
            header: this.getHeaderHtml()
        };
        
        return componentTemplates[componentType] || null;
    }
    
    getSocialIconsHtml() {
        return `
            <div class="flex justify-center space-x-4 my-6">
                <a href="#" class="text-blue-600 hover:text-blue-800">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                </a>
                <a href="#" class="text-blue-600 hover:text-blue-800">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                </a>
            </div>
        `;
    }
    
    getFooterHtml() {
        return `
            <footer class="bg-gray-100 p-6 text-center text-sm text-gray-600">
                <p>© 2024 Your Company. All rights reserved.</p>
                <p class="mt-2">
                    <a href="#" class="text-blue-600 hover:underline">Unsubscribe</a> | 
                    <a href="#" class="text-blue-600 hover:underline">Privacy Policy</a>
                </p>
            </footer>
        `;
    }
    
    getHeaderHtml() {
        return `
            <header class="bg-blue-600 text-white p-6 text-center">
                <h1 class="text-2xl font-bold">Your Company</h1>
                <p class="mt-2">Newsletter Header</p>
            </header>
        `;
    }
    
    findDropZone(element) {
        return element.closest('.drop-zone');
    }
    
    calculateInsertPosition(event, dropZone) {
        const rect = dropZone.getBoundingClientRect();
        const children = Array.from(dropZone.children);
        
        if (children.length === 0) {
            return 0;
        }
        
        const mouseY = event.clientY - rect.top;
        
        for (let i = 0; i < children.length; i++) {
            const childRect = children[i].getBoundingClientRect();
            const childY = childRect.top - rect.top;
            
            if (mouseY < childY + childRect.height / 2) {
                return i;
            }
        }
        
        return children.length;
    }
    
    insertComponentAt(html, dropZone, position) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        const element = wrapper.firstElementChild;
        
        // Add necessary classes and attributes
        element.classList.add('email-component');
        element.setAttribute('data-component-id', this.generateComponentId());
        
        // Make element selectable and editable
        this.makeElementInteractive(element);
        
        const children = Array.from(dropZone.children);
        if (position >= children.length) {
            dropZone.appendChild(element);
        } else {
            dropZone.insertBefore(element, children[position]);
        }
        return element;
    }
    
    makeElementInteractive(element) {
        this.builder.getManager('event').addEventListener(element, 'click', (e) => {
            e.stopPropagation();
            this.builder.selectElement(element);
        });
        
        this.builder.getManager('event').addEventListener(element, 'dblclick', (e) => {
            e.stopPropagation();
            this.startInlineEditing(element);
        });
        
        // Make draggable for reordering
        element.setAttribute('draggable', 'true');
        this.builder.getManager('event').addEventListener(element, 'dragstart', (e) => {
            this.handleElementDragStart(e, element);
        });

        // If the new element is a dropzone, set it up
        if (element.classList.contains('drop-zone')) {
            this.setupDropZoneEvents(element);
        }

        // Also set up drop zones that are children of the new element
        const childDropZones = element.querySelectorAll('.drop-zone');
        childDropZones.forEach(zone => this.setupDropZoneEvents(zone));
    }
    
    handleElementDragStart(e, element) {
        const elementStyle = window.getComputedStyle(element);
        const parentIsDropZone = element.parentNode.classList.contains('drop-zone');
        
        // Define tags that can be repositioned within a container
        const repositionableTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'IMG', 'A', 'BUTTON'];
        const isRepositionableElement = repositionableTags.includes(element.tagName) && parentIsDropZone;
        
        const isRepositionable = element.classList.contains('sticker') || elementStyle.position === 'absolute' || isRepositionableElement;
        
        let dragData = {
            type: 'element',
            elementId: element.dataset.componentId,
        };

        if (isRepositionable) {
            const rect = element.getBoundingClientRect();
            dragData.reposition = true;
            dragData.offsetX = e.clientX - rect.left;
            dragData.offsetY = e.clientY - rect.top;
        }

        this.draggedElement = {
            type: 'element',
            element: element,
            sourceParent: element.parentNode,
            ...dragData
        };
        
        e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
        
        element.classList.add('dragging');
    }
    
    startInlineEditing(element) {
        if (element.tagName === 'P' || element.tagName === 'H1' || 
            element.tagName === 'H2' || element.tagName === 'H3') {
            element.contentEditable = true;
            element.focus();
            
            element.addEventListener('blur', () => {
                element.contentEditable = false;
                this.builder.getManager('template')?.markAsModified();
            }, { once: true });
        }
    }
    
    createDropIndicator() {
        this.dropIndicator = document.createElement('div');
        this.dropIndicator.className = 'drop-indicator absolute bg-blue-500 opacity-75 pointer-events-none';
        this.dropIndicator.style.height = '2px';
        this.dropIndicator.style.display = 'none';
        document.body.appendChild(this.dropIndicator);
    }
    
    showDropIndicator(event, dropZone) {
        const position = this.calculateInsertPosition(event, dropZone);
        const rect = dropZone.getBoundingClientRect();
        const children = Array.from(dropZone.children);
        
        let indicatorY;
        if (children.length === 0 || position >= children.length) {
            indicatorY = rect.bottom - 1;
        } else {
            const childRect = children[position].getBoundingClientRect();
            indicatorY = childRect.top - 1;
        }
        
        this.dropIndicator.style.display = 'block';
        this.dropIndicator.style.left = rect.left + 'px';
        this.dropIndicator.style.top = indicatorY + 'px';
        this.dropIndicator.style.width = rect.width + 'px';
    }
    
    hideDropIndicator() {
        this.dropIndicator.style.display = 'none';
    }
    
    showDragPreview(componentName) {
        const preview = document.getElementById('dragPreview');
        const text = document.getElementById('dragPreviewText');
        
        if (preview && text) {
            text.textContent = `Adding ${componentName}`;
            preview.classList.remove('hidden');
        }
    }
    
    hideDragPreview() {
        const preview = document.getElementById('dragPreview');
        if (preview) {
            preview.classList.add('hidden');
        }
    }
    
    setupGridSnapping() {
        const gridToggle = document.getElementById('snapToGrid');
        if (gridToggle) {
            gridToggle.addEventListener('change', (e) => {
                this.isGridSnapping = e.target.checked;
            });
        }
        
        const gridSizeSelect = document.getElementById('gridSize');
        if (gridSizeSelect) {
            gridSizeSelect.addEventListener('change', (e) => {
                this.gridSize = parseInt(e.target.value);
            });
        }
    }
    
    snapToGrid(position) {
        if (!this.isGridSnapping) return position;
        
        return {
            x: Math.round(position.x / this.gridSize) * this.gridSize,
            y: Math.round(position.y / this.gridSize) * this.gridSize
        };
    }
    
    generateComponentId() {
        return 'component_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    moveElement(dragData, dropZone, event) {
        const elementId = dragData.elementId;
        if (!elementId) return;

        const elementToMove = document.querySelector(`[data-component-id="${elementId}"]`);
        if (!elementToMove) {
            console.warn(`Could not find element to move with ID: ${elementId}`);
            return;
        }

        // Prevent moving an element inside itself
        if (elementToMove === dropZone || elementToMove.contains(dropZone)) {
            this.builder.getManager('notification')?.show('error', "You can't move a container inside itself.");
            return;
        }

        const originalParent = elementToMove.parentNode;
        const originalNextSibling = elementToMove.nextSibling;

        const insertPosition = this.calculateInsertPosition(event, dropZone);
        const children = Array.from(dropZone.children);

        if (insertPosition >= children.length) {
            dropZone.appendChild(elementToMove);
        } else {
            dropZone.insertBefore(elementToMove, children[insertPosition]);
        }

        this.builder.getManager('history')?.recordAction('move', {
            elementId,
            fromParent: originalParent,
            fromNextSibling: originalNextSibling,
            toParent: dropZone,
            toPosition: insertPosition,
        });

        this.builder.getManager('template')?.markAsModified();
        this.builder.getManager('notification')?.show('info', 'Element moved');
    }
} 