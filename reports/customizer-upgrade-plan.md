# Customizer Upgrade Plan: Simple → Optimized Multi-Design UX

**Generated:** 2025-12-04  
**Goal:** Migrate from SimplePlacement flow to full multi-design canvas system  
**Timeline:** 3-4 weeks (15 tasks)  
**Approach:** Incremental, feature-flag driven, backwards-compatible

---

## Overview

This plan upgrades the Customizer from the current **SimplePlacement** architecture (single design, preset zones) to a **Multi-Design Canvas** architecture (drag/drop, multiple designs, full editing tools).

**Current State:**
- Single design upload per side
- Preset placement zones only
- No drag/resize/rotate
- No text elements
- No undo/redo
- Local component state

**Target State:**
- Multiple designs per side
- Free-form drag/drop positioning
- Resize handles + rotation
- Text element support
- Full undo/redo history
- Zustand global state
- Design library browser
- Advanced toolbar

---

## Task Breakdown

### Phase 1: Foundation (Week 1)

#### TASK 1: Migrate to Zustand Store
**Difficulty:** Medium  
**Files:**
- `src/pages/Customizer.tsx`
- `src/store/customizer.ts`

**Description:**  
Replace local `useState` in Customizer.tsx with `useCustomizerStore` hook.

**Steps:**
1. Import `useCustomizerStore` from `src/store/customizer.ts`
2. Replace all local state with store state:
   ```typescript
   // Before:
   const [productId, setProductId] = useState('tshirt-regular-short')
   
   // After:
   const { productId, setProductFromSelection } = useCustomizerStore()
   ```
3. Update all handlers to call store actions
4. Remove local state declarations
5. Test: Wizard → canvas flow still works

**Acceptance Criteria:**
- ✅ No local state in Customizer.tsx (except UI-only like `showWizard`)
- ✅ All product config in Zustand store
- ✅ State persists across re-renders
- ✅ No breaking changes to UI

**Migration Path:**
```typescript
// Customizer.tsx
const {
  productId,
  currentSide,
  selectedColor,
  selectedSize,
  designs,
  setProductFromSelection,
  setCurrentSide,
  setSelectedColor,
  setSelectedSize,
  addDesign,
  updateDesign,
  deleteDesign
} = useCustomizerStore()
```

---

#### TASK 2: Add Feature Flag System
**Difficulty:** Small  
**Files:**
- `src/config/features.ts` (new)
- `src/pages/Customizer.tsx`

**Description:**  
Create feature flag system to toggle between SimplePlacement and MultiDesign modes.

**Implementation:**
```typescript
// src/config/features.ts
export const FEATURES = {
  MULTI_DESIGN_CANVAS: import.meta.env.VITE_MULTI_DESIGN === 'true',
  DESIGN_LIBRARY: false,
  TEXT_ELEMENTS: false,
  ADVANCED_TOOLBAR: false
}

// Customizer.tsx
import { FEATURES } from '@/config/features'

return (
  <div>
    {FEATURES.MULTI_DESIGN_CANVAS ? (
      <ProductCanvas />  {/* New multi-design canvas */}
    ) : (
      <SimplePlacementCanvas />  {/* Current simple canvas */}
    )}
  </div>
)
```

**Acceptance Criteria:**
- ✅ Feature flags in environment config
- ✅ Simple flow still default
- ✅ Can toggle via `.env.local`
- ✅ No runtime errors when switching

---

#### TASK 3: Refactor Canvas Component
**Difficulty:** Large  
**Files:**
- `src/components/customizer/ProductCanvas.tsx`
- `src/components/customizer/SimplePlacementCanvas.tsx`

**Description:**  
Update `ProductCanvas.tsx` to render multiple designs from store.

**Current (SimplePlacementCanvas):**
```typescript
// Renders single design
const design = designImage
const placement = selectedPlacement
```

**Target (ProductCanvas):**
```typescript
// Renders array of designs
const currentDesigns = designs[currentSide]
currentDesigns.forEach(design => {
  // Render each design with its own position/scale/rotation
})
```

**Steps:**
1. Copy SimplePlacementCanvas logic to ProductCanvas
2. Update to iterate over `designs[currentSide]` array
3. Render each design with its stored position
4. Add click handlers for selection
5. Add hover states for interactivity

**Acceptance Criteria:**
- ✅ Renders all designs for current side
- ✅ Each design clickable for selection
- ✅ Respects z-index ordering
- ✅ No performance issues with 10+ designs

---

### Phase 2: Core Editing (Week 2)

#### TASK 4: Implement Drag & Drop
**Difficulty:** Medium  
**Files:**
- `src/components/customizer/ProductCanvas.tsx`
- `src/components/customizer/DraggableDesign.tsx` (new)

**Description:**  
Add drag-and-drop using `react-rnd` library.

**Implementation:**
```typescript
import { Rnd } from 'react-rnd'

{currentDesigns.map((design) => (
  <Rnd
    key={design.id}
    position={{ x: design.x, y: design.y }}
    size={{ width: design.width, height: design.height }}
    onDragStop={(e, d) => {
      updateDesign(design.id, { x: d.x, y: d.y })
      saveToHistory()
    }}
    onResizeStop={(e, dir, ref, delta, position) => {
      updateDesign(design.id, {
        width: ref.offsetWidth,
        height: ref.offsetHeight,
        ...position
      })
      saveToHistory()
    }}
    bounds="parent"
  >
    <img src={design.src} alt="Design" />
  </Rnd>
))}
```

**Acceptance Criteria:**
- ✅ Designs draggable within canvas
- ✅ Position updates in store
- ✅ Cannot drag outside print area
- ✅ Multi-touch support (mobile)

---

#### TASK 5: Add Resize Handles
**Difficulty:** Small  
**Files:**
- `src/components/customizer/ProductCanvas.tsx`

**Description:**  
Enable resize handles on selected design using `react-rnd`.

**Implementation:**
```typescript
<Rnd
  enableResizing={selectedElementId === design.id}
  resizeHandleStyles={{
    bottomRight: { cursor: 'se-resize' },
    bottomLeft: { cursor: 'sw-resize' },
    topRight: { cursor: 'ne-resize' },
    topLeft: { cursor: 'nw-resize' }
  }}
  lockAspectRatio  // Maintain aspect ratio
  ...
/>
```

**Acceptance Criteria:**
- ✅ 4 corner handles on selected design
- ✅ Resize maintains aspect ratio
- ✅ Size updates in store
- ✅ Visual feedback (highlighted handles)

---

#### TASK 6: Add Rotation Control
**Difficulty:** Medium  
**Files:**
- `src/components/customizer/ProductCanvas.tsx`
- `src/components/customizer/RotationHandle.tsx` (new)

**Description:**  
Add rotation handle above selected design.

**Implementation:**
```typescript
{selectedElementId === design.id && (
  <div
    className="rotation-handle"
    onMouseDown={handleRotationStart}
    style={{
      position: 'absolute',
      top: -30,
      left: '50%',
      transform: 'translateX(-50%)',
      cursor: 'grab'
    }}
  >
    <RotateIcon />
  </div>
)}

const handleRotation = (e: MouseEvent) => {
  const angle = calculateAngle(centerX, centerY, e.clientX, e.clientY)
  updateDesign(design.id, { rotation: angle })
}
```

**Acceptance Criteria:**
- ✅ Rotation handle appears above selected design
- ✅ Drag handle to rotate
- ✅ Rotation in degrees (0-360)
- ✅ Visual rotation preview

---

#### TASK 7: Implement Floating Toolbar
**Difficulty:** Medium  
**Files:**
- `src/components/customizer/FloatingToolbar.tsx` (new)
- `src/pages/Customizer.tsx`

**Description:**  
Add floating toolbar when design selected.

**Features:**
- Delete button
- Duplicate button
- Bring to front / Send to back
- Lock/unlock
- Alignment tools

**Implementation:**
```typescript
export function FloatingToolbar({ designId }: { designId: string }) {
  const { deleteDesign, duplicateDesign, bringToFront, sendToBack } = useCustomizerStore()
  
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 flex gap-2">
      <button onClick={() => deleteDesign(designId)}>
        <Trash2 />
      </button>
      <button onClick={() => duplicateDesign(designId)}>
        <Copy />
      </button>
      <button onClick={() => bringToFront(designId)}>
        <ArrowUp />
      </button>
      <button onClick={() => sendToBack(designId)}>
        <ArrowDown />
      </button>
    </div>
  )
}
```

**Acceptance Criteria:**
- ✅ Toolbar appears when design selected
- ✅ All buttons functional
- ✅ Toolbar positioned below canvas
- ✅ Keyboard shortcuts work (Delete, Ctrl+D)

---

### Phase 3: Advanced Features (Week 3)

#### TASK 8: Implement Undo/Redo
**Difficulty:** Small  
**Files:**
- `src/store/customizer.ts` (already has undo/redo)
- `src/pages/Customizer.tsx`

**Description:**  
Wire up existing undo/redo store actions to UI.

**Implementation:**
```typescript
const { undo, redo, canUndo, canRedo } = useCustomizerStore()

// Add keyboard shortcuts
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault()
      if (e.shiftKey) {
        redo()
      } else {
        undo()
      }
    }
  }
  window.addEventListener('keydown', handleKeyPress)
  return () => window.removeEventListener('keydown', handleKeyPress)
}, [undo, redo])

// Add UI buttons
<div className="undo-redo-controls">
  <button onClick={undo} disabled={!canUndo()}>
    <Undo2 /> Undo
  </button>
  <button onClick={redo} disabled={!canRedo()}>
    <Redo2 /> Redo
  </button>
</div>
```

**Acceptance Criteria:**
- ✅ Ctrl+Z undoes last change
- ✅ Ctrl+Shift+Z (or Ctrl+Y) redoes
- ✅ Undo/Redo buttons in toolbar
- ✅ Buttons disabled when can't undo/redo
- ✅ History persists up to 50 states

---

#### TASK 9: Add Text Element Support
**Difficulty:** Large  
**Files:**
- `src/components/customizer/ProductCanvas.tsx`
- `src/components/customizer/TextEditor.tsx` (new)
- `src/components/customizer/ControlPanel.tsx`

**Description:**  
Allow users to add text elements.

**Implementation:**
```typescript
const addTextElement = () => {
  addDesign({
    type: 'text',
    text: 'Your Text Here',
    x: printArea.x + 50,
    y: printArea.y + 50,
    width: 200,
    height: 50,
    fontSize: 32,
    fontFamily: 'Arial',
    color: '#000000',
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    locked: false
  })
}

// Render text in canvas:
{design.type === 'text' && (
  <Rnd ...>
    <div style={{
      fontSize: design.fontSize,
      fontFamily: design.fontFamily,
      color: design.color,
      transform: `rotate(${design.rotation}deg)`
    }}>
      {design.text}
    </div>
  </Rnd>
)}
```

**Text Editor Panel:**
- Text input
- Font selector
- Font size slider
- Color picker
- Bold/Italic toggles
- Alignment options

**Acceptance Criteria:**
- ✅ "Add Text" button in control panel
- ✅ Text editable inline (click to edit)
- ✅ Text resizable/rotatable
- ✅ Font customization works
- ✅ Text renders correctly in preview

---

#### TASK 10: Add Grid & Snap-to-Grid
**Difficulty:** Medium  
**Files:**
- `src/components/customizer/ProductCanvas.tsx`
- `src/store/customizer.ts`

**Description:**  
Add visual grid overlay and snap-to-grid positioning.

**Implementation:**
```typescript
// Grid overlay
{gridEnabled && (
  <svg className="absolute inset-0 pointer-events-none">
    {Array.from({ length: canvasWidth / gridSize }).map((_, i) => (
      <line
        key={`v-${i}`}
        x1={i * gridSize}
        y1={0}
        x2={i * gridSize}
        y2={canvasHeight}
        stroke="#ddd"
        strokeWidth={1}
      />
    ))}
    {/* Horizontal lines */}
  </svg>
)}

// Snap to grid on drag
<Rnd
  onDragStop={(e, d) => {
    const snappedX = snapToGrid ? snapToGrid(d.x, gridSize) : d.x
    const snappedY = snapToGrid ? snapToGrid(d.y, gridSize) : d.y
    updateDesign(design.id, { x: snappedX, y: snappedY })
  }}
/>
```

**Acceptance Criteria:**
- ✅ Grid toggle in control panel
- ✅ Snap-to-grid toggle
- ✅ Grid visible when enabled
- ✅ Designs snap to nearest grid point

---

#### TASK 11: Add Zoom Controls
**Difficulty:** Small  
**Files:**
- `src/pages/Customizer.tsx`
- `src/components/customizer/ZoomControls.tsx` (new)

**Description:**  
Add zoom in/out buttons and slider.

**Implementation:**
```typescript
const { zoom, setZoom } = useCustomizerStore()

<div className="zoom-controls">
  <button onClick={() => setZoom(zoom - 0.1)}>-</button>
  <input
    type="range"
    min="0.5"
    max="2"
    step="0.1"
    value={zoom}
    onChange={(e) => setZoom(parseFloat(e.target.value))}
  />
  <span>{(zoom * 100).toFixed(0)}%</span>
  <button onClick={() => setZoom(zoom + 0.1)}>+</button>
</div>

<div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
  <ProductCanvas />
</div>
```

**Acceptance Criteria:**
- ✅ Zoom range: 50% - 200%
- ✅ Zoom buttons work
- ✅ Slider works
- ✅ Canvas scales correctly
- ✅ Print area boundaries scale

---

### Phase 4: Design Library & Polish (Week 4)

#### TASK 12: Build Design Library
**Difficulty:** Large  
**Files:**
- `src/components/customizer/DesignLibrary.tsx` (new)
- `src/config/designLibrary.ts` (new)
- `src/pages/Customizer.tsx`

**Description:**  
Add browseable library of pre-made designs.

**Features:**
- Category tabs (Abstract, Nature, Typography, etc.)
- Search/filter
- Grid view of thumbnails
- Click to add to canvas
- Pagination

**Implementation:**
```typescript
// src/config/designLibrary.ts
export const DESIGN_LIBRARY: LibraryDesign[] = [
  {
    id: 'abstract-001',
    name: 'Geometric Pattern',
    category: 'Abstract',
    thumbnail: '/library/abstract-001-thumb.png',
    url: '/library/abstract-001.png',
    tags: ['geometric', 'modern', 'colorful']
  },
  // ... more designs
]

// DesignLibrary.tsx
export function DesignLibrary() {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  
  const filtered = DESIGN_LIBRARY.filter(d =>
    (category === 'All' || d.category === category) &&
    (search === '' || d.tags.some(tag => tag.includes(search)))
  )
  
  return (
    <div className="design-library">
      <input
        type="search"
        placeholder="Search designs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="categories">
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {filtered.map(design => (
          <div
            key={design.id}
            className="cursor-pointer"
            onClick={() => addDesignFromLibrary(design)}
          >
            <img src={design.thumbnail} alt={design.name} />
            <p>{design.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Acceptance Criteria:**
- ✅ Library shows 20+ designs
- ✅ Category filtering works
- ✅ Search works
- ✅ Click design adds to canvas
- ✅ Responsive grid layout

---

#### TASK 13: Add Copy to Other Sides
**Difficulty:** Small  
**Files:**
- `src/components/customizer/FloatingToolbar.tsx`
- `src/store/customizer.ts`

**Description:**  
Add button to copy all designs from current side to other sides.

**Implementation:**
```typescript
const handleCopyToSide = (toSide: ProductSide) => {
  copyDesignToSide(currentSide, toSide)
  toast({
    title: 'Designs Copied',
    description: `Copied ${designs[currentSide].length} designs to ${toSide}`
  })
}

<DropdownMenu>
  <DropdownMenuTrigger>
    <Copy /> Copy to...
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    {product.availableSides
      .filter(side => side !== currentSide)
      .map(side => (
        <DropdownMenuItem key={side} onClick={() => handleCopyToSide(side)}>
          {side}
        </DropdownMenuItem>
      ))
    }
  </DropdownMenuContent>
</DropdownMenu>
```

**Acceptance Criteria:**
- ✅ "Copy to..." button in toolbar
- ✅ Shows available sides
- ✅ Copies all designs to selected side
- ✅ Confirmation toast

---

#### TASK 14: Implement Save Draft
**Difficulty:** Medium  
**Files:**
- `src/store/customizer.ts`
- `src/pages/Customizer.tsx`

**Description:**  
Save work-in-progress to localStorage.

**Implementation:**
```typescript
// Auto-save every 30 seconds
useEffect(() => {
  const interval = setInterval(() => {
    const state = useCustomizerStore.getState()
    localStorage.setItem('customizer-draft', JSON.stringify({
      productId: state.productId,
      designs: state.designs,
      selectedColor: state.selectedColor,
      selectedSize: state.selectedSize,
      savedAt: Date.now()
    }))
  }, 30000)
  
  return () => clearInterval(interval)
}, [])

// Load on mount
useEffect(() => {
  const saved = localStorage.getItem('customizer-draft')
  if (saved) {
    const draft = JSON.parse(saved)
    // Show "Restore draft?" dialog
    if (confirm('Restore saved draft?')) {
      // Load draft into store
    }
  }
}, [])
```

**Acceptance Criteria:**
- ✅ Auto-saves every 30 seconds
- ✅ On page load, prompts to restore
- ✅ "Save Draft" button in toolbar
- ✅ Draft expires after 7 days

---

#### TASK 15: Polish & Testing
**Difficulty:** Medium  
**Files:** All

**Description:**  
Final polish pass and comprehensive testing.

**Checklist:**
- [ ] Run all unit tests
- [ ] Run integration tests
- [ ] Run E2E tests
- [ ] Manual testing on desktop
- [ ] Manual testing on mobile
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Performance audit (Lighthouse)
- [ ] Accessibility audit (WAVE, axe)
- [ ] Visual regression testing
- [ ] Load testing (10+ designs on canvas)
- [ ] Memory leak testing
- [ ] User acceptance testing

**Polish:**
- [ ] Add loading skeletons
- [ ] Add empty states
- [ ] Add error boundaries
- [ ] Add success animations
- [ ] Optimize bundle size
- [ ] Add help tooltips
- [ ] Write user documentation
- [ ] Record demo video

**Acceptance Criteria:**
- ✅ All tests passing
- ✅ Lighthouse score >90
- ✅ No console errors
- ✅ No memory leaks
- ✅ Responsive on all screen sizes
- ✅ Accessible (WCAG AA)

---

## Rollout Strategy

### Week 1: Foundation
- Enable feature flag in dev environment
- Test with internal team
- Gather feedback

### Week 2: Core Editing
- Beta test with select users
- Monitor performance
- Fix critical bugs

### Week 3: Advanced Features
- Wider beta release
- Collect user feedback
- Iterate on UX

### Week 4: Production
- Full release to all users
- Monitor analytics
- Deprecate SimplePlacement flow

---

## Rollback Plan

If critical issues arise:

1. **Immediate:** Disable `FEATURES.MULTI_DESIGN_CANVAS` flag (reverts to SimplePlacement)
2. **Short-term:** Fix bugs in production hotfix
3. **Long-term:** Re-enable feature flag after fix verified

---

## Success Metrics

**Engagement:**
- Time spent in customizer: +30%
- Designs created per session: +50%
- Multi-design usage: >40% of users

**Conversion:**
- Customizer → Cart: +15%
- Average order value: +$5 (multi-design premium)

**Quality:**
- Error rate: <1%
- Page load time: <2s
- Canvas FPS: >30fps

**Satisfaction:**
- User rating: >4.5/5
- Support tickets: <5% increase
- Completion rate: >80%

---

## Dependencies

**External:**
- `react-rnd` (drag/drop/resize)
- `react-color` (color picker for text)
- `fabric.js` (optional - canvas rendering)

**Internal:**
- Design assets (library graphics)
- Mockup images (high-res)
- Font files (Google Fonts)

---

## Notes

- All tasks are incremental - can release after each phase
- Feature flags allow A/B testing
- Backwards compatible - SimplePlacement still works
- No breaking changes to existing cart/order system
- Requires minimal backend changes (same payload structure)
