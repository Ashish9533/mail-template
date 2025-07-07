# Troubleshooting Guide - Laravel Components

## Issue: "View [layouts.app] not found"

### ✅ **Solution Applied:**
Created the missing layout file at `resources/views/layouts/app.blade.php`

### **What was created:**
- Complete HTML layout with proper meta tags
- CSRF token meta tag for AJAX requests
- FontAwesome and Tailwind CSS CDN links
- Custom CSS styles for email components
- Navigation with proper routes
- Content and scripts sections

## Issue: Component Classes Not Found

### ✅ **Solution Applied:**
All component classes have been created in `app/View/Components/MailBuilder/`:

- `Main.php`
- `Header.php`
- `Sidebar.php`
- `Toolbar.php`
- `Canvas.php`
- `PropertiesPanel.php`
- `Notification.php`
- `ComponentItem.php`
- `ComponentCategory.php`
- `Modals/NewTemplateModal.php`
- `Modals/LoadModal.php`
- `Modals/CodeModal.php`

## Issue: Service Provider Not Registered

### ✅ **Solution Applied:**
Added `ComponentServiceProvider` to `bootstrap/providers.php`

## Testing the Setup

### **Test Route Added:**
Visit `/test-components` to test the component structure

### **Expected Behavior:**
1. Page should load without errors
2. Mail template builder interface should appear
3. All components should render properly
4. JavaScript should load and function correctly

## Common Issues and Solutions

### 1. **Component Not Found Error**
```
Error: Class "App\View\Components\MailBuilder\SomeComponent" not found
```

**Solution:**
- Check if the component class exists in `app/View/Components/MailBuilder/`
- Ensure the class name matches the file name exactly
- Run `php artisan config:clear` and `php artisan view:clear`

### 2. **Blade Component Not Registered**
```
Error: View [components.mail-builder.some-component] not found
```

**Solution:**
- Check if the Blade template exists in `resources/views/components/mail-builder/`
- Ensure the component is registered in `ComponentServiceProvider`
- Run `php artisan view:clear`

### 3. **Route Not Found**
```
Error: Route [some.route] not defined
```

**Solution:**
- Check if the route exists in `routes/web.php`
- Run `php artisan route:clear`
- Use `php artisan route:list` to see all available routes

### 4. **JavaScript Module Errors**
```
Error: Failed to load module
```

**Solution:**
- Check if all JavaScript files exist in `public/js/`
- Ensure the `type="module"` attribute is present
- Check browser console for specific module errors

## File Structure Verification

Ensure these files exist:

```
resources/views/
├── layouts/
│   └── app.blade.php ✅
├── components/mail-builder/
│   ├── main.blade.php ✅
│   ├── header.blade.php ✅
│   ├── sidebar.blade.php ✅
│   ├── toolbar.blade.php ✅
│   ├── canvas.blade.php ✅
│   ├── properties-panel.blade.php ✅
│   ├── notification.blade.php ✅
│   ├── component-item.blade.php ✅
│   ├── component-category.blade.php ✅
│   └── modals/
│       ├── new-template-modal.blade.php ✅
│       ├── load-modal.blade.php ✅
│       └── code-modal.blade.php ✅
└── mail-template/
    └── builder.blade.php ✅

app/View/Components/MailBuilder/
├── Main.php ✅
├── Header.php ✅
├── Sidebar.php ✅
├── Toolbar.php ✅
├── Canvas.php ✅
├── PropertiesPanel.php ✅
├── Notification.php ✅
├── ComponentItem.php ✅
├── ComponentCategory.php ✅
└── Modals/
    ├── NewTemplateModal.php ✅
    ├── LoadModal.php ✅
    └── CodeModal.php ✅

app/Providers/
└── ComponentServiceProvider.php ✅

bootstrap/
└── providers.php ✅ (updated)

routes/
└── web.php ✅ (updated)
```

## Commands to Run

If you encounter issues, run these commands in order:

```bash
# Clear all caches
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Regenerate autoload files
composer dump-autoload

# Check if routes are working
php artisan route:list

# Check if components are registered
php artisan view:clear
```

## Browser Testing

1. **Open Developer Tools** (F12)
2. **Check Console** for JavaScript errors
3. **Check Network** tab for failed requests
4. **Check Elements** tab for proper HTML structure

## Expected Console Output

When everything is working correctly, you should see:
- No JavaScript errors
- All modules loading successfully
- CSRF token being found
- Components initializing properly

## Next Steps

If the component structure is working:

1. **Test the mail template builder functionality**
2. **Verify drag and drop works**
3. **Test component addition**
4. **Test template saving/loading**
5. **Test all modal functionality**

## Support

If you continue to have issues:

1. Check the browser console for specific error messages
2. Verify all files exist in the correct locations
3. Ensure Laravel version compatibility
4. Check PHP version requirements
5. Review the `LARAVEL_COMPONENTS_GUIDE.md` for detailed documentation 