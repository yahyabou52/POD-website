# Quick Start Guide - Simple Placement Customizer

## For Users

### Step 1: Select Your Product
1. When you open the customizer, the Product Wizard appears
2. Choose your product type (T-shirt, Hoodie, Cap, Mug)
3. Select fit type (Regular/Oversize) if applicable
4. Choose sleeve type (Short/Full) if applicable
5. Pick your color
6. Select your size
7. Choose which side to customize (Front/Back/Sleeves)
8. Click "Continue" or "Start Customizing"

### Step 2: Upload Your Design
1. Look for the "Upload Design" section in the left panel
2. Either:
   - **Drag & drop** your image onto the upload area
   - **Click** the upload area to browse files
3. Supported formats: PNG, JPG, SVG (max 10MB)
4. Your design will appear in a preview thumbnail

### Step 3: Choose Placement
1. Scroll down to "Select Placement"
2. Click on one of the placement options:
   - **Small Logo (Top Left)** - Perfect for chest logos
   - **Small Logo (Top Right)** - Alternative chest position
   - **Medium Logo (Center Top)** - Larger chest design
   - **Full Width (Center)** - Big center design
   - **Full Print Area (Back only)** - Large back print
3. You'll see a blue outline on the canvas showing where your design will be

### Step 4: Adjust Size
1. Use the **Scale** slider
2. Drag left for smaller (0.5x = 50% size)
3. Drag right for larger (1.5x = 150% size)
4. Current scale shows above the slider (e.g., "1.2x")

### Step 5: Customize Product
- **Change Side**: Click Front, Back, Left Sleeve, or Right Sleeve buttons
- **Change Color**: Click on color swatches
- **Change Size**: Click on size buttons (XS, S, M, L, XL, XXL)

### Step 6: Generate Preview
1. Click the **"Generate Preview"** button (must have design + placement)
2. A modal will pop up showing your final design on the product
3. Review how it looks

### Step 7: Download or Order
- Click **"Download Preview"** to save the image
- OR continue to add to cart (future feature)

## For Developers

### Quick Integration

#### 1. Import Components
```tsx
import SimplePlacementCanvas from '@/components/customizer/SimplePlacementCanvas'
import SimplePlacementPanel from '@/components/customizer/SimplePlacementPanel'
import SimplePreviewModal from '@/components/customizer/SimplePreviewModal'
import { getAvailablePlacements } from '@/config/placements'
```

#### 2. Setup State
```tsx
const [productId, setProductId] = useState('tshirt-regular-short')
const [currentSide, setCurrentSide] = useState<ProductSide>('front')
const [designImage, setDesignImage] = useState<string | null>(null)
const [selectedPlacement, setSelectedPlacement] = useState<PlacementId | null>('center-full')
const [scale, setScale] = useState(1)
const canvasRef = useRef<HTMLCanvasElement | null>(null)
```

#### 3. Render Components
```tsx
<SimplePlacementPanel
  productId={productId}
  currentSide={currentSide}
  selectedColor={selectedColor}
  selectedSize={selectedSize}
  designImage={designImage}
  selectedPlacement={selectedPlacement}
  scale={scale}
  onSideChange={setCurrentSide}
  onColorChange={setSelectedColor}
  onSizeChange={setSelectedSize}
  onImageUpload={setDesignImage}
  onPlacementChange={setSelectedPlacement}
  onScaleChange={setScale}
  onGeneratePreview={handleGeneratePreview}
  onChangeProduct={() => setShowWizard(true)}
/>

<SimplePlacementCanvas
  productId={productId}
  currentSide={currentSide}
  selectedColor={selectedColor}
  designImage={designImage}
  placement={
    selectedPlacement
      ? getAvailablePlacements(currentSide)[selectedPlacement]
      : null
  }
  scale={scale}
  onCanvasReady={(canvas) => canvasRef.current = canvas}
/>
```

#### 4. Generate Preview
```tsx
const handleGeneratePreview = () => {
  if (!canvasRef.current || !designImage || !selectedPlacement) return
  
  const previewImage = canvasRef.current.toDataURL('image/png')
  
  const previewData: PreviewData = {
    preview: previewImage,
    design: {
      image: designImage,
      placement: selectedPlacement,
      scale,
      side: currentSide,
      color: selectedColor,
      size: selectedSize,
      productId,
    },
    timestamp: Date.now(),
  }
  
  setPreviewData(previewData)
  setShowPreview(true)
}
```

#### 5. Add to Cart (Example)
```tsx
const handleAddToCart = (previewData: PreviewData) => {
  const cartItem = {
    id: `${Date.now()}`,
    productId: previewData.design.productId,
    name: PRODUCT_TEMPLATES[previewData.design.productId].name,
    color: previewData.design.color,
    size: previewData.design.size,
    price: PRODUCT_TEMPLATES[previewData.design.productId].basePrice,
    quantity: 1,
    customization: {
      side: previewData.design.side,
      placement: previewData.design.placement,
      scale: previewData.design.scale,
      designImage: previewData.design.image,
      previewImage: previewData.preview,
    },
  }
  
  addToCart(cartItem) // Your cart function
}
```

### Adding Custom Placements

Edit `src/config/placements.ts`:

```typescript
export const PLACEMENTS: Record<ProductSide, Record<string, PlacementConfig>> = {
  front: {
    // ... existing placements
    'pocket': {
      x: 100,
      y: 250,
      size: 80,
      label: 'Pocket Logo',
    },
  },
}
```

### Customizing Mockup Images

In `src/config/productTemplates.ts`, update color mockups:

```typescript
colors: [
  {
    name: 'White',
    hex: '#FFFFFF',
    image: '/templates/tshirt-white.svg',
    mockups: {
      front: 'https://your-cdn.com/tshirt-white-front.jpg',
      back: 'https://your-cdn.com/tshirt-white-back.jpg',
    }
  },
]
```

## Troubleshooting

### Design Not Showing
- ✅ Check if image uploaded successfully
- ✅ Verify placement is selected
- ✅ Ensure product side matches placement (e.g., back-full only works on back)
- ✅ Check browser console for errors

### Preview Button Disabled
- ✅ Upload a design image first
- ✅ Select a placement option
- Both are required before generating preview

### Download Not Working
- ✅ Generate preview first
- ✅ Check browser download settings
- ✅ Allow pop-ups if blocked

### Canvas Shows Placeholder
- ✅ Mockup images may not be loaded
- ✅ Check network tab for 404 errors
- ✅ Update mockup URLs in productTemplates.ts

### Image Quality Issues
- ✅ Upload higher resolution images
- ✅ Use PNG for transparent backgrounds
- ✅ Avoid overly scaled images (>1.5x)

## Best Practices

### For Users
1. **Upload high-quality images** (300+ DPI recommended)
2. **Use PNG** for designs with transparent backgrounds
3. **Start with center placement** to see full design
4. **Adjust scale** before generating final preview
5. **Try different colors** to see which looks best

### For Developers
1. **Validate images** before upload (size, format)
2. **Cache canvas renders** when possible
3. **Handle errors gracefully** (show user-friendly messages)
4. **Optimize mockup images** (compress, use CDN)
5. **Test on real devices** (mobile, tablet, desktop)

## Performance Tips

- **Lazy load** mockup images
- **Debounce** scale slider updates
- **Compress** uploaded images client-side
- **Cache** canvas data URLs
- **Use Web Workers** for heavy image processing (future)

## Accessibility

- All buttons have text labels
- Color contrast meets WCAG AA standards
- Keyboard navigation supported
- Screen reader friendly (ARIA labels)
- Focus states clearly visible

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Keyboard Shortcuts

Currently none, but could add:
- `Ctrl+U` - Upload image
- `Ctrl+G` - Generate preview
- `Ctrl+D` - Download preview
- `1-4` - Select placement 1-4
- `+/-` - Adjust scale

## Mobile Experience

- Touch-friendly buttons (44×44px minimum)
- Responsive layout (stacks on mobile)
- Drag & drop works on mobile browsers
- Optimized canvas rendering
- Full-screen preview modal

## What's Next?

See `SIMPLE_PLACEMENT_V1.md` for:
- Architecture details
- API documentation
- Future enhancements
- Testing checklist
