// History Manager Module
export class HistoryManager {
    constructor() {
        this.builder = null;
        this.history = [];
        this.currentIndex = -1;
        this.maxHistorySize = 50;
    }
    
    async init(builder) {
        this.builder = builder;
        this.updateUndoRedoButtons();
    }
    
    recordAction(type, data) {
        // Remove any future history if we're not at the end
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }
        
        // Add new action
        const action = {
            type,
            data,
            timestamp: Date.now(),
            templateState: this.captureTemplateState()
        };
        
        this.history.push(action);
        this.currentIndex++;
        
        // Limit history size
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
            this.currentIndex--;
        }
        
        this.updateUndoRedoButtons();
    }
    
    undo() {
        if (!this.canUndo()) return;
        
        this.currentIndex--;
        this.restoreState();
        this.updateUndoRedoButtons();
        
        this.builder.getManager('notification')?.show('info', 'Action undone');
    }
    
    redo() {
        if (!this.canRedo()) return;
        
        this.currentIndex++;
        this.restoreState();
        this.updateUndoRedoButtons();
        
        this.builder.getManager('notification')?.show('info', 'Action redone');
    }
    
    canUndo() {
        return this.currentIndex >= 0;
    }
    
    canRedo() {
        return this.currentIndex < this.history.length - 1;
    }
    
    captureTemplateState() {
        const canvas = document.getElementById('templateContent');
        return {
            html: canvas ? canvas.innerHTML : '',
            templateName: document.getElementById('templateName')?.value || ''
        };
    }
    
    restoreState() {
        if (this.currentIndex < 0) return;
        
        const action = this.history[this.currentIndex];
        const canvas = document.getElementById('templateContent');
        const templateNameInput = document.getElementById('templateName');
        
        if (canvas && action.templateState) {
            canvas.innerHTML = action.templateState.html;
            
            // Make components interactive again
            const components = canvas.querySelectorAll('.email-component');
            components.forEach(component => {
                this.builder.getManager('dragDrop')?.makeElementInteractive(component);
            });
        }
        
        if (templateNameInput && action.templateState) {
            templateNameInput.value = action.templateState.templateName;
        }
        
        // Clear selection
        this.builder.deselectElement();
        
        // Mark as modified
        this.builder.getManager('template')?.markAsModified();
    }
    
    updateUndoRedoButtons() {
        const undoBtn = document.getElementById('undoBtn');
        const redoBtn = document.getElementById('redoBtn');
        
        if (undoBtn) {
            undoBtn.disabled = !this.canUndo();
            undoBtn.classList.toggle('opacity-50', !this.canUndo());
        }
        
        if (redoBtn) {
            redoBtn.disabled = !this.canRedo();
            redoBtn.classList.toggle('opacity-50', !this.canRedo());
        }
    }
    
    clear() {
        this.history = [];
        this.currentIndex = -1;
        this.updateUndoRedoButtons();
    }
    
    getHistoryInfo() {
        return {
            totalActions: this.history.length,
            currentIndex: this.currentIndex,
            canUndo: this.canUndo(),
            canRedo: this.canRedo()
        };
    }
} 