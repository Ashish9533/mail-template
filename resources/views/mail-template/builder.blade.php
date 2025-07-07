@extends('layouts.app')

@section('title', 'Mail Template Builder')

@section('content')
<div class="h-screen flex flex-col bg-gray-50">
    <!-- Main Builder Interface -->
    <x-mail-builder.main :templateName="$templateName" :template="$template">
        <!-- Header Component -->
        <x-mail-builder.header :templateName="$templateName" />
        
        <!-- Main Content Area -->
        <div class="flex flex-1 overflow-hidden">
            <!-- Sidebar Component -->
            <x-mail-builder.sidebar />
            
            <!-- Main Builder Area -->
            <div class="flex-1 flex flex-col">
                <!-- Toolbar Component -->
                <x-mail-builder.toolbar />
                
                <!-- Canvas Area -->
                <div class="flex-1 flex overflow-hidden">
                    <!-- Canvas Component -->
                    <x-mail-builder.canvas />
                    
                    <!-- Properties Panel Component -->
                    <x-mail-builder.properties-panel />
                </div>
            </div>
        </div>
        
        <!-- Modals -->
        <x-mail-builder.modals.new-template-modal />
        <x-mail-builder.modals.load-modal />
        <x-mail-builder.modals.code-modal />
        <x-mail-builder.modals.signature-modal />
        
        <!-- Notification Component -->
        <x-mail-builder.notification />
    </x-mail-builder.main>
</div>

@push('scripts')
<script type="module" src="{{ asset('js/mail-template-builder.js') }}"></script>
@endpush
@endsection 