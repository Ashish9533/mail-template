// Main Mail Template Builder Entry Point
import { DragDropManager } from './modules/drag-drop-manager.js';
import { ComponentManager } from './modules/component-manager.js';
import { PropertiesManager } from './modules/properties-manager.js';
import { TemplateManager } from './modules/template-manager.js';
import { EventHandler } from './modules/event-handler.js';
import { HistoryManager } from './modules/history-manager.js';
import { NotificationManager } from './modules/notification-manager.js';
import { ModalManager } from './modules/modal-manager.js';
import { ToolbarManager } from './modules/toolbar-manager.js';
import { StickerManager } from './modules/sticker-manager.js';
import { RotationManager } from './modules/rotation-manager.js';
import { HeaderProperties } from './modules/header-properties.js';
import { ImageProperties } from './modules/image-properties.js';
import { RepositionManager } from './modules/reposition-manager.js';
import { SignatureManager } from './modules/signature-manager.js';

class MailTemplateBuilder {
    constructor() {
        this.managers = {};
        this.currentTemplate = null;
        this.selectedElement = null;
        this.isInitialized = false;
        
        this.init();
    }
    
    async init() {
        try {
            console.log('Initializing Mail Template Builder...');
            
            // Initialize core managers
            this.managers.notification = new NotificationManager();
            this.managers.modal = new ModalManager();
            this.managers.history = new HistoryManager();
            this.managers.template = new TemplateManager();
            this.managers.component = new ComponentManager();
            this.managers.properties = new PropertiesManager();
            this.managers.dragDrop = new DragDropManager();
            this.managers.toolbar = new ToolbarManager();
            this.managers.event = new EventHandler();
            this.managers.sticker = new StickerManager();
            this.managers.rotation = new RotationManager();
            this.managers.reposition = new RepositionManager();
            this.managers.signature = new SignatureManager();
            
            // Initialize components
            await this.initializeManagers();
            
            // Setup global event listeners
            this.setupGlobalEvents();
            
            // Load initial template if specified
            await this.loadInitialTemplate();
            
            this.isInitialized = true;
            this.managers.notification.show('success', 'Mail Template Builder initialized successfully!');
            
            console.log('Mail Template Builder initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Mail Template Builder:', error);
            this.managers.notification?.show('error', 'Failed to initialize builder: ' + error.message);
        }
    }
    
    async initializeManagers() {
        // Initialize managers in correct order
        const initOrder = [
            'notification',
            'modal', 
            'history',
            'event',
            'template',
            'properties',
            'toolbar',
            'dragDrop',
            'component',
            'sticker',
            'rotation',
            'reposition',
            'signature'
        ];
        
        for (const managerName of initOrder) {
            const manager = this.managers[managerName];
            if (manager && typeof manager.init === 'function') {
                await manager.init(this);
            }
        }
    }
    
    setupGlobalEvents() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', this.handleGlobalKeyboard.bind(this));
        
        // Window events
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        window.addEventListener('resize', this.handleWindowResize.bind(this));
        
        // Auto-save
        this.setupAutoSave();
    }
    
    handleGlobalKeyboard(e) {
        // Ctrl/Cmd + S - Save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            this.saveTemplate();
        }
        
        // Ctrl/Cmd + Z - Undo
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            this.managers.history.undo();
        }
        
        // Ctrl/Cmd + Shift + Z - Redo
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
            e.preventDefault();
            this.managers.history.redo();
        }
        
        // Delete - Delete selected element
        if (e.key === 'Delete' && this.selectedElement) {
            e.preventDefault();
            this.deleteSelectedElement();
        }
        
        // Escape - Deselect
        if (e.key === 'Escape') {
            this.deselectElement();
        }
    }
    
    handleBeforeUnload(e) {
        if (this.managers.template?.hasUnsavedChanges()) {
            e.preventDefault();
            e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            return e.returnValue;
        }
    }
    
    handleWindowResize() {
        // Update canvas dimensions and responsive preview
        this.managers.component?.updateCanvasDimensions();
    }
    
    setupAutoSave() {
        const autoSaveInterval = parseInt(document.getElementById('saveInterval')?.value) || 60;
        
        setInterval(() => {
            if (this.managers.template?.hasUnsavedChanges()) {
                this.autoSave();
            }
        }, autoSaveInterval * 1000);
    }
    
    async loadInitialTemplate() {
        const templateData = document.querySelector('.mail-builder-container')?.dataset.template;
        if (templateData) {
            try {
                const template = JSON.parse(templateData);
                await this.loadTemplate(template);
            } catch (error) {
                console.warn('Failed to load initial template:', error);
            }
        }
    }
    
    // Public API methods
    async saveTemplate() {
        try {
            const result = await this.managers.template.save();
            this.managers.notification.show('success', 'Template saved successfully!');
            return result;
        } catch (error) {
            this.managers.notification.show('error', 'Failed to save template: ' + error.message);
            throw error;
        }
    }
    
    async autoSave() {
        try {
            await this.managers.template.autoSave();
            this.updateSaveStatus('auto-saved');
        } catch (error) {
            console.warn('Auto-save failed:', error);
        }
    }
    
    async loadTemplate(template) {
        try {
            await this.managers.template.load(template);
            this.managers.notification.show('info', 'Template loaded successfully!');
        } catch (error) {
            this.managers.notification.show('error', 'Failed to load template: ' + error.message);
            throw error;
        }
    }
    
    selectElement(element) {
        this.selectedElement = element;
        this.managers.properties?.loadPropertiesFor(element);
        this.managers.component?.highlightElement(element);
        this.updateSelectedInfo(element);
    }
    
    deselectElement() {
        if (this.selectedElement) {
            this.managers.component?.unhighlightElement(this.selectedElement);
            this.selectedElement = null;
            this.managers.properties?.clearProperties();
            this.updateSelectedInfo(null);
        }
    }
    
    deleteSelectedElement() {
        if (this.selectedElement) {
            this.managers.component.deleteElement(this.selectedElement);
            this.deselectElement();
        }
    }
    
    updateSaveStatus(status) {
        const saveStatusEl = document.getElementById('saveStatus');
        const unsavedStatusEl = document.getElementById('unsavedStatus');
        
        switch (status) {
            case 'saved':
                saveStatusEl?.classList.remove('hidden');
                unsavedStatusEl?.classList.add('hidden');
                break;
            case 'unsaved':
                saveStatusEl?.classList.add('hidden');
                unsavedStatusEl?.classList.remove('hidden');
                break;
            case 'auto-saved':
                // Show brief auto-save indicator
                break;
        }
    }
    
    updateSelectedInfo(element) {
        const selectedInfoEl = document.getElementById('selectedInfo');
        if (selectedInfoEl) {
            selectedInfoEl.textContent = element 
                ? `${element.tagName.toLowerCase()}${element.className ? '.' + element.className.split(' ')[0] : ''}`
                : 'No selection';
        }
    }
    
    // Manager accessors
    getManager(name) {
        return this.managers[name];
    }
    
    // Global state accessors
    getCurrentTemplate() {
        return this.currentTemplate;
    }
    
    getSelectedElement() {
        return this.selectedElement;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.mailTemplateBuilder = new MailTemplateBuilder();
});

// Export for external access
export default MailTemplateBuilder; 