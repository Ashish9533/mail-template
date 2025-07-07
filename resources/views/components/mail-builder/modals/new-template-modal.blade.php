<div id="newTemplateModal" class="modal hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Create New Template</h3>
            
            <form id="newTemplateForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                    <input type="text" id="newTemplateName" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter template name" required>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Template Type</label>
                    <select id="newTemplateType" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="blank">Blank Template</option>
                        <option value="welcome">Welcome Email</option>
                        <option value="newsletter">Newsletter</option>
                        <option value="promotion">Promotional</option>
                        <option value="notification">Notification</option>
                    </select>
                </div>
                
                <div class="flex justify-end space-x-3 pt-4">
                    <button type="button" class="modal-close px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                        Cancel
                    </button>
                    <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                        Create Template
                    </button>
                </div>
            </form>
        </div>
    </div>
</div> 