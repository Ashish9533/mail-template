# 🎉 Stickers & Advanced Repositioning Guide

## Overview
This guide covers the new **Sticker functionality**, **Image Upload with positioning**, and **Enhanced Drag & Drop Repositioning** features added to the Mail Template Builder.

## 🎨 Sticker Functionality

### What are Stickers?
Stickers are decorative emoji elements that you can add to your email templates to make them more visually appealing and engaging.

### How to Use Stickers

#### 1. Adding Stickers
1. Navigate to the **"Stickers & Fun"** section in the sidebar
2. Click on the main **Sticker** component to add a default party emoji (🎉)
3. Drag the sticker component to your desired location on the canvas

#### 2. Choosing Different Stickers
**From the Sidebar Gallery:**
- Browse the 4×4 grid of popular stickers below the main component
- Click any sticker to change the default selection
- The selected sticker will be highlighted with a blue ring

**From the Properties Panel:**
1. Select an existing sticker component
2. In the properties panel, you'll see a **6×6 sticker selector**
3. Click any sticker to instantly change it

#### 3. Free Positioning
**Drag to Position:**
- **Click and drag** any sticker to move it freely around the canvas
- **Snap to grid** if grid mode is enabled
- **Visual feedback** with opacity changes during drag
- **Boundary detection** keeps stickers within canvas limits

**Properties Panel Control:**
- **Top Position**: Set exact vertical position in pixels
- **Left Position**: Set exact horizontal position in pixels
- **Z-Index**: Control layering (1-20 scale)

#### 4. Available Stickers
**Celebration & Achievement:** 🎉 🎊 🏆 🎁 🎈 🎂
**Emotions & Reactions:** ❤️ 👍 ✨ 💯 ⭐ 🌟
**Business & Goals:** 🎯 💡 🚀 💎 ⚡ 🔥
**Fun & Seasonal:** 🦄 🌈 🍀 👑 🎵 ⚽

## 📸 Image Upload with Positioning

### What's New?
Upload your own images from your computer and position them freely anywhere on the email template.

### How to Use Image Upload

#### 1. Adding Image Upload Component
1. Navigate to the **"Content"** section in the sidebar
2. Click on the **Upload** component (green gradient with upload icon)
3. Drag it to your desired location on the canvas

#### 2. Uploading Your Image
**Click to Upload:**
- **Click directly** on the placeholder image
- **File browser** opens automatically
- **Select any image** from your computer (JPG, PNG, GIF, etc.)

**File Requirements:**
- **File types**: JPG, PNG, GIF, WebP, SVG
- **File size**: Maximum 5MB
- **Automatic validation** with error messages

#### 3. Positioning Your Image
**Free Dragging:**
- **Click and drag** any uploaded image to move it around
- **Real-time positioning** with smooth animations
- **Snap to grid** when grid mode is enabled
- **Boundary constraints** keep images within canvas

**Properties Panel:**
- **Image URL**: Direct URL input
- **Alt Text**: Accessibility description
- **Width/Height**: Size controls
- **Top/Left Position**: Exact pixel positioning
- **Border Radius**: Rounded corners
- **Z-Index**: Layer control

#### 4. Visual Features
**Upload Feedback:**
- **"Click to upload"** indicator on hover
- **Success animation** when image loads
- **Error handling** for invalid files
- **Progress feedback** during upload

**Hover Effects:**
- **Brightness increase** on hover
- **Scale animation** for better UX
- **Upload indicator** appears on hover

## 🔄 Enhanced Drag & Drop Repositioning

### What's New?
All components in your email template are now **draggable** and can be repositioned anywhere, including moving between different containers.

### How to Reposition Components

#### 1. Visual Indicators
- **Drag Handle**: Hover over any component to see the drag indicator (⋮⋮) in the top-right corner
- **Cursor Change**: Cursor changes to 'move' when hovering over draggable components
- **Hover Effects**: Components lift slightly when hovered

#### 2. Drag to Reposition
1. **Click and hold** any component
2. **Drag** it to your desired location
3. **Visual feedback** shows the component being moved

#### 3. Drop Zones
**Into Containers:**
- Drag over any droppable container (Container, Row, Column, Section, Grid)
- Container highlights with blue dashed border
- "📌 Drop here" indicator appears

**Between Components:**
- Drag between existing components
- Green insertion line shows exact placement
- Snap positioning with grid alignment (if enabled)

## 🎯 Key Features

### Sticker Features
- **24+ carefully selected emojis**
- **Free positioning** with drag and drop
- **Hover effects** with scaling and rotation
- **Real-time property editing**
- **Layering control** with Z-index
- **Size adjustment** capabilities
- **Grid snapping** support

### Image Upload Features
- **System file upload** from computer
- **File validation** (type and size)
- **Free positioning** with drag and drop
- **Real-time preview** and feedback
- **Click-to-upload** interface
- **Hover indicators** and animations
- **Full property control** (size, position, styling)

### Repositioning Features
- **Visual drag indicators**
- **Smart drop zone detection**
- **Auto-scroll** when dragging near edges
- **Container-to-container** movement
- **Insertion line guidance**
- **Undo/redo support**

## 💡 Pro Tips

### For Stickers
1. **Free Positioning**: Use drag to place stickers exactly where you want them
2. **Layer Management**: Use Z-index to layer stickers over or under other content
3. **Grid Alignment**: Enable grid mode for pixel-perfect positioning
4. **Strategic Placement**: Use stickers to guide attention to CTAs
5. **Size Coordination**: Keep sticker sizes consistent within sections

### For Image Upload
1. **File Optimization**: Compress images before upload for better performance
2. **Responsive Sizing**: Use percentage widths for mobile-friendly layouts
3. **Alt Text**: Always add descriptive alt text for accessibility
4. **Layer Control**: Use Z-index to position images behind or in front of text
5. **Quality Balance**: Balance image quality with file size

### For Repositioning
1. **Grid Alignment**: Enable grid and snap for pixel-perfect positioning
2. **Container Logic**: Use containers to group related components
3. **Visual Hierarchy**: Position important elements at the top
4. **Mobile Optimization**: Test repositioning in mobile view
5. **Undo/Redo**: Use Ctrl+Z to undo any repositioning mistakes

## 🔧 Technical Features

### Performance
- **Optimized emoji fonts** with no image loading for stickers
- **Base64 encoding** for uploaded images (stored in template)
- **Efficient drag operations** with minimal DOM manipulation
- **Memory management** with proper cleanup

### File Handling
- **Client-side validation** for file type and size
- **Base64 conversion** for template storage
- **Error handling** for corrupt or invalid files
- **Progress feedback** during upload

### Browser Support
- **All modern browsers** support these features
- **Touch gestures** work for repositioning on mobile
- **Fallback styles** for older browsers
- **Keyboard accessibility** maintained

### Integration
- **Stickers export** as standard HTML entities
- **Images export** as base64 data URLs
- **Positioning preserved** in template saves
- **Properties panel** updates in real-time
- **Full undo/redo support** for all operations

## 🚀 Advanced Workflows

### Creating Visual Impact
1. **Upload brand images** for headers and banners
2. **Position stickers** to highlight key information
3. **Layer elements** using Z-index for depth
4. **Use free positioning** for creative layouts
5. **Test on different devices**

### Template Organization
1. **Start with layout containers**
2. **Add and position images** for visual structure
3. **Place stickers** for emphasis and personality
4. **Fine-tune positions** using properties panel
5. **Save and test** your template

## 📱 Mobile Considerations

When using stickers and images on mobile:
- **Touch gestures** work for all dragging operations
- **Larger touch targets** for better accuracy
- **Responsive positioning** adapts to screen size
- **Zoom support** maintains positioning accuracy

## 🛡️ File Security & Limits

### Upload Restrictions
- **Maximum file size**: 5MB per image
- **Allowed formats**: JPG, PNG, GIF, WebP, SVG
- **Client-side validation** prevents invalid uploads
- **Error messages** guide users to proper formats

### Storage
- **Base64 encoding** stores images directly in templates
- **No server storage** required for images
- **Template portability** with embedded images
- **Export compatibility** with all email clients

---

**Need Help?** Check the main [MAIL_TEMPLATE_MANUAL.md](MAIL_TEMPLATE_MANUAL.md) for general usage. 