# 🔧 Mail Template Builder - Save Issue Debugging Guide

## Current Status
- ✅ Server running on http://127.0.0.1:9087
- ✅ Routes registered correctly  
- ✅ Controller has error handling
- ❓ Save request failing - need to identify cause

## Step-by-Step Debugging

### 1. **Test API Endpoints**
Visit: `http://127.0.0.1:9087/test-api.html`

This test page will:
- Check CSRF token availability
- Test save endpoint with proper headers
- Show detailed error responses
- Log everything to browser console

### 2. **Check Browser Developer Tools**
1. Open http://127.0.0.1:9087/mail-template
2. Press F12 to open DevTools
3. Go to Console tab
4. Try to save a template
5. Look for any JavaScript errors or network failures

### 3. **Common Issues & Solutions**

#### **Issue A: CSRF Token Missing**
**Symptoms:** 419 error, "CSRF token mismatch"
**Solution:** 
- Refresh the page
- Check meta tag exists: `<meta name="csrf-token" content="...">`

#### **Issue B: JavaScript File Not Loading**
**Symptoms:** Save button does nothing, no console logs
**Solution:**
- Check if `public/js/mail-template-builder.js` exists
- Verify file permissions
- Clear browser cache (Ctrl+F5)

#### **Issue C: JSON Payload Issues**
**Symptoms:** 422 validation error
**Solution:**
- Template name is required
- HTML content must exist
- Check console for actual payload sent

#### **Issue D: Server Errors**
**Symptoms:** 500 internal server error
**Solution:**
- Check Laravel logs: `storage/logs/laravel.log`
- Verify storage directory permissions
- Check PHP error logs

### 4. **Quick Fixes to Try**

#### **Fix 1: Clear All Caches**
```bash
php artisan config:clear
php artisan route:clear  
php artisan view:clear
php artisan cache:clear
```

#### **Fix 2: Verify File Permissions**
- Ensure `storage/` directory is writable
- Ensure `public/js/` directory contains the JS file

#### **Fix 3: Browser Cache**
- Hard refresh: Ctrl+F5
- Clear browser cache completely
- Try in incognito/private mode

### 5. **Manual Test (Alternative)**

If the main interface isn't working, you can test the save function manually:

```javascript
// Open browser console on http://127.0.0.1:9087/mail-template
// Paste this code to test save function:

const testSave = async () => {
    const token = document.querySelector('meta[name="csrf-token"]').content;
    const response = await fetch('/mail-template/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: 'Manual Test',
            html: '<div>Test content</div>',
            css: 'body { font-family: Arial; }'
        })
    });
    
    const result = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', result);
};

testSave();
```

### 6. **Expected Working Flow**

When everything works correctly:
1. Page loads with CSRF token in meta tag
2. JavaScript file loads and initializes
3. Save button click triggers `saveTemplate()` function
4. AJAX request sent to `/mail-template/save` with proper headers
5. Server validates and saves template
6. Success notification shows
7. Template appears in load modal

### 7. **Log Files to Check**

- Browser Console (F12 → Console)
- Network tab (F12 → Network) - check failed requests
- Laravel logs: `storage/logs/laravel.log`
- PHP error logs (location varies by server setup)

### 8. **Contact Points**

If still having issues, provide:
- Browser console errors (screenshots)
- Network request details from DevTools
- Laravel log entries
- Exact error messages displayed

---

## Quick Test Checklist

- [ ] Server running on port 9087
- [ ] Can access http://127.0.0.1:9087/mail-template 
- [ ] Page loads without JavaScript errors
- [ ] CSRF token visible in page source
- [ ] JavaScript file loads (check Network tab)
- [ ] Save button responds to clicks
- [ ] Test API page works: http://127.0.0.1:9087/test-api.html 