// Dashboard Management Module
class TemplateDashboard {
    constructor() {
        this.templates = [];
        this.filteredTemplates = [];
        this.currentFilter = '';
        this.currentSort = 'updated_at';
        this.searchQuery = '';
        
        this.init();
    }
    
    async init() {
        this.setupEventListeners();
        await this.loadTemplates();
        this.renderTemplates();
    }
    
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchTemplates');
        searchInput?.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.filterAndRenderTemplates();
        });
        
        // Filter by type
        const filterSelect = document.getElementById('filterType');
        filterSelect?.addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.filterAndRenderTemplates();
        });
        
        // Sort options
        const sortSelect = document.getElementById('sortBy');
        sortSelect?.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.filterAndRenderTemplates();
        });
    }
    
    async loadTemplates() {
        try {
            const response = await fetch(window.apiBaseUrl);
            if (!response.ok) throw new Error('Failed to fetch templates');
            
            this.templates = await response.json();
            this.filteredTemplates = [...this.templates];
        } catch (error) {
            console.error('Error loading templates:', error);
            this.showNotification('error', 'Failed to load templates');
        }
    }
    
    filterAndRenderTemplates() {
        this.filteredTemplates = this.templates.filter(template => {
            const matchesSearch = this.searchQuery === '' || 
                template.name.toLowerCase().includes(this.searchQuery);
            
            const matchesFilter = this.currentFilter === '' || 
                template.name.toLowerCase().includes(this.currentFilter);
            
            return matchesSearch && matchesFilter;
        });
        
        this.sortTemplates();
        this.renderTemplates();
    }
    
    sortTemplates() {
        this.filteredTemplates.sort((a, b) => {
            switch (this.currentSort) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'created_at':
                    return new Date(b.created_at) - new Date(a.created_at);
                case 'updated_at':
                default:
                    return new Date(b.updated_at) - new Date(a.updated_at);
            }
        });
    }
    
    renderTemplates() {
        const grid = document.getElementById('templatesGrid');
        const emptyState = document.getElementById('emptyState');
        
        if (this.filteredTemplates.length === 0) {
            grid.innerHTML = '';
            emptyState?.classList.remove('hidden');
            return;
        }
        
        emptyState?.classList.add('hidden');
        
        grid.innerHTML = this.filteredTemplates.map(template => `
            <div class="template-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div class="aspect-w-16 aspect-h-9 bg-gray-100">
                    <div class="flex items-center justify-center">
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="font-medium text-gray-900 truncate" title="${template.name}">${template.name}</h3>
                    <p class="text-sm text-gray-500 mt-1">Updated ${this.formatDate(template.updated_at)}</p>
                    <div class="flex justify-between items-center mt-4">
                        <div class="flex space-x-2">
                            <button onclick="editTemplate('${template.id}')" class="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
                                Edit
                            </button>
                            <button onclick="previewTemplate('${template.id}')" class="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                                Preview
                            </button>
                        </div>
                        <div class="relative">
                            <button onclick="toggleTemplateMenu('${template.id}')" class="p-1 text-gray-400 hover:text-gray-600">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                                </svg>
                            </button>
                            <div id="menu-${template.id}" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                <div class="py-1">
                                    <button onclick="duplicateTemplate('${template.id}')" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Duplicate</button>
                                    <button onclick="exportTemplate('${template.id}')" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Export</button>
                                    <hr class="my-1 border-gray-200">
                                    <button onclick="deleteTemplate('${template.id}')" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        if (diffInHours < 48) return 'Yesterday';
        return date.toLocaleDateString();
    }
    
    showNotification(type, message) {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
            type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' : 
            type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' :
            'bg-blue-100 text-blue-700 border border-blue-200'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    async deleteTemplate(id) {
        if (!confirm('Are you sure you want to delete this template?')) return;
        
        try {
            const response = await fetch(`${window.apiBaseUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': window.csrfToken
                }
            });
            
            if (!response.ok) throw new Error('Failed to delete template');
            
            await this.loadTemplates();
            this.renderTemplates();
            this.showNotification('success', 'Template deleted successfully');
        } catch (error) {
            console.error('Error deleting template:', error);
            this.showNotification('error', 'Failed to delete template');
        }
    }
    
    async duplicateTemplate(id) {
        try {
            const response = await fetch(`${window.apiBaseUrl}/${id}/duplicate`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': window.csrfToken
                }
            });
            
            if (!response.ok) throw new Error('Failed to duplicate template');
            
            await this.loadTemplates();
            this.renderTemplates();
            this.showNotification('success', 'Template duplicated successfully');
        } catch (error) {
            console.error('Error duplicating template:', error);
            this.showNotification('error', 'Failed to duplicate template');
        }
    }
}

// Global functions for template actions
window.createNewTemplate = () => {
    window.location.href = '/mail-templates/builder';
};

window.importTemplate = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.html';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Handle file import
            console.log('Importing template:', file.name);
        }
    };
    input.click();
};

window.editTemplate = (id) => {
    window.location.href = `/mail-templates/builder?id=${id}`;
};

window.previewTemplate = async (id) => {
    try {
        const response = await fetch(`${window.apiBaseUrl}/${id}/preview`);
        if (!response.ok) throw new Error('Failed to load preview');
        
        const data = await response.json();
        const newWindow = window.open('', '_blank');
        newWindow.document.write(data.html);
        newWindow.document.close();
    } catch (error) {
        console.error('Error previewing template:', error);
    }
};

window.toggleTemplateMenu = (id) => {
    const menu = document.getElementById(`menu-${id}`);
    const allMenus = document.querySelectorAll('[id^="menu-"]');
    
    allMenus.forEach(m => {
        if (m !== menu) m.classList.add('hidden');
    });
    
    menu?.classList.toggle('hidden');
};

window.duplicateTemplate = (id) => {
    window.templateDashboard.duplicateTemplate(id);
};

window.exportTemplate = async (id) => {
    try {
        const response = await fetch(`${window.apiBaseUrl}/${id}/export`);
        if (!response.ok) throw new Error('Failed to export template');
        
        const data = await response.json();
        const blob = new Blob([data.html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = data.filename;
        a.click();
        
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting template:', error);
    }
};

window.deleteTemplate = (id) => {
    window.templateDashboard.deleteTemplate(id);
};

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.templateDashboard = new TemplateDashboard();
});

// Close menus when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('[id^="menu-"]') && !e.target.closest('button[onclick*="toggleTemplateMenu"]')) {
        const allMenus = document.querySelectorAll('[id^="menu-"]');
        allMenus.forEach(menu => menu.classList.add('hidden'));
    }
}); 