<div id="codeModal" class="modal hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Template Code</h3>
            
            <div class="space-y-4">
                <div class="flex space-x-2 border-b border-gray-200">
                    <button class="code-tab px-4 py-2 text-sm font-medium border-b-2 border-blue-500 text-blue-600 active" data-tab="html">HTML</button>
                    <button class="code-tab px-4 py-2 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700" data-tab="css">CSS</button>
                </div>
                
                <div id="htmlTab" class="code-content">
                    <textarea id="htmlCode" class="w-full h-96 p-3 border border-gray-300 rounded-md font-mono text-sm" placeholder="HTML code will appear here..."></textarea>
                </div>
                
                <div id="cssTab" class="code-content hidden">
                    <textarea id="cssCode" class="w-full h-96 p-3 border border-gray-300 rounded-md font-mono text-sm" placeholder="CSS code will appear here..."></textarea>
                </div>
                
                <div class="flex justify-end space-x-3 pt-4">
                    <button type="button" class="modal-close px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                        Cancel
                    </button>
                    <button type="button" id="applyCode" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                        Apply Changes
                    </button>
                </div>
            </div>
        </div>
    </div>
</div> 