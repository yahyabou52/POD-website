# Customizer Page Audit Report

**Generated:** 2025-12-04  
**Status:** Simple Placement Flow (Active)  
**Architecture:** Component-based with local state management

---

## Executive Summary

The Customizer page is currently implementing a **simplified placement-based design workflow**. The page uses a modal wizard for product selection, a single-design upload system with preset placement zones, and a preview modal for mockup generation. The implementation is functional but limited in scope compared to the multi-design canvas system that exists in unused components.

**Current State:** ✅ Working  
**Feature Completeness:** ~40% (Simple flow only)  
**Code Quality:** Good (clean, typed, modular)  
**Technical Debt:** Medium (duplicate components, two store implementations)

---

## A. File Map

### Active Files (Currently Used)

| File Path | Purpose | Status |
|-----------|---------|--------|
| `src/pages/Customizer.tsx` | Main page component with wizard and placement flow | ✅ Active |
| `src/components/customizer/ProductWizard.tsx` | Multi-step product selection modal | ✅ Active |
| `src/components/customizer/SimplePlacementCanvas.tsx` | Canvas for rendering mockup + design | ✅ Active |
| `src/components/customizer/SimplePlacementPanel.tsx` | Left sidebar with upload/controls | ✅ Active |
| `src/components/customizer/SimplePreviewModal.tsx` | Preview modal for design output | ✅ Active |
| `src/config/productTemplates.ts` | Product definitions (12 products) | ✅ Active |
| `src/config/printAreas.ts` | Print zone coordinates by product/side | ✅ Active |
| `src/config/placements.ts` | TypeScript types for design data | ✅ Active |
| `src/types/customizer.ts` | Core TypeScript interfaces | ✅ Active |
| `src/utils/canvasHelpers.ts` | Image resize utilities | ✅ Active |
| `src/utils/printAreaEditor.tsx` | Dev-mode print area editor tool | ✅ Active (dev only) |
| `src/store/cart.ts` | Shopping cart Zustand store | ✅ Active |

### Inactive Files (Exist but Not Used)

| File Path | Purpose | Why Unused |
|-----------|---------|------------|
| `src/store/customizer.ts` | Full-featured Zustand store with undo/redo | Not imported by Customizer.tsx |
| `src/store/customizerStore.ts` | Alternative Fabric.js-based store | Orphaned |
| `src/components/customizer/ProductCanvas.tsx` | Multi-design canvas with drag/drop | Replaced by SimplePlacementCanvas |
| `src/components/customizer/CustomizerPanel.tsx` | Full control panel | Not used in simple flow |
| `src/components/customizer/EnhancedProductCanvas.tsx` | Enhanced canvas variant | Not integrated |
| `src/components/customizer/PreviewModal.tsx` | Alternative preview modal | Not used (SimplePreviewModal is active) |
| `src/components/customizer/ControlPanel*.tsx` | Multiple control panel variants (5 files) | Legacy/experimental |
| `src/components/customizer/ProductSelector.tsx` | Alternative product picker | Replaced by ProductWizard |

**Total Files:** 12 active, 10+ inactive  
**Code Duplication:** High (multiple versions of same components)

---

## B. Component Inventory

### 1. `Customizer.tsx` (Main Page)

**Exported Component:** `CustomizerPage` (default export)  
**Internal Component:** `Customizer` (wrapped in ErrorBoundary)

**Props:** None (page component)

**Internal State:**
```typescript
const [showWizard, setShowWizard] = useState(true)
const [showChangeProduct, setShowChangeProduct] = useState(false)
const [showPreview, setShowPreview] = useState(false)
const [previewData, setPreviewData] = useState<PreviewData | null>(null)
const [editorMode, setEditorMode] = useState(false)
const [mockupDimensions, setMockupDimensions] = useState({ width: 800, height: 1000 })

// Product configuration
const [productId, setProductId] = useState<string>('tshirt-regular-short')
const [currentSide, setCurrentSide] = useState<ProductSide>('front')
const [selectedColor, setSelectedColor] = useState('White')
const [selectedSize, setSelectedSize] = useState('M')

// Design state
const [designImage, setDesignImage] = useState<string | null>(null)
const [selectedPlacement, setSelectedPlacement] = useState<string | null>(null)
const [scale, setScale] = useState(1)
```

**Side Effects:**
- None (pure render + event handlers)

**Key Behaviors:**
- Shows `ProductWizard` on mount (`showWizard` = true initially)
- After wizard completion, renders placement canvas + panel
- Generates preview by calling `canvas.toDataURL()` when user clicks "Generate Preview"
- Logs order data to console (not saved to cart yet)

---

### 2. `ProductWizard.tsx`

**Props:**
```typescript
interface ProductWizardProps {
  onComplete: (selection: ProductSelection) => void
  onCancel?: () => void
}
```

**Internal State:**
```typescript
const [currentStep, setCurrentStep] = useState(1)
const [selection, setSelection] = useState<ProductSelection>({})
```

**Total Steps:** 2-4 (dynamic based on product type)
- T-shirt: 4 steps (type → fit → sleeve → color/size)
- Hoodie: 3 steps (type → fit → color/size)
- Cap/Mug: 3 steps (type → subtype → color/size)

**Side Effects:** None

**Validation:** Uses `canProceed()` to check if current step is complete before allowing "Next"

---

### 3. `SimplePlacementCanvas.tsx`

**Props:**
```typescript
interface SimplePlacementCanvasProps {
  productId: string
  currentSide: ProductSide
  selectedColor: string
  designImage: string | null
  selectedPlacement: string | null
  scale: number
  onCanvasReady?: (canvas: HTMLCanvasElement) => void
}
```

**Internal State:**
```typescript
const [mockupDimensions, setMockupDimensions] = useState({ width: 800, height: 1000 })
```

**Side Effects:**
- `useEffect` redraws canvas whenever props change
- Loads mockup image and design image asynchronously
- Calls `onCanvasReady(canvas)` after design is rendered

**Canvas Drawing Logic:**
1. Load mockup image (from color mockups or fallback)
2. Calculate aspect ratio and resize canvas
3. Draw mockup background
4. Calculate print area coordinates
5. Draw design centered within print area (scaled)
6. Apply aspect ratio preservation

**Print Area Overlay:**
- Shows dashed border when placement selected
- Shows blue guide when placement selected but no design

---

### 4. `SimplePlacementPanel.tsx`

**Props:**
```typescript
interface SimplePlacementPanelProps {
  productId: string
  currentSide: ProductSide
  selectedColor: string
  selectedSize: string
  designImage: string | null
  selectedPlacement: string | null
  scale: number
  onSideChange: (side: ProductSide) => void
  onColorChange: (color: string) => void
  onSizeChange: (size: string) => void
  onImageUpload: (image: string) => void
  onPlacementChange: (placement: string) => void
  onScaleChange: (scale: number) => void
  onGeneratePreview: () => void
  onChangeProduct: () => void
}
```

**Internal State:**
```typescript
const [isDragging, setIsDragging] = useState(false)
```

**Side Effects:**
- File upload with `FileReader` (converts to base64)
- Drag-and-drop file handling

**Sections:**
1. **Upload Design** - Drag/drop or file picker
2. **Select Placement** - Grid of placement buttons (varies by side)
3. **Scale Slider** - 0.3x to 1.0x
4. **Product Side** - Front/Back/Sleeves buttons
5. **Product Color** - Color swatches
6. **Product Size** - Size buttons (XS-XXL)
7. **Generate Preview** - Primary CTA button

**Validation:**
- "Generate Preview" button disabled if no design or no placement

---

### 5. `SimplePreviewModal.tsx`

**Props:**
```typescript
interface SimplePreviewModalProps {
  isOpen: boolean
  previewData: PreviewData | null
  onClose: () => void
}
```

**Features:**
- Shows full-size preview image
- Displays design metadata (placement, scale, side, color)
- Download button (creates `<a>` tag with download attribute)
- Click outside or X button to close

**Side Effects:**
- `AnimatePresence` animations (Framer Motion)
- Download creates temporary DOM element

---

## C. Store & State Shape

### Active Store: Local Component State (No Global Store Used)

**Location:** All state in `Customizer.tsx` component  
**Type:** React `useState` hooks

**State Shape:**
```typescript
{
  // UI State
  showWizard: boolean,
  showChangeProduct: boolean,
  showPreview: boolean,
  previewData: PreviewData | null,
  editorMode: boolean,
  mockupDimensions: { width: number, height: number },
  
  // Product Config
  productId: string,               // e.g., 'tshirt-regular-short'
  currentSide: ProductSide,        // 'front' | 'back' | ...
  selectedColor: string,           // 'White'
  selectedSize: string,            // 'M'
  
  // Design State
  designImage: string | null,      // base64 data URL
  selectedPlacement: string | null,// 'fullCenter' | 'topLeft' | ...
  scale: number                    // 0.3 - 1.0
}
```

**Actions:** Direct setter functions from `useState`

### Unused Stores

#### 1. `src/store/customizer.ts` (Zustand - Multi-Design)

**State Shape:**
```typescript
interface CustomizerStore {
  productId: string
  productType: ProductType
  currentSide: ProductSide
  selectedColor: string
  selectedSize: string
  designs: Record<ProductSide, DesignElement[]>  // Multiple designs per side
  selectedElementId: string | null
  gridEnabled: boolean
  snapToGrid: boolean
  zoom: number
  history: HistoryState[]
  historyIndex: number
}
```

**Actions:**
- `addDesign()`, `updateDesign()`, `deleteDesign()`
- `bringToFront()`, `sendToBack()`, `duplicateDesign()`
- `undo()`, `redo()`, `canUndo()`, `canRedo()`
- `moveToPreset()`, `copyDesignToSide()`
- `saveToHistory()`

**Why Unused:** This store supports full drag-drop-resize-rotate workflow, but current UI only uploads single design with preset placement.

#### 2. `src/store/customizerStore.ts` (Zustand - Fabric.js)

**State Shape:**
```typescript
interface CustomizerState {
  canvas: any  // Fabric.js canvas instance
  layers: Layer[]
  activeLayerId: string | null
  selectedProduct: string
  selectedColor: string
  selectedSize: string
  undoStack: any[]
  redoStack: any[]
}
```

**Why Unused:** Fabric.js-based implementation never integrated.

---

## D. Rendered UI & UX Behavior

### Initial Load

**What User Sees:**
1. Page title: "Create Your Design"
2. Badge: "Simple Placement Designer"
3. Full-screen modal: `ProductWizard`

**Modal Steps:**
- Step 1: Choose product type (T-Shirt, Hoodie, Cap, Mug)
- Step 2-3: Choose variants (fit, sleeve, etc.)
- Final Step: Choose color + size
- Bottom: Progress bar + "Back" / "Next" / "Start Designing" buttons

### After Wizard Completion

**Layout:** 2-column (desktop) / stacked (mobile)

**Left Panel (`SimplePlacementPanel`):**
- Header: Product emoji + name + side
- Upload zone (drag/drop or click)
- Placement buttons grid (2 columns)
- Scale slider (0.3x - 1.0x)
- Side buttons (Front, Back, etc.)
- Color swatches
- Size buttons
- "Generate Preview" button (primary)

**Center Canvas (`SimplePlacementCanvas`):**
- White rounded card with shadow
- Product mockup image (800x1000px max)
- Design image overlaid at selected placement
- Dashed border showing print area
- Blue guide when no design uploaded

**Footer:**
- Help text: "Upload design → Select placement → Adjust scale → Generate preview"

### Interactive Flows

#### 1. Upload Design
- User drags image or clicks "Choose File"
- File converted to base64
- Immediately rendered on canvas at selected placement
- Upload zone shows green border + thumbnail

#### 2. Change Placement
- User clicks placement button (e.g., "Full Center", "Top Left")
- Design instantly repositions to new zone
- Print area outline moves

#### 3. Adjust Scale
- User drags slider (0.3x - 1.0x)
- Design scales in real-time while maintaining aspect ratio
- Design stays within print area bounds

#### 4. Switch Side
- User clicks "Back" button
- Canvas redraws with back mockup
- Placement options change (e.g., back has "Full Back" instead of "Top Left")
- Design cleared (not saved per-side)

#### 5. Generate Preview
- User clicks "Generate Preview"
- Canvas rendered to PNG via `canvas.toDataURL()`
- Modal opens with:
  - High-quality preview image
  - Design metadata (placement, scale, side, color, size)
  - "Download" button
  - "Close" button
- Console logs order data (not added to cart)

### Missing Behaviors (Compared to Full Canvas System)

❌ **Multiple Designs:** Can only upload one design per side  
❌ **Drag & Drop Positioning:** Cannot manually drag design  
❌ **Resize Handles:** Cannot manually resize  
❌ **Rotation:** Cannot rotate design  
❌ **Layering:** Cannot manage z-index of multiple designs  
❌ **Text Elements:** No text support  
❌ **Undo/Redo:** No history  
❌ **Add to Cart:** Preview only, doesn't save to cart  
❌ **Multi-Side Workflow:** Switching sides clears design  
❌ **Design Library:** No pre-made graphics browser  
❌ **Toolbar:** No floating toolbar for selected design

---

## E. Bugs & Mismatches

### BUG-1: Side Switch Clears Design
**Severity:** High  
**File:** `Customizer.tsx` line 100  
**Issue:** When user switches from Front to Back, `designImage` state is not per-side, so design disappears  
**Expected:** Design should persist per side (save front design, switch to back, upload different design for back)  
**Fix:**
```typescript
// Change from single designImage to per-side
const [designs, setDesigns] = useState<Record<ProductSide, string | null>>({
  front: null,
  back: null,
  'left-sleeve': null,
  'right-sleeve': null,
  hood: null
})
```

### BUG-2: Placement Reset on Side Change
**Severity:** Medium  
**File:** `Customizer.tsx` line 103  
**Issue:** `handleSideChange` sets `selectedPlacement` to first available, even if user hasn't uploaded design for new side yet  
**Expected:** Placement should be null until design uploaded  
**Fix:** Check if design exists for new side before auto-selecting placement

### BUG-3: No Cart Integration
**Severity:** High  
**File:** `Customizer.tsx` line 131  
**Issue:** "Generate Preview" only logs to console, doesn't add to cart  
**Expected:** Should call `useCartStore().addItem()` with design data  
**Fix:**
```typescript
import { useCartStore } from '@/store/cart'

const handleAddToCart = () => {
  const cartStore = useCartStore.getState()
  cartStore.addItem({
    productId,
    productType: product.type,
    productName: product.name,
    size: selectedSize,
    color: selectedColor,
    quantity: 1,
    price: product.basePrice,
    customDesign: {
      imageUrl: designImage!,
      position: { x: printArea.x, y: printArea.y },
      scale,
      rotation: 0
    }
  })
}
```

### BUG-4: Dev Mode Editor Always Visible
**Severity:** Low  
**File:** `Customizer.tsx` line 164  
**Issue:** Print Area Editor button shows even in production if `import.meta.env.DEV` is true  
**Expected:** Should only show in local development  
**Fix:** Use `import.meta.env.MODE === 'development'` instead

### BUG-5: Scale Slider Range Too Limited
**Severity:** Low  
**File:** `SimplePlacementPanel.tsx` line 234  
**Issue:** Scale limited to 0.3x - 1.0x, but some designs may need smaller for large prints  
**Expected:** Allow down to 0.1x  
**Fix:** Change `min="0.3"` to `min="0.1"`

### BUG-6: No Image Size Validation
**Severity:** Medium  
**File:** `SimplePlacementPanel.tsx` line 79  
**Issue:** File size check is 10MB, but no minimum resolution check  
**Expected:** Warn if image < 300x300px (will print blurry)  
**Fix:** Add image dimension check after `FileReader.onload`

### BUG-7: Mockup Paths Hardcoded
**Severity:** Medium  
**File:** `productTemplates.ts` line 28  
**Issue:** Typo in black mockup path: `balck-front.png` (should be `black-front.png`)  
**Expected:** Correct spelling  
**Fix:** Find/replace `balck` → `black`

### BUG-8: No Loading States
**Severity:** Low  
**File:** `SimplePlacementCanvas.tsx`  
**Issue:** No spinner while mockup images load  
**Expected:** Show loading indicator  
**Fix:** Add `isLoading` state and conditional render

---

## F. Missing Features

### Present Features ✅
- [x] Product wizard (4 types, variants, colors, sizes)
- [x] Image upload (drag/drop + file picker)
- [x] Preset placement zones
- [x] Scale adjustment
- [x] Side switching (front/back/sleeves)
- [x] Color/size selection
- [x] Preview generation
- [x] Download preview
- [x] Print area visualization
- [x] Aspect ratio preservation
- [x] Dev mode print area editor

### Missing Features ❌

#### Critical (Blocks Production)
- [ ] **Add to Cart** - Preview generated but not saved
- [ ] **Multi-Side Persistence** - Design lost when switching sides
- [ ] **Order Payload** - No structured data for backend

#### High Priority
- [ ] **Multiple Designs** - Only supports one design per side
- [ ] **Manual Positioning** - Cannot drag design freely
- [ ] **Text Elements** - No text support
- [ ] **Undo/Redo** - No history
- [ ] **Design Library** - No pre-made graphics

#### Medium Priority
- [ ] **Resize Handles** - Cannot manually resize
- [ ] **Rotation** - Cannot rotate design
- [ ] **Layer Management** - Cannot adjust z-index
- [ ] **Copy to Other Sides** - Must re-upload for each side
- [ ] **Save Draft** - Cannot save work-in-progress

#### Low Priority
- [ ] **Keyboard Shortcuts** - No hotkeys
- [ ] **Grid Overlay** - No alignment guides
- [ ] **Zoom Controls** - Canvas fixed size
- [ ] **Real-Time Price** - No dynamic pricing
- [ ] **Accessibility** - Missing ARIA labels

---

## G. Data Contract & Output Payloads

### Current Payload (Console Log Only)

**When:** User clicks "Generate Preview"  
**Output:** Console log in `Customizer.tsx` line 133

```typescript
{
  preview: "data:image/png;base64,iVBORw0KGg...",  // Canvas PNG (truncated in log)
  design: {
    image: "data:image/png;base64,iVBORw0KGg...",  // Original upload
    placement: "fullCenter",                        // Placement ID
    scale: 0.75,                                    // Scale factor
    side: "front",                                  // Current side
    color: "White",                                 // Product color
    size: "M",                                      // Product size
    productId: "tshirt-regular-short"               // Product template ID
  },
  timestamp: 1733328000000
}
```

**Type Definition:** `PreviewData` in `src/config/placements.ts`

### Recommended Cart Payload

**Should Be Sent to `useCartStore().addItem()`:**

```json
{
  "productId": "tshirt-regular-short",
  "productType": "tshirt",
  "productName": "Regular Fit T-Shirt (Short Sleeve)",
  "size": "M",
  "color": "White",
  "quantity": 1,
  "price": 19.99,
  "customDesign": {
    "imageUrl": "data:image/png;base64,...",
    "placement": "fullCenter",
    "scale": 0.75,
    "side": "front",
    "position": { "x": 150, "y": 100 },
    "dimensions": { "width": 225, "height": 262 }
  },
  "preview": "data:image/png;base64,..."
}
```

**Type:** Matches `CartItem` interface in `src/store/cart.ts` (with `customDesign` optional field)

### Backend Order Payload (Future)

**For production order submission:**

```json
{
  "orderId": "ORD-2025-1234",
  "items": [
    {
      "productId": "tshirt-regular-short",
      "color": "White",
      "size": "M",
      "quantity": 1,
      "designs": [
        {
          "side": "front",
          "imageUrl": "https://cdn.example.com/designs/abc123.png",
          "placement": "fullCenter",
          "scale": 0.75,
          "printArea": {
            "x": 150,
            "y": 100,
            "width": 300,
            "height": 350
          }
        }
      ],
      "mockupUrl": "https://cdn.example.com/previews/xyz789.png"
    }
  ],
  "customer": { "name": "...", "email": "..." },
  "total": 19.99
}
```

---

## H. Print Area Configuration

### Location
**File:** `src/config/printAreas.ts`

### Schema

```typescript
interface PrintAreaPosition {
  x: number       // Top-left X coordinate (px)
  y: number       // Top-left Y coordinate (px)
  width: number   // Print zone width (px)
  height: number  // Print zone height (px)
}

interface ProductPrintAreas {
  [side: string]: {
    [placement: string]: PrintAreaPosition
  }
}

const PRINT_AREAS: Record<ProductType, ProductPrintAreas>
```

### Coordinate System
- **Origin:** Top-left corner of mockup image (0,0)
- **Units:** Pixels
- **Reference:** Coordinates are relative to mockup image dimensions (typically 800x1200px)

### Example Entry

```typescript
tshirt: {
  front: {
    topLeft: { x: 225, y: 360, width: 140, height: 115 },
    topRight: { x: 395, y: 360, width: 140, height: 115 },
    centerTop: { x: 290, y: 360, width: 180, height: 115 },
    fullCenter: { x: 217, y: 340, width: 325, height: 470 }
  },
  back: {
    fullBack: { x: 200, y: 340, width: 325, height: 470 }
  }
}
```

### Helper Functions

1. `getPrintArea(productType, side, placement)` → Returns print area coordinates or null
2. `getAvailablePlacementsForSide(productType, side)` → Returns array of placement IDs
3. `calculateFitDimensions(imageW, imageH, printArea)` → Fits image within area (aspect-preserved)
4. `scaleDesign(width, height, scaleFactor, printArea, min, max)` → Applies scale constraints
5. `getMockupPath(productType, color, side)` → Generates mockup file path

### Dev Tool

**Print Area Editor** (`src/utils/printAreaEditor.tsx`)
- Shows in dev mode when "Print Area Editor" button clicked
- Allows dragging/resizing print area box
- Displays live coordinates
- Copies JSON to clipboard
- Aspect ratio lock toggle

**Usage:** For adjusting print areas without manually editing JSON

---

## I. Test Suggestions

### Unit Tests

**File:** `tests/customizer/SimplePlacementCanvas.test.tsx`
- Test canvas renders with mockup image
- Test design renders at correct position
- Test aspect ratio preservation
- Test scale factor application
- Test print area boundary constraints

**File:** `tests/customizer/SimplePlacementPanel.test.tsx`
- Test file upload (base64 conversion)
- Test drag-and-drop file handling
- Test placement button selection
- Test scale slider updates
- Test "Generate Preview" button disabled state

**File:** `tests/config/printAreas.test.ts`
- Test `getPrintArea()` returns correct coordinates
- Test `calculateFitDimensions()` preserves aspect ratio
- Test `scaleDesign()` enforces min/max bounds

### Integration Tests

**File:** `tests/customizer/CustomizerFlow.test.tsx`
- Test wizard → canvas workflow
- Test product selection updates canvas
- Test design upload → placement → preview
- Test side switching
- Test color/size changes

**File:** `tests/customizer/CartIntegration.test.tsx`
- Test adding design to cart (when implemented)
- Test cart payload structure
- Test multiple items in cart

### E2E Tests (Playwright/Cypress)

**File:** `e2e/customizer-happy-path.spec.ts`
```typescript
test('Complete design workflow', async () => {
  // 1. Navigate to /customizer
  // 2. Complete product wizard (t-shirt, regular, short, white, M)
  // 3. Upload design image
  // 4. Select "Full Center" placement
  // 5. Adjust scale to 0.8
  // 6. Click "Generate Preview"
  // 7. Verify preview modal opens
  // 8. Click "Download"
  // 9. Verify file downloaded
  // 10. Close modal
  // 11. Click "Add to Cart" (when implemented)
  // 12. Verify cart count increments
})
```

**File:** `e2e/customizer-edge-cases.spec.ts`
```typescript
test('Upload invalid file type', async () => {
  // Upload .txt file → expect error message
})

test('Upload oversized file', async () => {
  // Upload 20MB image → expect error message
})

test('Switch sides without uploading', async () => {
  // Select back side → verify no crash, empty canvas
})
```

---

## J. Security & Performance Notes

### Security

✅ **No XSS Risk:** File upload converts to base64, not raw HTML  
✅ **CORS Safe:** Images use `crossOrigin = 'anonymous'`  
⚠️ **File Size Limit:** 10MB cap (good) but could DOS with many uploads  
⚠️ **No File Type Validation:** Accepts any `image/*` MIME type  
❌ **Base64 in LocalStorage:** If saved to localStorage, could exceed quota (5MB)

**Recommendations:**
1. Add server-side image validation
2. Use object URLs instead of base64 for large images
3. Implement rate limiting on uploads
4. Sanitize file names if storing

### Performance

⚠️ **Canvas Redraw:** Full redraw on every prop change (could optimize with dirty flags)  
⚠️ **Image Loading:** No image caching (re-downloads mockups on every render)  
⚠️ **Base64 Bloat:** Storing large images as base64 increases memory ~33%  
✅ **Lazy Loading:** Mockups loaded on-demand (not all at once)  
❌ **No Code Splitting:** All customizer components in main bundle

**Recommendations:**
1. Cache loaded images in-memory (use `useMemo` or global cache)
2. Lazy load customizer route (`React.lazy()`)
3. Use object URLs for uploaded files
4. Debounce scale slider updates
5. Add `loading="lazy"` to mockup images

### Large-Image Handling

**Current:** `resizeImageFile()` in `canvasHelpers.ts` resizes to max 2000px  
**Issue:** Runs client-side, blocks UI during resize  
**Fix:** Use Web Worker or offscreen canvas

---

## K. Acceptance Checklist

Use this checklist to verify page readiness:

### Core Functionality
- [x] Product wizard completes for all 4 product types
- [x] Image upload via drag/drop works
- [x] Image upload via file picker works
- [x] Placement selection renders design at correct position
- [x] Scale slider updates design size
- [x] Side switching changes mockup
- [x] Color selection works
- [x] Size selection works
- [x] Preview modal opens with correct image
- [x] Download preview works
- [ ] **Add to cart saves design data** ❌ NOT IMPLEMENTED

### Edge Cases
- [x] Empty state (no design uploaded) shows guide
- [ ] Invalid file type shows error ❌ NOT IMPLEMENTED
- [ ] Oversized file (>10MB) shows error ⚠️ PARTIALLY (size check exists, no UI feedback)
- [ ] Low-resolution warning (<300px) ❌ NOT IMPLEMENTED
- [x] Mockup load failure shows fallback
- [ ] Multi-side workflow preserves designs ❌ DESIGNS LOST ON SWITCH

### UX Polish
- [x] Responsive layout (mobile/desktop)
- [ ] Loading states during image processing ❌ NOT IMPLEMENTED
- [ ] Error messages (toast or inline) ⚠️ PARTIAL (alerts only)
- [ ] Keyboard shortcuts ❌ NOT IMPLEMENTED
- [ ] Accessibility (ARIA labels) ⚠️ MINIMAL
- [x] Animations (Framer Motion)

### Data Integrity
- [ ] Cart payload matches expected schema ❌ NO CART INTEGRATION
- [ ] Preview image quality sufficient (300 DPI) ⚠️ UNKNOWN (no DPI check)
- [ ] Design coordinates accurate for print ✅ YES (tested in dev editor)
- [ ] Color accuracy (sRGB color profile) ⚠️ UNKNOWN

### Performance
- [ ] Page loads <2s ⚠️ NOT MEASURED
- [ ] Image upload processes <1s for 5MB file ⚠️ NOT MEASURED
- [ ] Canvas redraws <100ms ⚠️ NOT MEASURED
- [ ] Preview generation <500ms ⚠️ NOT MEASURED

**Current Score:** 11/28 (39% complete)

---

## Summary

**Strengths:**
- Clean, typed codebase
- Modular component structure
- Simple, beginner-friendly UX
- Dev tools for print area editing

**Critical Issues:**
1. No cart integration (designs not saved)
2. Multi-side workflow broken (designs lost on switch)
3. Only supports single design (no multi-layer)

**Next Priority:**
1. Fix BUG-3 (add to cart)
2. Fix BUG-1 (per-side design persistence)
3. Add loading states
4. Implement error handling

**Recommendation:** Current implementation is a good MVP for simple use cases, but needs cart integration and multi-side persistence before production. Consider migrating to `src/store/customizer.ts` store for full multi-design support.
