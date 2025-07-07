# Mail Template Builder - Modular Structure

## Overview

The mail template builder has been refactored into a modular ES6 structure for better maintainability, readability, and scalability. The large monolithic `mail-template-builder.js` file has been broken down into focused modules that handle specific functionality.

## File Structure

```
public/js/
├── mail-template-builder-modular.js     # Main entry point
├── components-config.js                 # Component definitions
├── table-module.js                      # Table functionality
├── component-modules/                   # Component-specific modules
│   ├── drag-drop-module.js
│   ├── container-module.js
│   ├── component-functionality-module.js
│   ├── signature-creator-module.js
│   ├── sticker-module.js
│   ├── quick-add-menu-module.js
│   └── image-upload-module.js
└── modules/                             # Core functionality modules
    ├── event-handler.js                 # Event management
    ├── template-manager.js              # Template operations
    ├── component-manager.js             # Component operations
    ├── properties-manager.js            # Properties panel
    ├── drag-drop-manager.js             # Drag and drop functionality
    ├── modal-manager.js                 # Modal operations
    ├── toolbar-manager.js               # Toolbar functionality
    ├── history-manager.js               # Undo/redo functionality
    └── notification-manager.js          # Notification system
```

## Module Responsibilities

### Core Modules (`modules/`)

#### 1. EventHandler (`event-handler.js`)
- **Purpose**: Manages all event listeners and event setup
- **Responsibilities**:
  - Setup header button events
  - Setup toolbar button events
  - Setup modal events
  - Setup canvas events
  - Setup device and zoom selectors

#### 2. TemplateManager (`template-manager.js`)
- **Purpose**: Handles all template-related operations
- **Responsibilities**:
  - Load saved templates
  - Save templates
  - Load template from database
  - Duplicate templates
  - Delete templates
  - Preview templates
  - Export templates
  - Filter templates

#### 3. ComponentManager (`component-manager.js`)
- **Purpose**: Manages component operations and interactions
- **Responsibilities**:
  - Add components to canvas
  - Select elements
  - Clear canvas
  - Handle canvas clicks
  - Copy/paste/duplicate components
  - Make components draggable
  - Setup free dragging
  - Container management

#### 4. PropertiesManager (`properties-manager.js`)
- **Purpose**: Manages the properties panel functionality
- **Responsibilities**:
  - Show/hide properties panel
  - Generate property inputs
  - Update element properties
  - Handle property changes
  - Delete selected elements

#### 5. DragDropManager (`drag-drop-manager.js`)
- **Purpose**: Handles all drag and drop functionality
- **Responsibilities**:
  - Setup enhanced drag and drop
  - Handle sidebar drag and drop
  - Handle canvas component drag and drop
  - Multi-select functionality
  - Container drop handling
  - Component repositioning

#### 6. ModalManager (`modal-manager.js`)
- **Purpose**: Manages all modal operations
- **Responsibilities**:
  - Show/hide modals
  - Create new templates
  - Handle template variables
  - Layout selection
  - Code formatting
  - Code application

#### 7. ToolbarManager (`toolbar-manager.js`)
- **Purpose**: Manages toolbar functionality
- **Responsibilities**:
  - Grid toggle
  - Snap toggle
  - Rulers toggle
  - Device/zoom changes
  - Multi-select bulk operations
  - Component alignment
  - Component distribution

#### 8. HistoryManager (`history-manager.js`)
- **Purpose**: Manages undo/redo functionality
- **Responsibilities**:
  - Save state
  - Undo operations
  - Redo operations
  - Canvas configuration

#### 9. NotificationManager (`notification-manager.js`)
- **Purpose**: Manages notification system
- **Responsibilities**:
  - Show notifications
  - Handle notification types (success/error)
  - Auto-hide notifications

### Component Modules (`component-modules/`)

These modules handle specific component functionality and remain largely unchanged from the previous structure.

## Benefits of Modular Structure

### 1. **Maintainability**
- Each module has a single responsibility
- Easier to locate and fix bugs
- Clearer code organization

### 2. **Readability**
- Smaller, focused files
- Clear module boundaries
- Better code documentation

### 3. **Reusability**
- Modules can be imported independently
- Easier to test individual components
- Potential for reuse in other projects

### 4. **Debugging**
- Easier to isolate issues
- Better error tracking
- Clearer stack traces

### 5. **Scalability**
- Easy to add new modules
- Simple to extend functionality
- Better team collaboration

## Usage

### Importing the Modular Builder

```html
<script type="module" src="/js/mail-template-builder-modular.js"></script>
```

### Accessing the Builder

```javascript
// The builder is automatically initialized and available globally
window.mailBuilder = new MailTemplateBuilder();
```

### Using Individual Modules

```javascript
// You can also import and use individual modules
import { TemplateManager } from './modules/template-manager.js';
import { ComponentManager } from './modules/component-manager.js';

const templateManager = new TemplateManager(builder);
const componentManager = new ComponentManager(builder);
```

## Migration Notes

### From Monolithic to Modular

1. **File Replacement**: Replace `mail-template-builder.js` with `mail-template-builder-modular.js`
2. **Import Updates**: Update any direct imports to use the new modular structure
3. **Method Calls**: All existing method calls remain the same - the main class delegates to appropriate modules
4. **Global Access**: The `mailBuilder` global object maintains the same API

### Backward Compatibility

The modular structure maintains full backward compatibility:
- All existing method calls work unchanged
- Same global `mailBuilder` object
- Same event handling
- Same functionality

## Future Enhancements

### 1. **Plugin System**
- Easy to add new modules as plugins
- Modular architecture supports extensibility

### 2. **Testing**
- Individual modules can be unit tested
- Better test coverage and isolation

### 3. **Performance**
- Lazy loading of modules
- Better code splitting
- Reduced initial bundle size

### 4. **Documentation**
- Each module can have its own documentation
- Better API documentation
- Clearer development guidelines

## Development Guidelines

### Adding New Modules

1. Create a new file in the appropriate directory
2. Export a class with clear responsibilities
3. Import and initialize in the main builder
4. Add delegation methods if needed

### Module Communication

- Modules communicate through the main builder instance
- Avoid direct module-to-module dependencies
- Use the builder as a central coordinator

### Error Handling

- Each module should handle its own errors
- Use the notification manager for user feedback
- Maintain consistent error handling patterns

## Conclusion

The modular structure provides a solid foundation for future development while maintaining all existing functionality. The code is now more organized, maintainable, and ready for scaling to meet future requirements. 