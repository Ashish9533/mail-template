<div id="loadTemplateModal" class="modal hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Load Template</h3>
            
            <div class="space-y-4">
                <div>
                    <input type="text" id="templateSearch" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Search templates...">
                </div>
                
                <div class="max-h-64 overflow-y-auto">
                    <div id="templateList" class="space-y-2">
                        <!-- Template list will be populated by JavaScript -->
                    </div>
                </div>
                
                <div class="flex justify-end space-x-3 pt-4">
                    <button type="button" class="modal-close px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                        Cancel
                    </button>
                    <button type="button" id="loadSelectedTemplate" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700" disabled>
                        Load Template
                    </button>
                </div>
            </div>
        </div>
    </div>
</div> 