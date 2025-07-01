# 🎉 Stickers & Advanced Repositioning Guide

## Overview
This guide covers the new **Sticker functionality** and **Enhanced Drag & Drop Repositioning** features added to the Mail Template Builder. These features make your email templates more fun, engaging, and easier to manage.

## 🎨 Sticker Functionality

### What are Stickers?
Stickers are decorative emoji elements that you can add to your email templates to make them more visually appealing and engaging. They're perfect for:
- Celebrations and announcements
- Drawing attention to important content
- Adding personality to your emails
- Creating seasonal or themed templates

### How to Use Stickers

#### 1. **Adding Stickers**
1. Navigate to the **"Stickers & Fun"** section in the sidebar
2. Click on the main **Sticker** component to add a default party emoji (🎉)
3. Drag the sticker component to your desired location on the canvas

#### 2. **Choosing Different Stickers**
**From the Sidebar Gallery:**
- Browse the 4×4 grid of popular stickers below the main component
- Click any sticker to change the default selection
- The selected sticker will be highlighted with a blue ring
- Newly added stickers will use your selected emoji

**From the Properties Panel:**
1. Select an existing sticker component
2. In the properties panel, you'll see a **6×6 sticker selector**
3. Click any sticker to instantly change it
4. The selection updates in real-time

#### 3. **Available Stickers**
The builder includes 24+ carefully selected stickers:

**Celebration & Achievement:**
🎉 🎊 🏆 🎁 🎈 🎂

**Emotions & Reactions:**
❤️ 👍 ✨ 💯 ⭐ 🌟

**Business & Goals:**
🎯 💡 🚀 💎 ⚡ 🔥

**Fun & Seasonal:**
🦄 🌈 🍀 👑 🎵 ⚽

### 4. **Sticker Properties**

When you select a sticker, you can customize:
- **Sticker**: Choose from the emoji gallery
- **Font Size**: Adjust size (default: 48px)
- **Position**: Set positioning (relative, absolute, fixed)
- **Z-Index**: Control layering (1-20 scale)
- **Margin**: Adjust spacing around the sticker

### 5. **Visual Features**

**Hover Effects:**
- Stickers scale up and rotate slightly on hover
- Drop shadow appears for depth
- Smooth transitions for professional feel

**Animation:**
- New stickers get a subtle bounce animation
- Selected stickers in properties panel highlight
- Responsive visual feedback

## 🔄 Enhanced Drag & Drop Repositioning

### What's New?
All components in your email template are now **draggable** and can be repositioned anywhere, including moving between different containers.

### How to Reposition Components

#### 1. **Visual Indicators**
- **Drag Handle**: Hover over any component to see the drag indicator (⋮⋮) in the top-right corner
- **Cursor Change**: Cursor changes to 'move' when hovering over draggable components
- **Hover Effects**: Components lift slightly when hovered

#### 2. **Drag to Reposition**
1. **Click and hold** any component
2. **Drag** it to your desired location
3. **Visual feedback** shows the component being moved:
   - Component becomes semi-transparent
   - Slight rotation and scaling effect
   - "Drag to reposition component" notification appears

#### 3. **Drop Zones**
**Into Containers:**
- Drag over any droppable container (Container, Row, Column, Section, Grid)
- Container highlights with blue dashed border
- "📌 Drop here" indicator appears
- Release to place the component

**Between Components:**
- Drag between existing components
- Green insertion line shows exact placement
- Snap positioning with grid alignment (if enabled)

#### 4. **Smart Repositioning**
**Container to Container:**
- Move components between different containers
- Original container shows placeholder if becomes empty
- Target container hides placeholder when component added
- Automatic cleanup and state management

**Within Canvas:**
- Reorder components within the main canvas
- Insertion indicators show placement
- Snap to grid if enabled
- Auto-scroll when dragging near edges

### 5. **Enhanced Features**

#### **Auto-Scroll**
- Automatic scrolling when dragging near canvas edges
- 50px detection zones for smooth experience
- Multi-directional support (horizontal and vertical)
- 60fps smooth animation

#### **Visual Feedback**
- **Drop Zones**: Blue highlighting with pulse animation
- **Insertion Lines**: Green lines showing exact placement
- **Grid Guidelines**: Purple grid lines (when grid enabled)
- **Component State**: Visual feedback during drag operations

#### **Error Prevention**
- Prevents components from being dropped in invalid locations
- Safety checks for container compatibility
- Automatic rollback if move fails
- User-friendly error messages

## 🎯 Pro Tips

### Stickers
1. **Size Coordination**: Keep sticker sizes consistent within sections
2. **Strategic Placement**: Use stickers to guide attention to CTAs
3. **Seasonal Themes**: Change stickers based on holidays or events
4. **Brand Alignment**: Choose stickers that match your brand personality
5. **Accessibility**: Don't rely solely on stickers to convey important information

### Repositioning
1. **Grid Alignment**: Enable grid and snap for pixel-perfect positioning
2. **Container Logic**: Use containers to group related components
3. **Visual Hierarchy**: Position important elements at the top
4. **Mobile Optimization**: Test repositioning in mobile view
5. **Undo/Redo**: Use Ctrl+Z to undo any repositioning mistakes

## 🚀 Advanced Workflows

### Creating Interactive Layouts
1. Use **containers** to create sections
2. Add **stickers** for visual interest
3. **Reposition** components to perfect the flow
4. Use **grid mode** for precise alignment
5. **Preview** across different devices

### Template Organization
1. Start with a **container** structure
2. Add **content components** to each section
3. **Drag between containers** to reorganize
4. Add **stickers** as finishing touches
5. **Save** your perfected template

### Collaborative Design
1. Use **visual indicators** to understand layout
2. **Group related components** in containers
3. **Document your sticker choices** in template description
4. **Test repositioning** before finalizing
5. **Export** clean HTML for development

## 🔧 Technical Notes

### Performance
- Stickers are optimized emoji fonts (no image loading)
- Drag operations use efficient event handling
- Minimal DOM manipulation for smooth experience
- Automatic cleanup prevents memory leaks

### Browser Support
- All modern browsers support these features
- Fallback styles for older browsers
- Touch device support for mobile editing
- Keyboard accessibility maintained

### Integration
- Stickers export as standard HTML entities
- Repositioning preserved in template saves
- Properties panel updates in real-time
- Full undo/redo support for all operations

## 📱 Mobile Considerations

When using stickers and repositioning on mobile:
- Touch gestures work for repositioning
- Sticker selection optimized for touch
- Drop zones larger for finger accuracy
- Visual feedback adapted for small screens

## 🎨 Customization

### Extending Stickers
To add more stickers, update the `generateStickerOptions()` method in the JavaScript:

```javascript
const stickers = ['🎉', '✨', '🔥', '⭐', 'YOUR_NEW_STICKER'];
```

### Styling Stickers
Custom CSS classes available:
- `.email-sticker` - Base sticker styling
- `.email-sticker:hover` - Hover effects
- `.email-sticker.animate` - Animation class

## 🆘 Troubleshooting

### Common Issues

**Sticker not changing:**
- Make sure you've selected the sticker component first
- Check that you're clicking in the properties panel sticker grid

**Drag not working:**
- Ensure you're clicking directly on the component
- Try refreshing the page if drag events stop responding

**Components not dropping:**
- Make sure you're dropping in a valid droppable container
- Look for the blue highlighting that indicates valid drop zones

**Stickers too small/large:**
- Adjust the font size in the properties panel
- Use consistent sizing across your template

### Performance Tips
- Limit stickers to reasonable numbers (10-15 per template)
- Use repositioning sparingly during heavy editing
- Save frequently to preserve your work
- Clear browser cache if experiencing issues

---

**Need Help?** Check the main [MAIL_TEMPLATE_MANUAL.md](MAIL_TEMPLATE_MANUAL.md) for general usage or [debugging-guide.md](debugging-guide.md) for technical troubleshooting. 