<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Email Dashboard</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-100">
    <div class="min-h-screen">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b border-gray-200">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-6">
                    <div class="flex items-center">
                        <h1 class="text-3xl font-bold text-gray-900">
                            <i class="fas fa-envelope text-blue-600 mr-3"></i>
                            Email Dashboard
                        </h1>
                    </div>
                    <div class="flex items-center space-x-4">
                        <a href="{{ route('mail-template.builder') }}" 
                           class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                            <i class="fas fa-plus mr-2"></i>Create Template
                        </a>
                    </div>
                </div>
            </div>
        </header>

        <!-- Stats Cards -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <i class="fas fa-file-alt text-blue-600 text-2xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-500">Total Templates</p>
                            <p class="text-2xl font-semibold text-gray-900">{{ $stats['total_templates'] }}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <i class="fas fa-hand-wave text-green-600 text-2xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-500">Welcome Templates</p>
                            <p class="text-2xl font-semibold text-gray-900">{{ $stats['templates_by_type']['welcome'] }}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <i class="fas fa-newspaper text-purple-600 text-2xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-500">Newsletters</p>
                            <p class="text-2xl font-semibold text-gray-900">{{ $stats['templates_by_type']['newsletter'] }}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <i class="fas fa-percentage text-orange-600 text-2xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-500">Promotions</p>
                            <p class="text-2xl font-semibold text-gray-900">{{ $stats['templates_by_type']['promotion'] }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Templates Table -->
            <div class="bg-white rounded-lg shadow">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-medium text-gray-900">Email Templates</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Template Name
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created Date
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Variables
                                </th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            @forelse($templates as $template)
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <i class="fas fa-envelope text-gray-400 mr-3"></i>
                                        <div class="text-sm font-medium text-gray-900">
                                            {{ $template['name'] }}
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ \Carbon\Carbon::parse($template['created_at'])->format('M d, Y') }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <button onclick="showVariables('{{ $template['id'] }}')" 
                                            class="text-blue-600 hover:text-blue-900 text-sm">
                                        <i class="fas fa-code mr-1"></i>View Variables
                                    </button>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button onclick="previewTemplate('{{ $template['id'] }}')" 
                                            class="text-green-600 hover:text-green-900">
                                        <i class="fas fa-eye"></i> Preview
                                    </button>
                                    <button onclick="sendTestEmail('{{ $template['id'] }}')" 
                                            class="text-blue-600 hover:text-blue-900">
                                        <i class="fas fa-paper-plane"></i> Test
                                    </button>
                                    <button onclick="editTemplate('{{ $template['id'] }}')" 
                                            class="text-indigo-600 hover:text-indigo-900">
                                        <i class="fas fa-edit"></i> Edit
                                    </button>
                                </td>
                            </tr>
                            @empty
                            <tr>
                                <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                                    <div class="flex flex-col items-center py-8">
                                        <i class="fas fa-inbox text-gray-300 text-4xl mb-4"></i>
                                        <p class="text-lg font-medium text-gray-900 mb-2">No templates found</p>
                                        <p class="text-sm text-gray-500 mb-4">Get started by creating your first email template</p>
                                        <a href="{{ route('mail-template.builder') }}" 
                                           class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                                            <i class="fas fa-plus mr-2"></i>Create Template
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">
                        <i class="fas fa-cog text-gray-600 mr-2"></i>Test Configuration
                    </h3>
                    <p class="text-sm text-gray-600 mb-4">Test your email configuration</p>
                    <div class="flex space-x-2">
                        <input type="email" id="test-email" placeholder="test@example.com" 
                               class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <button onclick="testMailConfig()" 
                                class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors">
                            Test
                        </button>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">
                        <i class="fas fa-newspaper text-gray-600 mr-2"></i>Send Newsletter
                    </h3>
                    <p class="text-sm text-gray-600 mb-4">Send newsletter to all subscribers</p>
                    <button onclick="showNewsletterModal()" 
                            class="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors">
                        <i class="fas fa-send mr-2"></i>Send Newsletter
                    </button>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">
                        <i class="fas fa-percentage text-gray-600 mr-2"></i>Send Promotion
                    </h3>
                    <p class="text-sm text-gray-600 mb-4">Send promotional emails</p>
                    <button onclick="showPromotionModal()" 
                            class="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md transition-colors">
                        <i class="fas fa-megaphone mr-2"></i>Send Promotion
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modals and JavaScript will be added here -->
    <script src="{{ asset('js/email-dashboard.js') }}"></script>
</body>
</html> 