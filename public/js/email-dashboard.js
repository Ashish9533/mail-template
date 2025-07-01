// Email Dashboard JavaScript

class EmailDashboard {
    constructor() {
        this.csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
        this.init();
    }

    init() {
        console.log('Email Dashboard initialized');
    }

    // Preview template in new window
    previewTemplate(templateId) {
        const url = `/emails/preview/${templateId}`;
        window.open(url, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    }

    // Show template variables
    async showVariables(templateId) {
        try {
            const response = await fetch(`/emails/variables/${templateId}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const data = await response.json();
            
            if (response.ok) {
                this.showModal('Template Variables', `
                    <div class="mb-4">
                        <h4 class="font-semibold text-gray-900">Template: ${data.template_name}</h4>
                        <p class="text-sm text-gray-600">Found ${data.variable_count} variables</p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-md">
                        <h5 class="font-medium text-gray-900 mb-2">Available Variables:</h5>
                        <ul class="list-disc list-inside space-y-1">
                            ${data.variables.map(variable => `
                                <li class="text-sm text-gray-700">
                                    <code class="bg-gray-200 px-2 py-1 rounded">{{${variable}}}</code>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `);
            } else {
                this.showNotification('Error loading template variables', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error loading template variables', 'error');
        }
    }

    // Send test email
    async sendTestEmail(templateId) {
        const email = prompt('Enter email address for test:');
        if (!email) return;

        try {
            const response = await fetch(`/emails/test/${templateId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': this.csrfToken,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    email: email,
                    data: {
                        user_name: 'Test User',
                        company_name: 'Test Company'
                    }
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                this.showNotification(`Test email sent to ${email}!`, 'success');
            } else {
                this.showNotification(data.error || 'Error sending test email', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error sending test email', 'error');
        }
    }

    // Edit template (redirect to builder)
    editTemplate(templateId) {
        window.location.href = `/mail-template?load=${templateId}`;
    }

    // Test mail configuration
    async testMailConfig() {
        const email = document.getElementById('test-email').value;
        if (!email) {
            this.showNotification('Please enter an email address', 'error');
            return;
        }

        try {
            const response = await fetch('/emails/test-config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': this.csrfToken,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email: email })
            });

            const data = await response.json();
            
            if (response.ok) {
                this.showNotification(`Test email sent to ${email}!`, 'success');
            } else {
                this.showNotification(data.error || 'Mail configuration error', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error testing mail configuration', 'error');
        }
    }

    // Show newsletter modal
    showNewsletterModal() {
        this.showModal('Send Newsletter', `
            <form id="newsletter-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Newsletter Title</label>
                    <input type="text" name="newsletter_title" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="Weekly Newsletter">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Article Title</label>
                    <input type="text" name="main_article_title" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="This Week's Updates">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Article Content</label>
                    <textarea name="main_article_content" required rows="4"
                              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Newsletter content goes here..."></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Call-to-Action URL</label>
                    <input type="url" name="cta_url" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="https://example.com">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                    <input type="text" name="cta_text" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="Read More">
                </div>
                <div class="flex justify-end space-x-2 pt-4">
                    <button type="button" onclick="emailDashboard.closeModal()" 
                            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
                        Cancel
                    </button>
                    <button type="submit" 
                            class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                        Send Newsletter
                    </button>
                </div>
            </form>
        `);

        // Handle form submission
        document.getElementById('newsletter-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendNewsletter(e.target);
        });
    }

    // Show promotion modal
    showPromotionModal() {
        this.showModal('Send Promotion', `
            <form id="promotion-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Promotion Title</label>
                    <input type="text" name="promotion_title" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="50% OFF Everything!">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Discount Code</label>
                    <input type="text" name="discount_code" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="SAVE50">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <input type="text" name="expiry_date" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="End of this month">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Shop URL</label>
                    <input type="url" name="shop_url" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="https://shop.example.com">
                </div>
                <div class="flex justify-end space-x-2 pt-4">
                    <button type="button" onclick="emailDashboard.closeModal()" 
                            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
                        Cancel
                    </button>
                    <button type="submit" 
                            class="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                        Send Promotion
                    </button>
                </div>
            </form>
        `);

        // Handle form submission
        document.getElementById('promotion-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendPromotion(e.target);
        });
    }

    // Send newsletter
    async sendNewsletter(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        data.template_id = 'newsletter-template'; // You might want to make this selectable

        try {
            const response = await fetch('/emails/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': this.csrfToken,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            
            if (response.ok) {
                this.showNotification(result.message, 'success');
                this.closeModal();
            } else {
                this.showNotification(result.error || 'Error sending newsletter', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error sending newsletter', 'error');
        }
    }

    // Send promotion
    async sendPromotion(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        data.template_id = 'promotion-template'; // You might want to make this selectable

        try {
            const response = await fetch('/emails/promotion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': this.csrfToken,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            
            if (response.ok) {
                this.showNotification(result.message, 'success');
                this.closeModal();
            } else {
                this.showNotification(result.error || 'Error sending promotion', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error sending promotion', 'error');
        }
    }

    // Show modal
    showModal(title, content) {
        const modal = document.createElement('div');
        modal.id = 'dashboard-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-90vh overflow-y-auto">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">${title}</h3>
                    <button onclick="emailDashboard.closeModal()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div>${content}</div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Close modal
    closeModal() {
        const modal = document.getElementById('dashboard-modal');
        if (modal) {
            modal.remove();
        }
    }

    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 transition-all duration-300 ${
            type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Global functions for button onclick events
function previewTemplate(templateId) {
    emailDashboard.previewTemplate(templateId);
}

function showVariables(templateId) {
    emailDashboard.showVariables(templateId);
}

function sendTestEmail(templateId) {
    emailDashboard.sendTestEmail(templateId);
}

function editTemplate(templateId) {
    emailDashboard.editTemplate(templateId);
}

function testMailConfig() {
    emailDashboard.testMailConfig();
}

function showNewsletterModal() {
    emailDashboard.showNewsletterModal();
}

function showPromotionModal() {
    emailDashboard.showPromotionModal();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.emailDashboard = new EmailDashboard();
}); 