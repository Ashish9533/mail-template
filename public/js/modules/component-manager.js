// Component Manager Module
export class ComponentManager {
    constructor() {
        this.builder = null;
        this.canvas = null;
        this.selectedElement = null;
        this.components = new Map();
        this.componentCounter = 0;
    }
    
    async init(builder) {
        this.builder = builder;
        this.canvas = document.getElementById('emailCanvas');
        this.setupCanvasEvents();
        this.setupComponentLibrary();
        this.updateCanvasDimensions();
    }
    
    setupCanvasEvents() {
        // Canvas click events for selection
        this.canvas.addEventListener('click', (e) => {
            this.handleCanvasClick(e);
        });
        
        // Double click for editing
        this.canvas.addEventListener('dblclick', (e) => {
            this.handleCanvasDoubleClick(e);
        });
        
        // Mouse tracking for position display
        this.canvas.addEventListener('mousemove', (e) => {
            this.updateMousePosition(e);
        });
        
        // Context menu
        this.canvas.addEventListener('contextmenu', (e) => {
            this.handleContextMenu(e);
        });
    }
    
    setupComponentLibrary() {
        // Setup emoji categories
        this.setupEmojiSystem();
    }
    
    setupEmojiSystem() {
        const emojiCategories = document.querySelectorAll('.emoji-category-btn');
        const emojiGrid = document.getElementById('emojiGrid');
        
        if (emojiCategories.length && emojiGrid) {
            emojiCategories.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.switchEmojiCategory(e.target.dataset.category);
                    this.updateEmojiCategoryUI(e.target);
                });
            });
            
            // Load default category
            this.switchEmojiCategory('smileys');
        }
    }
    
    handleCanvasClick(e) {
        e.stopPropagation();
        
        // Find the closest email component
        const component = e.target.closest('.email-component');
        
        if (component) {
            this.selectComponent(component);
        } else {
            this.deselectAll();
        }
    }
    
    handleCanvasDoubleClick(e) {
        const component = e.target.closest('.email-component');
        if (component) {
            this.startInlineEditing(component);
        }
    }
    
    handleContextMenu(e) {
        e.preventDefault();
        
        const component = e.target.closest('.email-component');
        if (component) {
            this.showContextMenu(e, component);
        }
    }
    
    selectComponent(component) {
        // Deselect previous
        this.deselectAll();
        
        // Select new component
        this.selectedElement = component;
        this.highlightElement(component);
        
        // Update builder state
        this.builder.selectElement(component);
        
        // Show resize handles if applicable
        this.showResizeHandles(component);
    }
    
    deselectAll() {
        if (this.selectedElement) {
            this.unhighlightElement(this.selectedElement);
            this.hideResizeHandles();
            this.selectedElement = null;
        }
        
        // Update builder state
        this.builder.deselectElement();
    }
    
    highlightElement(element) {
        element.classList.add('component-selected');
        this.updateSelectionBox(element);
    }
    
    unhighlightElement(element) {
        element.classList.remove('component-selected', 'component-hover');
        this.hideSelectionBox();
    }
    
    updateSelectionBox(element) {
        const selectionBox = document.getElementById('selectionBox');
        if (!selectionBox) return;
        
        const rect = element.getBoundingClientRect();
        const canvasRect = this.canvas.getBoundingClientRect();
        
        selectionBox.style.left = (rect.left - canvasRect.left) + 'px';
        selectionBox.style.top = (rect.top - canvasRect.top) + 'px';
        selectionBox.style.width = rect.width + 'px';
        selectionBox.style.height = rect.height + 'px';
        selectionBox.classList.remove('hidden');
    }
    
    hideSelectionBox() {
        const selectionBox = document.getElementById('selectionBox');
        if (selectionBox) {
            selectionBox.classList.add('hidden');
        }
    }
    
    showResizeHandles(element) {
        const handles = document.getElementById('resizeHandles');
        if (!handles) return;
        
        const rect = element.getBoundingClientRect();
        const canvasRect = this.canvas.getBoundingClientRect();
        
        handles.style.left = (rect.left - canvasRect.left) + 'px';
        handles.style.top = (rect.top - canvasRect.top) + 'px';
        handles.style.width = rect.width + 'px';
        handles.style.height = rect.height + 'px';
        handles.classList.remove('hidden');
        
        // Setup resize functionality
        this.setupResizeHandles(element, handles);
    }
    
    hideResizeHandles() {
        const handles = document.getElementById('resizeHandles');
        if (handles) {
            handles.classList.add('hidden');
        }
    }
    
    setupResizeHandles(element, handles) {
        const resizeHandles = handles.querySelectorAll('.resize-handle');
        
        resizeHandles.forEach(handle => {
            handle.addEventListener('mousedown', (e) => {
                this.startResize(e, element, handle);
            });
        });
    }
    
    startResize(e, element, handle) {
        e.preventDefault();
        e.stopPropagation();
        
        const startX = e.clientX;
        const startY = e.clientY;
        const startRect = element.getBoundingClientRect();
        const resizeType = handle.className.match(/resize-handle-(\w+)/)[1];
        
        const handleMouseMove = (e) => {
            this.handleResize(e, element, startX, startY, startRect, resizeType);
        };
        
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            this.builder.getManager('template')?.markAsModified();
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }
    
    handleResize(e, element, startX, startY, startRect, resizeType) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        switch (resizeType) {
            case 'se': // Southeast
                element.style.width = (startRect.width + deltaX) + 'px';
                element.style.height = (startRect.height + deltaY) + 'px';
                break;
            case 'sw': // Southwest
                element.style.width = (startRect.width - deltaX) + 'px';
                element.style.height = (startRect.height + deltaY) + 'px';
                break;
            case 'ne': // Northeast
                element.style.width = (startRect.width + deltaX) + 'px';
                element.style.height = (startRect.height - deltaY) + 'px';
                break;
            case 'nw': // Northwest
                element.style.width = (startRect.width - deltaX) + 'px';
                element.style.height = (startRect.height - deltaY) + 'px';
                break;
            case 'e': // East
                element.style.width = (startRect.width + deltaX) + 'px';
                break;
            case 'w': // West
                element.style.width = (startRect.width - deltaX) + 'px';
                break;
            case 's': // South
                element.style.height = (startRect.height + deltaY) + 'px';
                break;
            case 'n': // North
                element.style.height = (startRect.height - deltaY) + 'px';
                break;
        }
        
        // Update selection box and handles
        this.updateSelectionBox(element);
        this.showResizeHandles(element);
    }
    
    deleteElement(element) {
        if (!element) return;
        
        // Record for undo
        this.builder.getManager('history')?.recordAction('delete', {
            element: element.cloneNode(true),
            parent: element.parentNode,
            nextSibling: element.nextSibling
        });
        
        // Remove element
        element.remove();
        
        // Update state
        this.deselectAll();
        this.builder.getManager('template')?.markAsModified();
        this.builder.getManager('notification')?.show('info', 'Component deleted');
    }
    
    duplicateElement(element) {
        if (!element) return;
        
        const clone = element.cloneNode(true);
        clone.setAttribute('data-component-id', this.generateComponentId());
        
        // Insert after original
        element.parentNode.insertBefore(clone, element.nextSibling);
        
        // Make interactive
        this.builder.getManager('dragDrop')?.makeElementInteractive(clone);
        
        // Record for undo
        this.builder.getManager('history')?.recordAction('duplicate', {
            element: clone,
            original: element
        });
        
        this.builder.getManager('template')?.markAsModified();
        this.builder.getManager('notification')?.show('success', 'Component duplicated');
    }
    
    startInlineEditing(element) {
        const editableElements = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'A'];
        
        if (editableElements.includes(element.tagName)) {
            const originalContent = element.innerHTML;
            
            element.contentEditable = true;
            element.focus();
            
            // Select all text
            const range = document.createRange();
            range.selectNodeContents(element);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            
            const finishEditing = () => {
                element.contentEditable = false;
                
                if (element.innerHTML !== originalContent) {
                    this.builder.getManager('history')?.recordAction('edit', {
                        element,
                        oldContent: originalContent,
                        newContent: element.innerHTML
                    });
                    this.builder.getManager('template')?.markAsModified();
                }
            };
            
            element.addEventListener('blur', finishEditing, { once: true });
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    element.blur();
                }
                if (e.key === 'Escape') {
                    element.innerHTML = originalContent;
                    element.blur();
                }
            });
        }
    }
    
    showContextMenu(e, component) {
        const contextMenu = document.getElementById('contextMenu');
        if (!contextMenu) return;
        
        // Position menu
        contextMenu.style.left = e.pageX + 'px';
        contextMenu.style.top = e.pageY + 'px';
        contextMenu.classList.remove('hidden');
        
        // Setup menu actions
        const menuItems = contextMenu.querySelectorAll('.context-menu-item');
        menuItems.forEach(item => {
            item.onclick = (e) => {
                e.stopPropagation();
                this.handleContextAction(item.dataset.action, component);
                contextMenu.classList.add('hidden');
            };
        });
        
        // Hide menu when clicking elsewhere
        const hideMenu = (e) => {
            if (!contextMenu.contains(e.target)) {
                contextMenu.classList.add('hidden');
                document.removeEventListener('click', hideMenu);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', hideMenu);
        }, 10);
    }
    
    handleContextAction(action, component) {
        switch (action) {
            case 'edit':
                this.selectComponent(component);
                break;
            case 'duplicate':
                this.duplicateElement(component);
                break;
            case 'delete':
                this.deleteElement(component);
                break;
        }
    }
    
    filterComponents(query) {
        const componentItems = document.querySelectorAll('.component-item');
        const searchTerm = query.toLowerCase();
        
        componentItems.forEach(item => {
            const name = item.dataset.componentName.toLowerCase();
            const type = item.dataset.componentType.toLowerCase();
            
            if (name.includes(searchTerm) || type.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    toggleCategory(categoryToggle) {
        const category = categoryToggle.dataset.category;
        const content = document.querySelector(`.category-content[data-category="${category}"]`);
        const arrow = categoryToggle.querySelector('.category-arrow');
        
        if (content) {
            const isExpanded = categoryToggle.dataset.expanded === 'true';
            
            if (isExpanded) {
                content.classList.add('hidden');
                categoryToggle.dataset.expanded = 'false';
                arrow.style.transform = 'rotate(0deg)';
            } else {
                content.classList.remove('hidden');
                categoryToggle.dataset.expanded = 'true';
                arrow.style.transform = 'rotate(180deg)';
            }
        }
    }
    
    switchEmojiCategory(category) {
        const emojiGrid = document.getElementById('emojiGrid');
        if (!emojiGrid) return;
        
        const emojis = this.getEmojisByCategory(category);
        
        emojiGrid.innerHTML = emojis.map(emoji => 
            `<div class="emoji-item p-1 cursor-pointer hover:bg-gray-100 rounded text-center" 
                  draggable="true" 
                  data-type="emoji" 
                  data-emoji="${emoji}"
                  title="${emoji}">${emoji}</div>`
        ).join('');
        
        // Make emojis draggable
        const emojiItems = emojiGrid.querySelectorAll('.emoji-item');
        emojiItems.forEach(item => {
            this.builder.getManager('dragDrop')?.setupDraggableComponent(item);
        });
    }
    
    updateEmojiCategoryUI(activeBtn) {
        const categoryBtns = document.querySelectorAll('.emoji-category-btn');
        categoryBtns.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }
    
    getEmojisByCategory(category) {
        const emojiSets = {
            smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩'],
            people: ['👨', '👩', '👴', '👵', '👶', '👼', '👸', '🤴', '👷', '💂', '🕵️', '👩‍⚕️', '👨‍⚕️', '👩‍🌾', '👨‍🌾', '👩‍🍳', '👨‍🍳', '👩‍🎓', '👨‍🎓', '👩‍🎤', '👨‍🎤', '👩‍🏫', '👨‍🏫', '👩‍🏭', '👨‍🏭', '👩‍💻', '👨‍💻', '👩‍💼', '👨‍💼', '👩‍🔧'],
            nature: ['🌱', '🌿', '🍀', '🌳', '🌲', '🌴', '🌵', '🌷', '🌸', '🌺', '🌻', '🌹', '🌼', '🌾', '🍄', '🌰', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸'],
            food: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🍍', '🥭', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥒', '🌶️', '🌽', '🥕', '🥔', '🍠', '🥐', '🍞', '🥖', '🥨', '🧀', '🥚'],
            activities: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥅', '🏒', '🏑', '🏏', '⛳', '🏹', '🎣', '🥊', '🥋', '🎽', '⛸️', '🥌', '🛷', '🎿', '⛷️', '🏂', '🏋️', '🤼', '🤸', '⛹️'],
            travel: ['✈️', '🚂', '🚁', '🚢', '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🏍️', '🛴', '🚲', '🛵', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🎢'],
            objects: ['💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🔩', '⚙️', '🧰', '🧲', '🔫', '💣', '🧨', '🔪', '🗡️', '⚔️'],
            symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '⭐']
        };
        
        return emojiSets[category] || emojiSets.smileys;
    }
    
    updateCanvasDimensions() {
        const canvas = this.canvas;
        if (!canvas) return;
        
        const canvasSizeEl = document.getElementById('canvasSize');
        if (canvasSizeEl) {
            const rect = canvas.getBoundingClientRect();
            canvasSizeEl.textContent = `${Math.round(rect.width)} × ${Math.round(rect.height)}`;
        }
    }
    
    updateMousePosition(e) {
        const mousePositionEl = document.getElementById('mousePosition');
        if (!mousePositionEl) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.round(e.clientX - rect.left);
        const y = Math.round(e.clientY - rect.top);
        
        mousePositionEl.textContent = `${x}, ${y}`;
    }
    
    generateComponentId() {
        return 'component_' + Date.now() + '_' + (++this.componentCounter);
    }
} 