# Laravel Components Guide - Mail Template Builder

This guide documents the modular Laravel Blade component structure implemented for the mail template builder.

## Overview

The mail template builder has been refactored to use Laravel's component approach, making the code more modular, maintainable, and reusable. Each section of the interface is now a separate component that can be easily modified, extended, or reused.

## Component Structure

### Main Components

#### 1. Main Component (`x-mail-builder.main`)
- **File**: `resources/views/components/mail-builder/main.blade.php`
- **Class**: `App\View\Components\MailBuilder\Main`
- **Purpose**: Main container that brings together all other components
- **Props**: `templateName` (optional)

#### 2. Header Component (`x-mail-builder.header`)
- **File**: `resources/views/components/mail-builder/header.blade.php`
- **Class**: `App\View\Components\MailBuilder\Header`
- **Purpose**: Contains the main header with template name input and action buttons
- **Props**: `templateName` (optional)

#### 3. Sidebar Component (`x-mail-builder.sidebar`)
- **File**: `resources/views/components/mail-builder/sidebar.blade.php`
- **Class**: `App\View\Components\MailBuilder\Sidebar`
- **Purpose**: Component library sidebar with all available components and templates

#### 4. Toolbar Component (`x-mail-builder.toolbar`)
- **File**: `resources/views/components/mail-builder/toolbar.blade.php`
- **Class**: `App\View\Components\MailBuilder\Toolbar`
- **Purpose**: Enhanced toolbar with device selector, zoom controls, and editing tools

#### 5. Canvas Component (`x-mail-builder.canvas`)
- **File**: `resources/views/components/mail-builder/canvas.blade.php`
- **Class**: `App\View\Components\MailBuilder\Canvas`
- **Purpose**: Main canvas area with grid overlay, rulers, and drop zones

#### 6. Properties Panel (`x-mail-builder.properties-panel`)
- **File**: `resources/views/components/mail-builder/properties-panel.blade.php`
- **Class**: `App\View\Components\MailBuilder\PropertiesPanel`
- **Purpose**: Right sidebar for editing component properties

#### 7. Notification Component (`x-mail-builder.notification`)
- **File**: `resources/views/components/mail-builder/notification.blade.php`
- **Class**: `App\View\Components\MailBuilder\Notification`
- **Purpose**: Toast notification system

### Reusable Components

#### 8. Component Item (`x-mail-builder.component-item`)
- **File**: `resources/views/components/mail-builder/component-item.blade.php`
- **Class**: `App\View\Components\MailBuilder\ComponentItem`
- **Purpose**: Individual component items in the sidebar
- **Props**:
  - `component`: Component type identifier
  - `icon`: FontAwesome icon class
  - `label`: Display label
  - `draggable`: Whether component is draggable (default: true)
  - `special`: Whether component has special styling (default: false)
  - `specialClasses`: Custom CSS classes for special styling

#### 9. Component Category (`x-mail-builder.component-category`)
- **File**: `resources/views/components/mail-builder/component-category.blade.php`
- **Class**: `App\View\Components\MailBuilder\ComponentCategory`
- **Purpose**: Category containers in the sidebar
- **Props**:
  - `title`: Category title
  - `icon`: FontAwesome icon class
  - `columns`: Number of columns in grid (default: 2)

### Modal Components

#### 10. New Template Modal (`x-mail-builder.modals.new-template-modal`)
- **File**: `resources/views/components/mail-builder/modals/new-template-modal.blade.php`
- **Class**: `App\View\Components\MailBuilder\Modals\NewTemplateModal`
- **Purpose**: Modal for creating new templates

#### 11. Load Modal (`x-mail-builder.modals.load-modal`)
- **File**: `resources/views/components/mail-builder/modals/load-modal.blade.php`
- **Class**: `App\View\Components\MailBuilder\Modals\LoadModal`
- **Purpose**: Modal for loading existing templates

#### 12. Code Modal (`x-mail-builder.modals.code-modal`)
- **File**: `resources/views/components/mail-builder/modals/code-modal.blade.php`
- **Class**: `App\View\Components\MailBuilder\Modals\CodeModal`
- **Purpose**: Modal for viewing and editing HTML/CSS code

## Usage Examples

### Basic Usage
```blade
<x-mail-builder.main :templateName="'My Template'" />
```

### Custom Component Item
```blade
<x-mail-builder.component-item 
    component="custom" 
    icon="fas fa-star" 
    label="Custom Component"
    :special="true"
    specialClasses="bg-gradient-to-r from-purple-50 to-pink-50" />
```

### Custom Component Category
```blade
<x-mail-builder.component-category title="Custom Category" icon="fas fa-puzzle-piece" :columns="3">
    <!-- Component items go here -->
</x-mail-builder.component-category>
```

## Service Provider

The `ComponentServiceProvider` (`app/Providers/ComponentServiceProvider.php`) registers all components with Laravel's Blade system. It's automatically loaded via `bootstrap/providers.php`.

## Benefits of This Approach

### 1. **Modularity**
- Each component is self-contained and can be modified independently
- Easy to add new components or modify existing ones
- Clear separation of concerns

### 2. **Reusability**
- Components can be reused across different views
- Easy to create variations of components
- Consistent styling and behavior

### 3. **Maintainability**
- Smaller, focused files are easier to understand and maintain
- Changes to one component don't affect others
- Clear component hierarchy

### 4. **Testability**
- Each component can be tested independently
- Easier to write unit tests for specific functionality
- Better isolation of concerns

### 5. **Developer Experience**
- Better IDE support with autocomplete
- Clear component structure
- Easy to find and modify specific parts

## File Structure

```
resources/views/components/mail-builder/
├── main.blade.php
├── header.blade.php
├── sidebar.blade.php
├── toolbar.blade.php
├── canvas.blade.php
├── properties-panel.blade.php
├── notification.blade.php
├── component-item.blade.php
├── component-category.blade.php
└── modals/
    ├── new-template-modal.blade.php
    ├── load-modal.blade.php
    └── code-modal.blade.php

app/View/Components/MailBuilder/
├── Main.php
├── Header.php
├── Sidebar.php
├── Toolbar.php
├── Canvas.php
├── PropertiesPanel.php
├── Notification.php
├── ComponentItem.php
├── ComponentCategory.php
└── Modals/
    ├── NewTemplateModal.php
    ├── LoadModal.php
    └── CodeModal.php
```

## Migration from Monolithic Approach

The original monolithic `builder.blade.php` file has been replaced with a clean, component-based structure:

**Before:**
```blade
<!-- 500+ lines of HTML in a single file -->
<div id="mail-template-builder" class="h-screen flex flex-col">
    <!-- All HTML here -->
</div>
```

**After:**
```blade
@extends('layouts.app')

@section('content')
    <x-mail-builder.main :templateName="old('template_name', '')" />
@endsection
```

## Extending Components

To add new functionality or modify existing components:

1. **Add new props** to the component class constructor
2. **Update the Blade template** to use the new props
3. **Register any new components** in `ComponentServiceProvider`

### Example: Adding a new prop to Header component

```php
// app/View/Components/MailBuilder/Header.php
public function __construct($templateName = '', $showSaveButton = true)
{
    $this->templateName = $templateName;
    $this->showSaveButton = $showSaveButton;
}
```

```blade
<!-- resources/views/components/mail-builder/header.blade.php -->
@if($showSaveButton)
    <button id="save-btn" class="...">Save</button>
@endif
```

## Best Practices

1. **Keep components focused** - Each component should have a single responsibility
2. **Use meaningful prop names** - Make props self-documenting
3. **Provide default values** - Always provide sensible defaults for optional props
4. **Document complex components** - Add comments for complex logic
5. **Test components** - Write tests for component behavior
6. **Follow naming conventions** - Use kebab-case for component names and files

## Conclusion

This component-based approach significantly improves the maintainability and extensibility of the mail template builder. The modular structure makes it easy to add new features, modify existing functionality, and reuse components across the application. 