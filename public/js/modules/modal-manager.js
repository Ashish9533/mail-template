// Modal Manager Module
export class ModalManager {
    constructor() {
        this.builder = null;
        this.activeModal = null;
    }
    
    async init(builder) {
        this.builder = builder;
        this.setupModalEvents();
    }
    
    setupModalEvents() {
        // Global modal close handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
            
            if (e.target.classList.contains('modal-close')) {
                const modal = e.target.closest('.modal');
                if (modal) this.closeModal(modal.id);
            }
        });
        
        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeModal(this.activeModal);
            }
        });
        
        // Setup specific modal handlers
        this.setupNewTemplateModal();
        this.setupLoadTemplateModal();
        this.setupCodeModal();
    }
    
    setupNewTemplateModal() {
        const form = document.getElementById('newTemplateForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewTemplate();
            });
        }
    }
    
    setupLoadTemplateModal() {
        const loadBtn = document.getElementById('loadSelectedTemplate');
        const searchInput = document.getElementById('templateSearch');
        
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                this.handleLoadTemplate();
            });
        }
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterTemplates(e.target.value);
            });
        }
    }
    
    setupCodeModal() {
        const tabs = document.querySelectorAll('.code-tab');
        const applyBtn = document.getElementById('applyCode');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchCodeTab(e.target.dataset.tab);
            });
        });
        
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.handleApplyCode();
            });
        }
    }
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        this.closeAllModals();
        modal.classList.remove('hidden');
        this.activeModal = modalId;
        
        // Focus first input if available
        const firstInput = modal.querySelector('input, textarea, select');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
        
        // Load modal-specific data
        this.loadModalData(modalId);
    }
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
        
        if (this.activeModal === modalId) {
            this.activeModal = null;
        }
    }
    
    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.add('hidden');
        });
        this.activeModal = null;
    }
    
    loadModalData(modalId) {
        switch (modalId) {
            case 'loadTemplateModal':
                this.loadTemplatesList();
                break;
            case 'codeModal':
                this.loadCurrentCode();
                break;
        }
    }
    
    async loadTemplatesList() {
        try {
            const response = await fetch(window.apiBaseUrl);
            const templates = await response.json();
            
            const listContainer = document.getElementById('templateList');
            if (!listContainer) return;
            
            listContainer.innerHTML = templates.map(template => `
                <div class="template-item p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 ${template.selected ? 'bg-blue-50 border-blue-300' : ''}" 
                     data-template-id="${template.id}" 
                     onclick="this.parentNode.querySelectorAll('.template-item').forEach(t => t.classList.remove('bg-blue-50', 'border-blue-300')); this.classList.add('bg-blue-50', 'border-blue-300'); this.parentNode.parentNode.parentNode.querySelector('#loadSelectedTemplate').disabled = false;">
                    <h4 class="font-medium text-gray-900">${template.name}</h4>
                    <p class="text-sm text-gray-500 mt-1">Updated ${this.formatDate(template.updated_at)}</p>
                </div>
            `).join('');
            
        } catch (error) {
            this.builder.getManager('notification')?.show('error', 'Failed to load templates');
        }
    }
    
    loadCurrentCode() {
        const templateData = this.builder.getManager('template')?.getCurrentTemplateData();
        
        const htmlCode = document.getElementById('htmlCode');
        const cssCode = document.getElementById('cssCode');
        
        if (htmlCode) htmlCode.value = templateData?.html || '';
        if (cssCode) cssCode.value = templateData?.css || '';
    }
    
    switchCodeTab(tab) {
        const tabs = document.querySelectorAll('.code-tab');
        const contents = document.querySelectorAll('.code-content');
        
        tabs.forEach(t => {
            t.classList.remove('active', 'border-blue-500', 'text-blue-600');
            t.classList.add('border-transparent', 'text-gray-500');
        });
        
        contents.forEach(c => c.classList.add('hidden'));
        
        const activeTab = document.querySelector(`[data-tab="${tab}"]`);
        const activeContent = document.getElementById(`${tab}Tab`);
        
        if (activeTab) {
            activeTab.classList.add('active', 'border-blue-500', 'text-blue-600');
            activeTab.classList.remove('border-transparent', 'text-gray-500');
        }
        
        if (activeContent) {
            activeContent.classList.remove('hidden');
        }
    }
    
    async handleNewTemplate() {
        const nameInput = document.getElementById('newTemplateName');
        const typeSelect = document.getElementById('newTemplateType');
        
        if (!nameInput?.value.trim()) {
            this.builder.getManager('notification')?.show('error', 'Please enter a template name');
            return;
        }
        
        try {
            // Clear current template and start fresh
            await this.builder.getManager('template')?.newTemplate();
            
            // Set the new name
            const templateNameInput = document.getElementById('templateName');
            if (templateNameInput) {
                templateNameInput.value = nameInput.value;
            }
            
            // Load template type if not blank
            const templateType = typeSelect?.value;
            if (templateType && templateType !== 'blank') {
                this.loadTemplateType(templateType);
            }
            
            this.closeModal('newTemplateModal');
            this.builder.getManager('notification')?.show('success', 'New template created!');
            
        } catch (error) {
            this.builder.getManager('notification')?.show('error', 'Failed to create template: ' + error.message);
        }
    }
    
    async handleLoadTemplate() {
        const selectedItem = document.querySelector('.template-item.bg-blue-50');
        
        if (!selectedItem) {
            this.builder.getManager('notification')?.show('warning', 'Please select a template');
            return;
        }
        
        const templateId = selectedItem.dataset.templateId;
        
        try {
            const response = await fetch(`${window.apiBaseUrl}/${templateId}`);
            const template = await response.json();
            
            await this.builder.getManager('template')?.load(template);
            this.closeModal('loadTemplateModal');
            
        } catch (error) {
            this.builder.getManager('notification')?.show('error', 'Failed to load template: ' + error.message);
        }
    }
    
    handleApplyCode() {
        const htmlCode = document.getElementById('htmlCode')?.value;
        const cssCode = document.getElementById('cssCode')?.value;
        
        try {
            // Apply HTML to canvas
            if (htmlCode) {
                const canvas = document.getElementById('templateContent');
                if (canvas) {
                    canvas.innerHTML = htmlCode;
                    
                    // Make components interactive
                    const components = canvas.querySelectorAll('.email-component');
                    components.forEach(component => {
                        this.builder.getManager('dragDrop')?.makeElementInteractive(component);
                    });
                }
            }
            
            // Apply CSS
            if (cssCode) {
                this.builder.getManager('template')?.loadCustomCSS(cssCode);
            }
            
            this.closeModal('codeModal');
            this.builder.getManager('template')?.markAsModified();
            this.builder.getManager('notification')?.show('success', 'Code applied successfully!');
            
        } catch (error) {
            this.builder.getManager('notification')?.show('error', 'Failed to apply code: ' + error.message);
        }
    }
    
    loadTemplateType(type) {
        const templates = {
            welcome: `
                <div class="email-component" data-component-id="header_1">
                    <header class="bg-blue-600 text-white p-6 text-center">
                        <h1 class="text-2xl font-bold">Welcome to Our Platform!</h1>
                    </header>
                </div>
                <div class="email-component" data-component-id="content_1">
                    <div class="p-6">
                        <h2 class="text-xl font-semibold mb-4">Hello {{user_name}}!</h2>
                        <p class="text-gray-700 mb-4">Thank you for joining us. We're excited to have you on board!</p>
                        <a href="{{getting_started_url}}" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">Get Started</a>
                    </div>
                </div>
            `,
            newsletter: `
                <div class="email-component" data-component-id="header_1">
                    <header class="bg-gray-100 p-4 text-center">
                        <h1 class="text-xl font-bold">{{newsletter_title}}</h1>
                        <p class="text-gray-600">{{newsletter_date}}</p>
                    </header>
                </div>
                <div class="email-component" data-component-id="content_1">
                    <div class="p-6">
                        <h2 class="text-lg font-semibold mb-3">Latest News</h2>
                        <p class="text-gray-700 mb-4">{{newsletter_content}}</p>
                    </div>
                </div>
            `,
            promotion: `
                <div class="email-component" data-component-id="banner_1">
                    <div class="bg-red-600 text-white text-center p-4">
                        <h1 class="text-2xl font-bold">{{offer_title}}</h1>
                        <p class="text-lg">{{offer_description}}</p>
                    </div>
                </div>
                <div class="email-component" data-component-id="cta_1">
                    <div class="text-center p-6">
                        <a href="{{offer_url}}" class="inline-block bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold">Shop Now</a>
                    </div>
                </div>
            `
        };
        
        const templateHtml = templates[type];
        if (templateHtml) {
            const canvas = document.getElementById('templateContent');
            if (canvas) {
                canvas.innerHTML = templateHtml;
                
                // Make components interactive
                const components = canvas.querySelectorAll('.email-component');
                components.forEach(component => {
                    this.builder.getManager('dragDrop')?.makeElementInteractive(component);
                });
            }
        }
    }
    
    filterTemplates(query) {
        const items = document.querySelectorAll('.template-item');
        const searchTerm = query.toLowerCase();
        
        items.forEach(item => {
            const title = item.querySelector('h4').textContent.toLowerCase();
            if (title.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }
} 