# Customizer Atomic TODO List

**Generated:** 2025-12-04  
**Purpose:** Small, independent, safe-to-implement tasks with explicit acceptance criteria

---

## Priority: CRITICAL (Production Blockers)

### T1: Implement Cart Integration
**Difficulty:** Small  
**Files:** `src/pages/Customizer.tsx`  
**Estimated Time:** 30 minutes

**Current State:**  
- "Generate Preview" only logs to console
- No `useCartStore` integration

**Implementation:**
```typescript
// Add import
import { useCartStore } from '@/store/cart'
import { useToast } from '@/components/ui/use-toast'

// Replace handleGeneratePreview with:
const handleAddToCart = () => {
  if (!canvasRef.current || !designImage || !selectedPlacement) {
    toast({ title: 'Missing design data', variant: 'destructive' })
    return
  }

  const previewImage = canvasRef.current.toDataURL('image/png')
  
  useCartStore.getState().addItem({
    productId,
    productType: product!.type,
    productName: product!.name,
    size: selectedSize,
    color: selectedColor,
    quantity: 1,
    price: product!.basePrice,
    customDesign: {
      imageUrl: designImage,
      position: { x: printArea.x, y: printArea.y },
      scale,
      rotation: 0
    },
    designUrl: previewImage
  })

  toast({
    title: '✅ Added to Cart',
    description: `${product!.name} (${selectedColor}, ${selectedSize})`
  })
  
  setShowPreview(true)
  setPreviewData({ preview: previewImage, design: {...}, timestamp: Date.now() })
}

// Update button text in SimplePlacementPanel from "Generate Preview" to "Add to Cart"
```

**Acceptance Criteria:**
- ✅ Clicking "Add to Cart" button adds item to `useCartStore`
- ✅ Cart icon in navbar shows updated item count
- ✅ Toast notification confirms "Added to Cart"
- ✅ Preview modal still opens after adding to cart
- ✅ Console.log removed (no longer needed)

**Testing:**
```typescript
test('adds design to cart', async () => {
  const { getState } = useCartStore
  // Complete wizard, upload design, select placement
  fireEvent.click(screen.getByText(/Add to Cart/))
  
  const cart = getState()
  expect(cart.items).toHaveLength(1)
  expect(cart.items[0]).toMatchObject({
    productId: 'tshirt-regular-short',
    customDesign: expect.objectContaining({
      placement: 'fullCenter'
    })
  })
})
```

---

### T2: Fix Per-Side Design Persistence
**Difficulty:** Small  
**Files:** `src/pages/Customizer.tsx`  
**Estimated Time:** 20 minutes

**Current State:**  
- Single `designImage` state shared across all sides
- Switching from Front to Back loses uploaded design

**Implementation:**
```typescript
// Replace single designImage state with per-side record:
const [designs, setDesigns] = useState<Record<ProductSide, {
  image: string | null
  placement: string | null
  scale: number
}>>({
  front: { image: null, placement: null, scale: 1 },
  back: { image: null, placement: null, scale: 1 },
  'left-sleeve': { image: null, placement: null, scale: 1 },
  'right-sleeve': { image: null, placement: null, scale: 1 },
  hood: { image: null, placement: null, scale: 1 }
})

// Update handlers:
const handleImageUpload = (image: string) => {
  setDesigns(prev => ({
    ...prev,
    [currentSide]: { ...prev[currentSide], image }
  }))
}

const handlePlacementChange = (placement: string) => {
  setDesigns(prev => ({
    ...prev,
    [currentSide]: { ...prev[currentSide], placement }
  }))
}

const handleScaleChange = (scale: number) => {
  setDesigns(prev => ({
    ...prev,
    [currentSide]: { ...prev[currentSide], scale }
  }))
}

// Update canvas props:
<SimplePlacementCanvas
  designImage={designs[currentSide].image}
  selectedPlacement={designs[currentSide].placement}
  scale={designs[currentSide].scale}
  ...
/>
```

**Acceptance Criteria:**
- ✅ Upload design on Front side
- ✅ Switch to Back side (front design persists)
- ✅ Upload different design on Back
- ✅ Switch back to Front (both designs preserved)
- ✅ Each side has independent placement + scale

**Testing:**
```typescript
test('preserves designs when switching sides', async () => {
  render(<Customizer />)
  // Upload on front
  uploadFile('front-design.png')
  expect(screen.getByAlt(/Design/)).toHaveAttribute('src', /front-design/)
  
  // Switch to back
  fireEvent.click(screen.getByText(/Back/))
  // Upload different design
  uploadFile('back-design.png')
  
  // Switch back to front
  fireEvent.click(screen.getByText(/Front/))
  // Verify front design still shows
  expect(screen.getByAlt(/Design/)).toHaveAttribute('src', /front-design/)
})
```

---

## Priority: HIGH (User-Facing Issues)

### T3: Fix Mockup Path Typo
**Difficulty:** Small  
**Files:** `src/config/productTemplates.ts`  
**Estimated Time:** 5 minutes

**Current State:**  
- Line 28: `balck-front.png` (typo)
- Line 35: `balck-front.png` (typo)

**Implementation:**
```bash
# Find and replace all occurrences:
balck → black
```

**Acceptance Criteria:**
- ✅ All mockup paths use correct spelling "black"
- ✅ Black mockups load without 404 errors
- ✅ No broken images in product wizard

---

### T4: Add Canvas Loading States
**Difficulty:** Small  
**Files:** `src/components/customizer/SimplePlacementCanvas.tsx`  
**Estimated Time:** 15 minutes

**Current State:**  
- Blank white canvas while mockup loads
- No visual feedback

**Implementation:**
```typescript
const [isLoading, setIsLoading] = useState(true)

// In mockup onload handler:
mockupImg.onload = () => {
  // ... existing code ...
  setIsLoading(false)
}

// In render:
{isLoading && (
  <div className="absolute inset-0 flex items-center justify-center bg-white z-20">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-sm text-gray-600 font-medium">Loading mockup...</p>
    </div>
  </div>
)}
```

**Acceptance Criteria:**
- ✅ Spinner shows while mockup image loading
- ✅ Spinner disappears when mockup rendered
- ✅ Spinner shows when switching products
- ✅ Design renders only after mockup loaded

---

## Priority: MEDIUM (UX Improvements)

### T5: Add Image Resolution Validation
**Difficulty:** Small  
**Files:** `src/components/customizer/SimplePlacementPanel.tsx`  
**Estimated Time:** 15 minutes

**Implementation:**
```typescript
const handleFileSelect = (files: FileList | null) => {
  if (!files || files.length === 0) return

  const file = files[0]
  if (!file.type.startsWith('image/')) {
    toast({
      title: 'Invalid file type',
      description: 'Please upload an image file (PNG, JPG, SVG)',
      variant: 'destructive'
    })
    return
  }

  if (file.size > 10 * 1024 * 1024) {
    toast({
      title: 'File too large',
      description: 'File size must be less than 10MB',
      variant: 'destructive'
    })
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    
    // Check resolution
    const img = new Image()
    img.onload = () => {
      const minDimension = 300
      if (img.naturalWidth < minDimension || img.naturalHeight < minDimension) {
        toast({
          title: '⚠️ Low Resolution',
          description: `Image is ${img.naturalWidth}x${img.naturalHeight}px. For best print quality, use images 300px or larger.`,
          variant: 'warning'
        })
      }
      onImageUpload(result)
    }
    img.src = result
  }
  reader.readAsDataURL(file)
}
```

**Acceptance Criteria:**
- ✅ Upload 200x200px image → warning toast shows
- ✅ Upload 500x500px image → no warning
- ✅ Warning doesn't block upload (informational only)
- ✅ Toast auto-dismisses after 5 seconds

---

### T6: Replace Alerts with Toast Notifications
**Difficulty:** Small  
**Files:** `src/components/customizer/SimplePlacementPanel.tsx`  
**Estimated Time:** 10 minutes

**Current State:**  
- Uses `alert()` for error messages (blocking, ugly)

**Implementation:**
```typescript
// Remove all alert() calls, replace with:
import { useToast } from '@/components/ui/use-toast'

const { toast } = useToast()

// Invalid file type:
toast({
  title: 'Invalid File',
  description: 'Please upload an image file',
  variant: 'destructive'
})

// Oversized file:
toast({
  title: 'File Too Large',
  description: 'Maximum file size is 10MB',
  variant: 'destructive'
})

// Missing design/placement:
toast({
  title: 'Missing Design',
  description: 'Please upload a design and select a placement first',
  variant: 'destructive'
})
```

**Acceptance Criteria:**
- ✅ No `alert()` calls remain
- ✅ All errors show as toast notifications
- ✅ Toasts auto-dismiss after 5 seconds
- ✅ Non-blocking UX

---

### T7: Fix Placement Auto-Select Logic
**Difficulty:** Small  
**Files:** `src/pages/Customizer.tsx`  
**Estimated Time:** 10 minutes

**Current State:**  
- Line 103: Auto-selects placement even when no design uploaded

**Implementation:**
```typescript
const handleSideChange = (side: ProductSide) => {
  setCurrentSide(side)
  
  // Only auto-select placement if design exists for new side
  if (designs[side].image) {
    const placements = getAvailablePlacementsForSide(product!.type, side)
    if (placements.length > 0 && !designs[side].placement) {
      setDesigns(prev => ({
        ...prev,
        [side]: { ...prev[side], placement: placements[0] }
      }))
    }
  }
}
```

**Acceptance Criteria:**
- ✅ Switch to Back (no design) → placement stays null
- ✅ Upload design on Back → first placement auto-selected
- ✅ Switch to Front with existing design → placement preserved

---

### T10: Add File Type Validation UI
**Difficulty:** Small  
**Files:** `src/components/customizer/SimplePlacementPanel.tsx`  
**Estimated Time:** 5 minutes

**Current State:**  
- File type check exists but shows generic alert

**Implementation:**
```typescript
if (!file.type.startsWith('image/')) {
  toast({
    title: '❌ Invalid File Type',
    description: `File type "${file.type}" is not supported. Please use PNG, JPG, or SVG.`,
    variant: 'destructive'
  })
  return
}
```

**Acceptance Criteria:**
- ✅ Upload .txt → specific error toast
- ✅ Upload .pdf → specific error toast
- ✅ Toast shows attempted file type
- ✅ Upload .png → no error

---

## Priority: LOW (Polish)

### T8: Extend Scale Slider Minimum
**Difficulty:** Small  
**Files:** `src/components/customizer/SimplePlacementPanel.tsx`  
**Estimated Time:** 5 minutes

**Current State:**  
- Scale slider min=0.3 (may be too large for some designs)

**Implementation:**
```typescript
// Line 234: Change min from 0.3 to 0.1
<input
  type="range"
  min="0.1"
  max="1.0"
  step="0.05"
  value={scale}
  onChange={(e) => onScaleChange(parseFloat(e.target.value))}
  className="w-full h-2 bg-mist rounded-lg appearance-none cursor-pointer accent-royal"
/>

// Update label text:
<div className="flex justify-between text-xs text-carbon">
  <span>0.1x (Min)</span>
  <span>0.55x (Med)</span>
  <span>1.0x (Max)</span>
</div>
```

**Acceptance Criteria:**
- ✅ Slider allows 0.1x - 1.0x range
- ✅ Label shows updated min value
- ✅ Design scales correctly at 0.1x

---

### T9: Hide Dev Editor in Production
**Difficulty:** Small  
**Files:** `src/pages/Customizer.tsx`  
**Estimated Time:** 5 minutes

**Current State:**  
- Dev editor button shows if `import.meta.env.DEV` is true

**Implementation:**
```typescript
// Line 164: Change condition
{isDevMode() && !showWizard && (
  <Button ... />
)}

// Update isDevMode() in printAreaEditor.tsx:
export function isDevMode(): boolean {
  return import.meta.env.MODE === 'development' && !import.meta.env.PROD
}
```

**Acceptance Criteria:**
- ✅ Button visible in `npm run dev`
- ✅ Button hidden in `npm run build` → `npm run preview`
- ✅ Button hidden in production deployment

---

## Implementation Order

**Week 1:**
1. T1 (Cart Integration) - CRITICAL
2. T2 (Per-Side Persistence) - CRITICAL
3. T3 (Mockup Path Typo) - HIGH

**Week 2:**
4. T4 (Loading States) - HIGH
5. T6 (Toast Notifications) - MEDIUM
6. T5 (Resolution Validation) - MEDIUM

**Week 3:**
7. T7 (Placement Auto-Select) - MEDIUM
8. T10 (File Type Validation) - MEDIUM
9. T8 (Scale Slider) - LOW
10. T9 (Dev Editor) - LOW

---

## Testing Checklist

After each task:
- [ ] Unit test passes
- [ ] Manual testing (happy path)
- [ ] Manual testing (edge cases)
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] No visual regressions
- [ ] Code reviewed

---

## Notes

- All tasks are designed to be completed independently (no dependencies)
- Each task has clear, measurable acceptance criteria
- Estimated times assume familiarity with codebase
- Tasks are prioritized by user impact (Critical → Low)
- No task requires architectural changes or major refactoring
