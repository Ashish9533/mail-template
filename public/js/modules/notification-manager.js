// Notification Manager Module
export class NotificationManager {
    constructor() {
        this.builder = null;
        this.container = null;
        this.template = null;
        this.notifications = new Map();
        this.defaultDuration = 5000;
    }

    async init(builder) {
        this.builder = builder;
        this.container = document.getElementById('notificationContainer');
        this.template = document.getElementById('notificationTemplate');

        if (!this.container) {
            this.createContainer();
        }

        if (!this.template) {
            this.createTemplate();
        }
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'notificationContainer';
        this.container.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(this.container);
    }

    createTemplate() {
        this.template = document.createElement('template');
        this.template.id = 'notificationTemplate';
        this.template.innerHTML = `
            <div class="notification bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm transform transition-all duration-300 translate-x-full opacity-0">
                <div class="flex items-start">
                    <div class="flex-shrink-0">
                        <svg class="notification-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        </svg>
                    </div>
                    <div class="ml-3 flex-1">
                        <p class="notification-title text-sm font-medium text-gray-900"></p>
                        <p class="notification-message text-sm text-gray-500 mt-1"></p>
                    </div>
                    <div class="ml-4 flex-shrink-0">
                        <button class="notification-close text-gray-400 hover:text-gray-600">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(this.template);
    }

    show(type, message, title = '', duration = this.defaultDuration) {
        const notification = this.createNotification(type, message, title);
        const id = this.generateId();

        this.notifications.set(id, notification);
        this.container.appendChild(notification);

        // Trigger animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.remove(id);
            }, duration);
        }

        return id;
    }

    createNotification(type, message, title) {
        const clone = this.template.content.cloneNode(true);
        const notification = clone.querySelector('.notification');
        const icon = clone.querySelector('.notification-icon');
        const titleEl = clone.querySelector('.notification-title');
        const messageEl = clone.querySelector('.notification-message');
        const closeBtn = clone.querySelector('.notification-close');

        // Set type-specific styling and icon
        this.applyTypeStyles(notification, icon, type);

        // Set content
        if (title) {
            titleEl.textContent = title;
        } else {
            titleEl.textContent = this.getDefaultTitle(type);
        }
        messageEl.textContent = message;

        // Setup close button
        closeBtn.addEventListener('click', () => {
            const notificationId = Array.from(this.notifications.entries())
                .find(([id, notif]) => notif === notification)?.[0];
            if (notificationId) {
                this.remove(notificationId);
            }
        });

        return notification;
    }

    applyTypeStyles(notification, icon, type) {
        // Remove existing type classes
        notification.classList.remove('success', 'error', 'warning', 'info');

        // Add type class
        notification.classList.add(type);

        // Set icon and color based on type
        switch (type) {
            case 'success':
                icon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                `;
                icon.setAttribute('class', 'notification-icon w-5 h-5 text-green-500');
                break;

            case 'error':
                icon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                `;
                icon.setAttribute('class', 'notification-icon w-5 h-5 text-red-500');
                break;

            case 'warning':
                icon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.232 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                `;
                icon.setAttribute('class', 'notification-icon w-5 h-5 text-yellow-500');
                break;

            case 'info':
            default:
                icon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                `;
                icon.setAttribute('class', 'notification-icon w-5 h-5 text-blue-500');
                break;
        }
    }

    getDefaultTitle(type) {
        const titles = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Information'
        };
        return titles[type] || 'Notification';
    }

    remove(id) {
        const notification = this.notifications.get(id);
        if (!notification) return;

        // Animate out
        notification.classList.remove('show');
        notification.classList.add('translate-x-full', 'opacity-0');

        // Remove from DOM after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications.delete(id);
        }, 300);
    }

    clear() {
        this.notifications.forEach((notification, id) => {
            this.remove(id);
        });
    }

    showProgress(message, title = 'Processing...') {
        const notification = this.createProgressNotification(message, title);
        const id = this.generateId();

        this.notifications.set(id, notification);
        this.container.appendChild(notification);

        // Trigger animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        return {
            id,
            update: (progress) => this.updateProgress(notification, progress),
            complete: (successMessage) => {
                this.remove(id);
                if (successMessage) {
                    this.show('success', successMessage);
                }
            },
            error: (errorMessage) => {
                this.remove(id);
                this.show('error', errorMessage);
            }
        };
    }

    createProgressNotification(message, title) {
        const notification = document.createElement('div');
        notification.className = 'notification bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm transform transition-all duration-300 translate-x-full opacity-0';

        notification.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                </div>
                <div class="ml-3 flex-1">
                    <p class="notification-title text-sm font-medium text-gray-900">${title}</p>
                    <p class="notification-message text-sm text-gray-500 mt-1">${message}</p>
                    <div class="mt-2 bg-gray-200 rounded-full h-2">
                        <div class="progress-bar bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                    </div>
                </div>
            </div>
        `;

        return notification;
    }

    updateProgress(notification, progress) {
        const progressBar = notification.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
        }
    }

    generateId() {
        return 'notification_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
} 