// Template Manager Module
export class TemplateManager {
    constructor() {
        this.builder = null;
        this.currentTemplate = null;
        this.isModified = false;
        this.lastSaved = null;
        this.autoSaveInterval = null;
    }
    
    async init(builder) {
        this.builder = builder;
        this.setupSaveButton();
        this.setupAutoSave();
        this.loadTemplateFromPage();
    }
    
    setupSaveButton() {
        const saveBtn = document.getElementById('saveBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.save();
            });
        }
        
        const templateNameInput = document.getElementById('templateName');
        if (templateNameInput) {
            templateNameInput.addEventListener('input', () => {
                this.markAsModified();
            });
        }
    }
    
    setupAutoSave() {
        const autoSaveCheckbox = document.getElementById('autoSave');
        const saveIntervalSelect = document.getElementById('saveInterval');
        
        if (autoSaveCheckbox?.checked) {
            const interval = parseInt(saveIntervalSelect?.value || '60') * 1000;
            this.startAutoSave(interval);
        }
        
        autoSaveCheckbox?.addEventListener('change', (e) => {
            if (e.target.checked) {
                const interval = parseInt(saveIntervalSelect?.value || '60') * 1000;
                this.startAutoSave(interval);
            } else {
                this.stopAutoSave();
            }
        });
        
        saveIntervalSelect?.addEventListener('change', (e) => {
            if (autoSaveCheckbox?.checked) {
                this.stopAutoSave();
                const interval = parseInt(e.target.value) * 1000;
                this.startAutoSave(interval);
            }
        });
    }
    
    loadTemplateFromPage() {
        const container = document.querySelector('.mail-builder-container');
        const templateData = container?.dataset.template;
        
        if (templateData) {
            try {
                const template = JSON.parse(templateData);
                this.load(template);
            } catch (error) {
                console.warn('Failed to load template from page data:', error);
            }
        }
    }
    
    async save() {
        try {
            this.showSaveProgress();
            
            const templateData = this.getCurrentTemplateData();
            
            if (this.currentTemplate?.id) {
                // Update existing template
                await this.updateTemplate(this.currentTemplate.id, templateData);
            } else {
                // Create new template
                const result = await this.createTemplate(templateData);
                this.currentTemplate = result.template;
                this.updateURL(result.template.id);
            }
            
            this.isModified = false;
            this.lastSaved = new Date();
            this.updateSaveStatus('saved');
            
            return this.currentTemplate;
        } catch (error) {
            this.builder.getManager('notification')?.show('error', 'Failed to save template: ' + error.message);
            throw error;
        } finally {
            this.hideSaveProgress();
        }
    }
    
    async autoSave() {
        if (!this.isModified) return;
        
        try {
            const templateData = this.getCurrentTemplateData();
            
            if (this.currentTemplate?.id) {
                await this.updateTemplate(this.currentTemplate.id, templateData);
                this.isModified = false;
                this.lastSaved = new Date();
                this.showAutoSaveIndicator();
            }
        } catch (error) {
            console.warn('Auto-save failed:', error);
        }
    }
    
    async load(template) {
        try {
            this.currentTemplate = template;
            this.loadTemplateIntoCanvas(template);
            this.updateTemplateName(template.name);
            this.isModified = false;
            this.updateSaveStatus('saved');
        } catch (error) {
            this.builder.getManager('notification')?.show('error', 'Failed to load template: ' + error.message);
            throw error;
        }
    }
    
    getCurrentTemplateData() {
        const canvas = document.getElementById('templateContent');
        const templateName = document.getElementById('templateName')?.value || 'Untitled Template';
        
        const html = canvas ? canvas.innerHTML : '';
        const css = this.extractCustomCSS();
        const variables = this.extractVariables(html);
        
        return {
            name: templateName,
            html: html,
            css: css,
            variables: variables
        };
    }
    
    async createTemplate(templateData) {
        const response = await fetch(window.apiBaseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': window.csrfToken
            },
            body: JSON.stringify(templateData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create template');
        }
        
        return await response.json();
    }
    
    async updateTemplate(id, templateData) {
        const response = await fetch(`${window.apiBaseUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': window.csrfToken
            },
            body: JSON.stringify(templateData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update template');
        }
        
        return await response.json();
    }
    
    loadTemplateIntoCanvas(template) {
        const canvas = document.getElementById('templateContent');
        if (!canvas) return;
        
        // Clear existing content
        canvas.innerHTML = '';
        
        if (template.html) {
            canvas.innerHTML = template.html;
            
            // Make all components interactive
            const components = canvas.querySelectorAll('.email-component');
            components.forEach(component => {
                this.builder.getManager('dragDrop')?.makeElementInteractive(component);
            });
        }
        
        // Load custom CSS if any
        if (template.css) {
            this.loadCustomCSS(template.css);
        }
    }
    
    extractCustomCSS() {
        const styleElements = document.querySelectorAll('style[data-custom="true"]');
        let css = '';
        
        styleElements.forEach(style => {
            css += style.textContent + '\n';
        });
        
        return css.trim();
    }
    
    loadCustomCSS(css) {
        // Remove existing custom styles
        const existingStyles = document.querySelectorAll('style[data-custom="true"]');
        existingStyles.forEach(style => style.remove());
        
        if (css) {
            const styleElement = document.createElement('style');
            styleElement.setAttribute('data-custom', 'true');
            styleElement.textContent = css;
            document.head.appendChild(styleElement);
        }
    }
    
    extractVariables(html) {
        const variableRegex = /\{\{([^}]+)\}\}/g;
        const variables = new Set();
        let match;
        
        while ((match = variableRegex.exec(html)) !== null) {
            variables.add(match[1].trim());
        }
        
        return Array.from(variables);
    }
    
    async exportAsHTML() {
        try {
            const templateData = this.getCurrentTemplateData();
            const fullHTML = this.generateFullHTML(templateData);
            
            const blob = new Blob([fullHTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `${templateData.name.replace(/[^a-z0-9]/gi, '_')}.html`;
            a.click();
            
            URL.revokeObjectURL(url);
            
            this.builder.getManager('notification')?.show('success', 'Template exported successfully!');
        } catch (error) {
            this.builder.getManager('notification')?.show('error', 'Failed to export template: ' + error.message);
        }
    }
    
    generateFullHTML(templateData) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${templateData.name}</title>
    <style>
        ${templateData.css}
        
        /* Email-safe CSS */
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        table { border-collapse: collapse; }
        img { display: block; max-width: 100%; height: auto; }
    </style>
</head>
<body>
    ${templateData.html}
</body>
</html>`;
    }
    
    async duplicateTemplate() {
        if (!this.currentTemplate?.id) {
            this.builder.getManager('notification')?.show('warning', 'No template to duplicate');
            return;
        }
        
        try {
            const response = await fetch(`${window.apiBaseUrl}/${this.currentTemplate.id}/duplicate`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': window.csrfToken
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to duplicate template');
            }
            
            const result = await response.json();
            this.currentTemplate = result.template;
            this.updateTemplateName(result.template.name);
            this.updateURL(result.template.id);
            
            this.builder.getManager('notification')?.show('success', 'Template duplicated successfully!');
        } catch (error) {
            this.builder.getManager('notification')?.show('error', 'Failed to duplicate template: ' + error.message);
        }
    }
    
    async newTemplate() {
        if (this.isModified) {
            const confirmDiscard = confirm('You have unsaved changes. Are you sure you want to create a new template?');
            if (!confirmDiscard) return;
        }
        
        // Clear canvas
        const canvas = document.getElementById('templateContent');
        if (canvas) {
            canvas.innerHTML = `
                <div class="text-center py-16 text-gray-400">
                    <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    <p class="text-lg font-medium">Start building your email template</p>
                    <p class="text-sm mt-1">Drag and drop components from the sidebar</p>
                </div>
            `;
        }
        
        // Reset state
        this.currentTemplate = null;
        this.isModified = false;
        this.updateTemplateName('');
        this.updateURL();
        this.updateSaveStatus('saved');
        
        // Clear properties panel
        this.builder.getManager('properties')?.clearProperties();
        
        // Deselect any selected elements
        this.builder.deselectElement();
    }
    
    markAsModified() {
        if (!this.isModified) {
            this.isModified = true;
            this.updateSaveStatus('unsaved');
        }
    }
    
    hasUnsavedChanges() {
        return this.isModified;
    }
    
    updateSaveStatus(status) {
        this.builder.updateSaveStatus(status);
    }
    
    updateTemplateName(name) {
        const templateNameInput = document.getElementById('templateName');
        if (templateNameInput) {
            templateNameInput.value = name;
        }
    }
    
    updateURL(templateId = null) {
        const url = new URL(window.location);
        
        if (templateId) {
            url.searchParams.set('id', templateId);
        } else {
            url.searchParams.delete('id');
        }
        
        window.history.replaceState({}, '', url);
    }
    
    showSaveProgress() {
        const saveBtn = document.getElementById('saveBtn');
        const saveIcon = document.getElementById('saveIcon');
        const saveText = document.getElementById('saveText');
        
        if (saveBtn) {
            saveBtn.disabled = true;
            saveIcon.className = 'w-4 h-4 mr-2 animate-spin';
            saveIcon.innerHTML = '<circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path>';
            saveText.textContent = 'Saving...';
        }
    }
    
    hideSaveProgress() {
        const saveBtn = document.getElementById('saveBtn');
        const saveIcon = document.getElementById('saveIcon');
        const saveText = document.getElementById('saveText');
        
        if (saveBtn) {
            saveBtn.disabled = false;
            saveIcon.className = 'w-4 h-4 mr-2';
            saveIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>';
            saveText.textContent = 'Save';
        }
    }
    
    showAutoSaveIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm border border-green-200';
        indicator.textContent = 'Auto-saved';
        
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            indicator.remove();
        }, 2000);
    }
    
    startAutoSave(interval) {
        this.stopAutoSave();
        this.autoSaveInterval = setInterval(() => {
            this.autoSave();
        }, interval);
    }
    
    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }
} 