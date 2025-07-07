<div id="notificationContainer" class="fixed top-4 right-4 z-50 space-y-2">
    <!-- Notifications will be dynamically added here -->
</div>

<template id="notificationTemplate">
    <div class="notification bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm transform transition-all duration-300 translate-x-full opacity-0">
        <div class="flex items-start">
            <div class="flex-shrink-0">
                <svg class="notification-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <!-- Icon will be set by JavaScript -->
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
</template>

<style>
.notification.show {
    transform: translateX(0);
    opacity: 1;
}

.notification.success {
    border-left: 4px solid #10b981;
}

.notification.error {
    border-left: 4px solid #ef4444;
}

.notification.warning {
    border-left: 4px solid #f59e0b;
}

.notification.info {
    border-left: 4px solid #3b82f6;
}
</style> 