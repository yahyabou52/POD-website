# Simple Placement Customizer - V1

## Overview
A simplified product customization system using fixed placement positions instead of manual drag/resize controls. This provides a faster, more user-friendly design experience.

## Features

### ✅ Fixed Placement System
- **Front Side Placements:**
  - `top-left` - Small logo (120×120px) at top left
  - `top-right` - Small logo (120×120px) at top right
  - `center-top` - Medium logo (200×200px) at center top
  - `center-full` - Full width (350×350px) centered

- **Back Side Placements:**
  - `back-full` - Full print area (350×350px)

### ✅ Scale Control
- Simple slider: 0.5x to 1.5x
- Applies to base placement size
- Real-time preview update

### ✅ Canvas Rendering
- HTML5 Canvas element
- Renders product mockup as background
- Overlays design at selected placement
- High-quality image rendering

### ✅ Preview Generation
- "Generate Preview" button
- Captures canvas using `canvas.toDataURL('image/png')`
- Shows modal with full preview
- Download button for PNG export

### ✅ Order Data Preparation
The system prepares complete order data including:
```typescript
{
  preview: string,        // base64 PNG of final mockup
  design: {
    image: string,        // base64 or URL of design
    placement: PlacementId,
    scale: number,
    side: ProductSide,
    color: string,
    size: string,
    productId: string
  },
  timestamp: number
}
```

## File Structure

```
src/
├── config/
│   └── placements.ts              # Placement configurations
├── components/customizer/
│   ├── SimplePlacementCanvas.tsx  # Canvas renderer
│   ├── SimplePlacementPanel.tsx   # Control panel
│   └── SimplePreviewModal.tsx     # Preview modal
└── pages/
    └── Customizer.tsx             # Main page (updated)
```

## Component Details

### 1. Placement Configuration (`placements.ts`)
```typescript
const PLACEMENTS: Record<ProductSide, Record<string, PlacementConfig>> = {
  front: {
    'top-left': { x: 50, y: 60, size: 120, label: 'Small Logo (Top Left)' },
    // ... more placements
  },
  back: {
    'back-full': { x: 125, y: 100, size: 350, label: 'Full Print Area' },
  },
}
```

### 2. SimplePlacementCanvas
- Props: productId, currentSide, selectedColor, designImage, placement, scale
- Uses HTML5 Canvas API
- Draws mockup background
- Overlays design at calculated position
- Exposes canvas via callback for preview generation

### 3. SimplePlacementPanel
- File upload with drag & drop
- Placement selector (radio-style buttons)
- Scale slider (0.5x - 1.5x)
- Product configuration (side, color, size)
- "Generate Preview" button
- Validates design + placement before preview

### 4. SimplePreviewModal
- Full-screen modal with preview image
- Shows design details (placement, scale, color, size)
- Download button
- Close button

## User Flow

1. **Product Selection**
   - ProductWizard modal opens
   - User selects product type, fit, color, size, side
   - Customizer loads with default placement

2. **Design Upload**
   - Drag & drop or click to upload image
   - Image displayed in upload area
   - PNG, JPG, SVG up to 10MB

3. **Placement Selection**
   - Radio buttons for available placements
   - Shows size and label for each option
   - Visual guide on canvas when placement selected

4. **Scale Adjustment**
   - Slider from 0.5x to 1.5x
   - Real-time preview on canvas
   - Shows current scale value

5. **Preview Generation**
   - Click "Generate Preview" button
   - Canvas captured as PNG
   - Modal displays full preview
   - Download option available

6. **Order Preparation**
   - All data logged to console
   - Ready for cart/checkout integration
   - Includes final PNG and design metadata

## Configuration

### Adding New Placements
Edit `src/config/placements.ts`:

```typescript
export const PLACEMENTS: Record<ProductSide, Record<string, PlacementConfig>> = {
  front: {
    'my-placement': {
      x: 100,           // X position in canvas
      y: 150,           // Y position in canvas
      size: 250,        // Base size (width & height)
      label: 'Custom Position',
    },
  },
}
```

### Adjusting Scale Range
In `SimplePlacementPanel.tsx`:
```tsx
<input
  type="range"
  min="0.5"    // Minimum scale
  max="1.5"    // Maximum scale
  step="0.1"   // Step increment
  value={scale}
  onChange={(e) => onScaleChange(parseFloat(e.target.value))}
/>
```

## Integration with Existing System

### Product Templates
- Uses existing `PRODUCT_TEMPLATES` from `productTemplates.ts`
- Reads `printAreas` for canvas dimensions
- Reads `colors` for color selection
- Reads `sizes` for size selection
- Reads mockup images from `views` or `colors.mockups`

### Product Wizard
- Reuses existing `ProductWizard` component
- Same product selection flow
- Returns `ProductSelection` object

## Browser Compatibility
- HTML5 Canvas API (all modern browsers)
- FileReader API for image upload
- Drag & Drop API
- Tested on Chrome, Firefox, Safari, Edge

## Performance
- Canvas renders on-demand (when props change)
- No continuous rendering or animation loops
- Image caching via browser
- Efficient base64 encoding

## Accessibility
- Keyboard navigation for placement selection
- ARIA labels for controls
- High contrast buttons
- Clear visual feedback

## Future Enhancements
- [ ] Text element support
- [ ] Multiple designs per side
- [ ] Design rotation
- [ ] Color filters/effects
- [ ] Template designs library
- [ ] Save/load custom designs
- [ ] Shopping cart integration
- [ ] Checkout flow

## API for Order Processing

When user generates preview, the system logs:
```javascript
console.log('📦 Order Data Ready:', {
  preview: previewImage,    // base64 PNG
  design: {
    image: designImage,     // base64 or URL
    placement: 'center-full',
    scale: 1.2,
    side: 'front',
    color: 'White',
    size: 'M',
    productId: 'tshirt-regular-short'
  }
})
```

This data can be sent to backend for order creation, stored in cart state, or used for checkout processing.

## Testing Checklist

- [x] Upload image (drag & drop)
- [x] Upload image (click to browse)
- [x] Select each placement option
- [x] Adjust scale slider
- [x] Change product side
- [x] Change product color
- [x] Change product size
- [x] Generate preview
- [x] Download preview PNG
- [x] Change product (reopen wizard)
- [x] Verify console logs order data
- [ ] Test with various image sizes
- [ ] Test with various image formats (PNG, JPG, SVG)
- [ ] Test on mobile devices
- [ ] Test download on different browsers

## Known Limitations

1. **Single Design per Side**: Currently supports one design per product side
2. **No Rotation**: Design cannot be rotated (always upright)
3. **Square Sizing**: All placements use square dimensions (width = height)
4. **No Text**: Text elements not yet supported
5. **No Layers**: Cannot stack multiple designs

## Migration from Old System

The old system used:
- Drag & drop positioning
- Manual resize handles
- Rotation controls
- Layer management (z-index)
- Undo/redo history
- Grid snapping

The new simplified system removes these features in favor of:
- Fixed placement positions
- Simple scale slider
- No rotation
- Single design per side
- No history (simpler state)

This makes the system much easier for users who just want to quickly add a design without complex controls.
