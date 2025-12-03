# 🎨 Product Customizer - Print Area System Documentation

## Overview

The customizer now uses a **robust print area system** that ensures:
- ✅ **No image distortion** - All mockups and designs maintain perfect aspect ratios
- ✅ **Pixel-perfect mockups** - Mockup images are never stretched or deformed
- ✅ **Centralized configuration** - All print areas defined in one config file
- ✅ **Easy extensibility** - Add new products by simply updating the config
- ✅ **Proper scaling** - Designs scale within limits while maintaining proportions

## File Structure

```
src/
├── config/
│   ├── printAreas.ts          # NEW: Print area configuration system
│   ├── placements.ts          # Updated: Design data types
│   └── productTemplates.ts    # Existing: Product configurations
├── components/customizer/
│   ├── SimplePlacementCanvas.tsx    # Updated: Aspect ratio preservation
│   └── SimplePlacementPanel.tsx     # Updated: Button-based placement UI
└── pages/
    └── Customizer.tsx         # Updated: New placement system integration

public/
└── mockups/
    └── hoodies/
        ├── white/
        │   ├── front.png
        │   └── back.png
        ├── black/
        │   ├── front.png
        │   └── back.png
        ├── grey/
        │   ├── front.png
        │   └── back.png
        └── blue/
            ├── front.png
            └── back.png
```

---

## 📐 Print Areas Configuration

### File: `src/config/printAreas.ts`

This is the **single source of truth** for all print area coordinates.

### Structure

```typescript
export const PRINT_AREAS: Record<ProductType, ProductPrintAreas> = {
  hoodie: {
    front: {
      topLeft: { x: 50, y: 80, width: 300, height: 300 },
      topRight: { x: 350, y: 80, width: 300, height: 300 },
      centerTop: { x: 150, y: 50, width: 450, height: 450 },
      fullCenter: { x: 100, y: 150, width: 600, height: 700 },
    },
    back: {
      fullBack: { x: 120, y: 100, width: 650, height: 750 },
    },
  },
  // ... more products
}
```

### Available Placements by Product

#### Hoodie
**Front:**
- `topLeft` - Small logo position (300×300px)
- `topRight` - Alternative small logo (300×300px)
- `centerTop` - Medium centered design (450×450px)
- `fullCenter` - Large full-front design (600×700px)

**Back:**
- `fullBack` - Full back print (650×750px)

**Hood/Sleeves:**
- `centered` - Centered design on hood or sleeve

#### T-Shirt
**Front:**
- `topLeft` - Chest logo left (250×250px)
- `topRight` - Chest logo right (250×250px)
- `centerTop` - Medium center (400×400px)
- `fullCenter` - Full front (500×600px)

**Back:**
- `fullBack` - Full back design (500×600px)

#### Cap
**Front/Back:**
- `centered` - Centered on front/back panel

#### Mug
**Front/Back:**
- `centered` - Centered wrap design (400×400px)

---

## 🖼️ Mockup System

### Mockup Requirements

1. **Location:** `/public/mockups/{productType}s/{color}/`
2. **Naming:** `front.png`, `back.png`, etc.
3. **Format:** PNG with transparency (if needed)
4. **Aspect Ratio:** Will be preserved - no stretching!

### Color Name Mapping

The system automatically maps product color names to folder names:

```typescript
const colorMap = {
  'White' → 'white',
  'Black' → 'black',
  'Gray' → 'grey',
  'Navy' → 'blue',
}
```

### Mockup Loading Priority

1. **Color-specific mockups** in product template (`colors[].mockups`)
2. **Generated path** from `/mockups/{product}s/{color}/{side}.png`
3. **Fallback** to `views[side].mockup` (Unsplash URLs)
4. **Final fallback** to gradient background with emoji

### Example Mockup Structure

```
public/mockups/
├── hoodies/
│   ├── white/
│   │   ├── front.png (original aspect ratio: 800×1000)
│   │   └── back.png
│   ├── black/
│   │   ├── front.png
│   │   └── back.png
│   └── grey/
│       ├── front.png
│       └── back.png
└── tshirts/
    ├── white/
    │   ├── front.png
    │   └── back.png
    └── black/
        ├── front.png
        └── back.png
```

---

## 🎯 Aspect Ratio Preservation

### Mockup Rendering

```typescript
// Canvas is sized to mockup's natural dimensions (up to max)
const maxWidth = 800
const maxHeight = 1000
const aspectRatio = mockupWidth / mockupHeight

// Scale down if too large, maintaining aspect ratio
if (mockupWidth > maxWidth || mockupHeight > maxHeight) {
  if (aspectRatio > maxWidth / maxHeight) {
    finalWidth = maxWidth
    finalHeight = maxWidth / aspectRatio
  } else {
    finalHeight = maxHeight
    finalWidth = maxHeight * aspectRatio
  }
}

// Draw at calculated dimensions - NO STRETCHING
ctx.drawImage(mockupImg, 0, 0, finalWidth, finalHeight)
```

### Design Rendering

```typescript
// Calculate fit dimensions maintaining aspect ratio
const aspectRatio = imageWidth / imageHeight
const printAspectRatio = printArea.width / printArea.height

if (aspectRatio > printAspectRatio) {
  // Image is wider - fit to width
  finalWidth = printArea.width
  finalHeight = finalWidth / aspectRatio
} else {
  // Image is taller - fit to height
  finalHeight = printArea.height
  finalWidth = finalHeight * aspectRatio
}

// Center within print area
const x = printArea.x + (printArea.width - finalWidth) / 2
const y = printArea.y + (printArea.height - finalHeight) / 2
```

---

## 🎛️ UI Components

### Placement Buttons

Replaced old radio-style list with clean icon buttons:

```tsx
<button className="px-3 py-2 rounded-xl border-2 transition-all flex items-center gap-2">
  <Icon className="w-4 h-4" />
  <span>Top Left</span>
</button>
```

**Icons used:**
- `AlignLeft` - Top Left
- `AlignRight` - Top Right
- `AlignCenter` - Center Top / Centered
- `Maximize2` - Full Center
- `Square` - Full Back

### Scale Slider

```tsx
<input
  type="range"
  min="0.5"
  max="1.5"
  step="0.1"
  value={scale}
  className="accent-royal"
/>
```

**Scale limits:**
- Minimum: 0.5x (50% of fit size)
- Maximum: 1.5x (150% of fit size, capped at print area max)

---

## 🔧 Helper Functions

### `getPrintArea(productType, side, placement)`
Returns print area coordinates for a specific placement.

### `getAvailablePlacementsForSide(productType, side)`
Returns array of available placement IDs for a product side.

### `calculateFitDimensions(imgWidth, imgHeight, printArea)`
Calculates how to fit an image in a print area while maintaining aspect ratio.

### `scaleDesign(width, height, scaleFactor, printArea, min, max)`
Scales a design within min/max limits while preserving aspect ratio.

### `getMockupPath(productType, color, side)`
Generates the correct path to a mockup image.

---

## 📝 Adding New Products

### Step 1: Add Print Areas

Edit `src/config/printAreas.ts`:

```typescript
export const PRINT_AREAS: Record<ProductType, ProductPrintAreas> = {
  // ... existing products
  
  sweatshirt: {
    front: {
      topLeft: { x: 60, y: 90, width: 280, height: 280 },
      centerTop: { x: 140, y: 60, width: 480, height: 480 },
      fullCenter: { x: 110, y: 160, width: 620, height: 720 },
    },
    back: {
      fullBack: { x: 130, y: 110, width: 640, height: 740 },
    },
  },
}
```

### Step 2: Add Mockup Images

Create folder structure:

```
public/mockups/sweatshirts/
├── white/
│   ├── front.png
│   └── back.png
├── black/
│   ├── front.png
│   └── back.png
└── grey/
    ├── front.png
    └── back.png
```

### Step 3: Add Product Template

Edit `src/config/productTemplates.ts`:

```typescript
'sweatshirt-regular': {
  id: 'sweatshirt-regular',
  type: 'sweatshirt',
  name: 'Regular Fit Sweatshirt',
  // ... rest of config
}
```

### Step 4: Update Types (if needed)

Edit `src/types/customizer.ts`:

```typescript
export type ProductType = 'tshirt' | 'hoodie' | 'cap' | 'mug' | 'sweatshirt'
```

**That's it!** The system will automatically:
- Load mockups from the correct path
- Use the print areas you defined
- Show placement buttons based on available placements
- Maintain aspect ratios for everything

---

## 🧪 Testing Checklist

### Mockup Testing
- [ ] Mockup loads correctly for each color
- [ ] Mockup is not stretched or distorted
- [ ] Mockup aspect ratio is preserved
- [ ] Canvas resizes to fit mockup (up to max dimensions)

### Design Testing
- [ ] Design uploads successfully
- [ ] Design maintains aspect ratio in all placements
- [ ] Design is centered within print area
- [ ] Design never exceeds print area boundaries
- [ ] Scale slider works (0.5x to 1.5x)
- [ ] Scaled design stays within limits

### Placement Testing
- [ ] All placement buttons appear for front side
- [ ] Back side shows appropriate placements
- [ ] Clicking placement updates canvas immediately
- [ ] Print area outline matches placement
- [ ] Design repositions correctly when changing placement

### Preview Testing
- [ ] Generate Preview captures both mockup + design
- [ ] Downloaded PNG contains complete composition
- [ ] Preview maintains quality (no pixelation)

---

## 🚀 Performance Notes

- Mockup images are loaded asynchronously
- Canvas only redraws when props change
- Images are cached by the browser
- No continuous rendering loops
- Aspect ratio calculations are efficient

---

## 🐛 Troubleshooting

### Issue: Mockup not loading
**Check:**
1. File exists at `/public/mockups/{product}s/{color}/{side}.png`
2. Color name mapping is correct (Gray → grey, Navy → blue)
3. File name is lowercase (`front.png`, not `Front.png`)

### Issue: Design is distorted
**Check:**
1. `calculateFitDimensions()` is being used
2. Aspect ratio is preserved in draw call
3. Print area dimensions are reasonable

### Issue: Wrong placement coordinates
**Check:**
1. Print area config in `printAreas.ts`
2. Coordinates are relative to mockup image size
3. Print area fits within mockup boundaries

### Issue: Scale not working
**Check:**
1. Scale limits (0.5x - 1.5x)
2. Design doesn't exceed print area max
3. Aspect ratio maintained during scaling

---

## 🎓 Best Practices

1. **Always test mockups** with real product photos
2. **Measure print areas** carefully on mockup images
3. **Keep aspect ratios** - never distort images
4. **Use PNG format** for mockups (supports transparency)
5. **Optimize images** - compress but maintain quality
6. **Document coordinates** - comment print area measurements
7. **Test all colors** - ensure mockups exist for all variants
8. **Maintain consistency** - use similar placements across products

---

## 📊 Summary

### What Changed

✅ **New:** `printAreas.ts` - Centralized print area configuration  
✅ **Updated:** Canvas rendering with aspect ratio preservation  
✅ **Updated:** Button-based placement UI  
✅ **Updated:** Mockup loading system with smart fallbacks  
✅ **Improved:** Image scaling with proper limits  
✅ **Improved:** Design centering within print areas  

### Key Benefits

- 🎯 **No distortion** - Perfect aspect ratios always
- 📐 **Easy configuration** - All coordinates in one file
- 🔄 **Reusable** - Same system works for all products
- 🚀 **Extensible** - Add products by updating config
- 💪 **Robust** - Multiple fallback mechanisms
- 🎨 **Clean UI** - Modern button-based placement selection

The system is now **production-ready** and scales to any number of products! 🎉
