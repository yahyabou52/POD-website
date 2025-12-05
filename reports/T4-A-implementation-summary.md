# T4-A Implementation: Multi-Placement Data Model

**Date:** December 4, 2025  
**Task:** Upgrade SimplePlacement to support multiple placements per side (data model & canvas only)

---

## ✅ What Was Implemented

### New Data Model

Converted from "one placement per side" to "multiple placements per side":

**Before (Single Placement):**
```typescript
// In Customizer.tsx (local state)
designs: {
  front: { image: string | null, placement: string | null, scale: number },
  back: { ... }
}
```

**After (Multi-Placement):**
```typescript
// In customizerStore.ts (Zustand store)
placements: {
  front: Placement[],
  back: Placement[],
  'left-sleeve': Placement[],
  'right-sleeve': Placement[],
  hood: Placement[]
}
```

---

## 📦 New Data Structures

### Placement Interface

```typescript
export interface Placement {
  id: string;          // Unique identifier (auto-generated)
  designId: string;    // Base64 image data or URL
  zone: string;        // Preset zone: 'topLeft', 'fullCenter', etc.
  x: number;           // X coordinate on canvas
  y: number;           // Y coordinate on canvas
  width: number;       // Design width in pixels
  height: number;      // Design height in pixels
  scale: number;       // Scale factor (0.3 - 1.0)
  rotation?: number;   // Rotation in degrees (optional)
}
```

### PlacementsBySide Type

```typescript
export type PlacementsBySide = {
  front: Placement[];
  back: Placement[];
  'left-sleeve': Placement[];
  'right-sleeve': Placement[];
  hood: Placement[];
}
```

---

## 🔧 Store API (customizerStore.ts)

### State Properties

```typescript
placements: PlacementsBySide        // All placements organized by side
activePlacementId: string | null    // Currently selected placement
```

### Store Actions

#### 1. `addPlacement(side, designId, zone, props)`

Adds a new placement to a specific side.

**Parameters:**
- `side: ProductSide` - Which side to add to ('front', 'back', etc.)
- `designId: string` - Base64 image data or image URL
- `zone: string` - Preset zone ('topLeft', 'fullCenter', etc.)
- `props: Partial<Placement>` - Additional properties (x, y, width, height, scale, rotation)

**Returns:** `string` - The generated placement ID

**Example:**
```typescript
import { useCustomizerStore } from '@/store/customizerStore'

const placementId = useCustomizerStore.getState().addPlacement(
  'front',                           // side
  'data:image/png;base64,...',      // designId (image)
  'fullCenter',                      // zone
  {
    x: 217,
    y: 340,
    width: 325,
    height: 470,
    scale: 1.0,
    rotation: 0
  }
)

console.log('Created placement:', placementId)
// Output: "placement-1733328000123-xyz789"
```

#### 2. `updatePlacement(id, updates)`

Updates an existing placement's properties.

**Parameters:**
- `id: string` - Placement ID to update
- `updates: Partial<Placement>` - Properties to update

**Example:**
```typescript
useCustomizerStore.getState().updatePlacement('placement-123', {
  scale: 0.8,
  rotation: 45,
  x: 250,
  y: 350
})
```

#### 3. `removePlacement(id)`

Removes a placement from all sides.

**Parameters:**
- `id: string` - Placement ID to remove

**Example:**
```typescript
useCustomizerStore.getState().removePlacement('placement-123')
```

#### 4. `setActivePlacement(id)`

Sets which placement is currently active/selected.

**Parameters:**
- `id: string | null` - Placement ID to activate, or null to deselect

**Example:**
```typescript
// Select a placement
useCustomizerStore.getState().setActivePlacement('placement-123')

// Deselect all
useCustomizerStore.getState().setActivePlacement(null)
```

#### 5. `clearPlacementsForSide(side)`

Removes all placements from a specific side.

**Parameters:**
- `side: ProductSide` - Which side to clear

**Example:**
```typescript
// Clear all front placements
useCustomizerStore.getState().clearPlacementsForSide('front')
```

#### 6. `getPlacementsForSide(side)`

Gets all placements for a specific side.

**Parameters:**
- `side: ProductSide` - Which side to query

**Returns:** `Placement[]` - Array of placements

**Example:**
```typescript
const frontPlacements = useCustomizerStore.getState().getPlacementsForSide('front')
console.log(`Front has ${frontPlacements.length} placements`)
```

#### 7. `getPlacementById(id)`

Finds a placement by its ID across all sides.

**Parameters:**
- `id: string` - Placement ID to find

**Returns:** `Placement | null` - The placement or null if not found

**Example:**
```typescript
const placement = useCustomizerStore.getState().getPlacementById('placement-123')
if (placement) {
  console.log(`Found on zone: ${placement.zone}`)
}
```

---

## 🎨 Canvas Rendering (SimplePlacementCanvas.tsx)

### Updated Props

```typescript
interface SimplePlacementCanvasProps {
  // ... existing props
  useMultiPlacement?: boolean  // NEW: Enable multi-placement mode
}
```

### Rendering Modes

#### Single Design Mode (Default - Backward Compatible)

```typescript
<SimplePlacementCanvas
  productId={productId}
  currentSide="front"
  selectedColor="White"
  designImage={designImage}        // Single image
  selectedPlacement={placement}    // Single placement
  scale={1.0}
  useMultiPlacement={false}        // Default mode
/>
```

Renders one design using the original logic (existing T1/T2 implementation).

#### Multi-Placement Mode (New)

```typescript
<SimplePlacementCanvas
  productId={productId}
  currentSide="front"
  selectedColor="White"
  designImage={null}               // Ignored in multi-placement
  selectedPlacement={null}         // Ignored in multi-placement
  scale={1.0}
  useMultiPlacement={true}         // Enable new mode
/>
```

Renders all placements from the store for the current side.

### Canvas Features

**Renders Multiple Placements:**
- Reads placements from `store.getPlacementsForSide(currentSide)`
- Each placement rendered independently
- Supports different zones per placement

**Active Placement Highlighting:**
- Active placement gets blue border (3px)
- Visual indicator: `strokeStyle = '#3B82F6'`
- Highlights which design is currently selected

**Print Area Validation:**
- Each placement stays within its zone's print area
- Uses `getPrintArea(productType, currentSide, zone)` for boundaries
- Auto-scales if design exceeds limits

**Rotation Support:**
- Applies `placement.rotation` in degrees
- Uses canvas transform matrix
- Rotates around design center point

---

## 🔄 How It Works

### Workflow Example

```typescript
import { useCustomizerStore } from '@/store/customizerStore'

// 1. User uploads first design
const design1 = 'data:image/png;base64,...'
const id1 = useCustomizerStore.getState().addPlacement(
  'front',
  design1,
  'topLeft',
  { x: 225, y: 360, width: 140, height: 115, scale: 1.0 }
)

// 2. User uploads second design
const design2 = 'data:image/png;base64,...'
const id2 = useCustomizerStore.getState().addPlacement(
  'front',
  design2,
  'fullCenter',
  { x: 217, y: 340, width: 325, height: 470, scale: 0.8 }
)

// 3. User selects the second placement
useCustomizerStore.getState().setActivePlacement(id2)

// 4. Canvas renders both designs, highlighting id2

// 5. User updates the active placement
useCustomizerStore.getState().updatePlacement(id2, {
  scale: 0.9,
  rotation: 15
})

// 6. User switches to back side
// Front placements preserved, back placements shown

// 7. User removes a placement
useCustomizerStore.getState().removePlacement(id1)
```

### Integration with Existing Code

**Backward Compatible:**
- Existing `Customizer.tsx` still uses local state (`designs`)
- `useMultiPlacement={false}` uses original rendering
- No UI changes needed yet

**Future UI Integration:**
When you add the placement sidebar (T4-B), you'll:
1. Set `useMultiPlacement={true}` on canvas
2. Call `addPlacement()` when user uploads image
3. Call `setActivePlacement()` when user clicks a placement in sidebar
4. Call `updatePlacement()` for scale/rotation controls
5. Call `removePlacement()` for delete button

---

## 📊 Data Flow

```
User uploads image
       ↓
SimplePlacementPanel (future: PlacementSidebar)
       ↓
store.addPlacement(side, designId, zone, props)
       ↓
Store updates placements[side] array
       ↓
SimplePlacementCanvas (useMultiPlacement=true)
       ↓
Reads store.getPlacementsForSide(currentSide)
       ↓
Renders each placement with highlighting
```

---

## 🎯 Placement Validation

### Print Area Boundaries

Each placement must stay within its zone's print area:

```typescript
const printArea = getPrintArea(productType, currentSide, placement.zone)
// Returns: { x, y, width, height }

// Design is scaled/clamped to fit:
const maxWidth = printArea.width
const maxHeight = printArea.height

// Final dimensions never exceed print area
finalWidth = Math.min(scaledWidth, maxWidth)
finalHeight = Math.min(scaledHeight, maxHeight)
```

### Auto-Centering

If placement has default x/y (0, 0), it's auto-centered:

```typescript
if (x === 0 && y === 0) {
  x = printArea.x + (printArea.width - finalWidth) / 2
  y = printArea.y + (printArea.height - finalHeight) / 2
}
```

---

## 🧪 Testing

### Manual Testing Checklist

**Store Actions:**
```typescript
// Test in browser console or React component

import { useCustomizerStore } from '@/store/customizerStore'

// 1. Add placement
const id = useCustomizerStore.getState().addPlacement(
  'front',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'fullCenter',
  { scale: 1.0 }
)
console.log('Created:', id)

// 2. Get placements
const placements = useCustomizerStore.getState().getPlacementsForSide('front')
console.log('Front placements:', placements)

// 3. Update placement
useCustomizerStore.getState().updatePlacement(id, { scale: 0.5 })

// 4. Set active
useCustomizerStore.getState().setActivePlacement(id)

// 5. Remove placement
useCustomizerStore.getState().removePlacement(id)

// 6. Clear side
useCustomizerStore.getState().clearPlacementsForSide('front')
```

**Canvas Rendering:**
1. Add `useMultiPlacement={true}` to SimplePlacementCanvas
2. Add 2-3 placements to front via store
3. Verify all placements render
4. Set one as active → verify blue highlight
5. Switch to back → verify front placements preserved

---

## 📝 Migration Path

### Current State (After T4-A)

- ✅ Store has multi-placement support
- ✅ Canvas can render multiple placements
- ❌ UI still uses single-placement workflow (T1/T2)
- ❌ No placement sidebar yet

### Next Steps (Future Tasks)

**T4-B: Placement Sidebar UI**
- Add sidebar component to show all placements
- Click placement → `setActivePlacement(id)`
- Delete button → `removePlacement(id)`
- Upload button → `addPlacement(...)`

**T4-C: Drag & Reorder**
- Drag placement thumbnails to reorder
- Updates `placements` array order
- Z-index rendering based on array order

**T4-D: Advanced Controls**
- Scale slider per placement
- Rotation dial per placement
- Position fine-tuning (x/y nudge)

---

## 🚨 Important Notes

### Backward Compatibility

**Existing workflow still works:**
```typescript
// Customizer.tsx still uses local state
const [designs, setDesigns] = useState<Record<ProductSide, {...}>>({...})

// SimplePlacementCanvas with useMultiPlacement={false}
// Renders using designImage prop (original behavior)
```

**No UI changes made:**
- SimplePlacementPanel unchanged
- ProductWizard unchanged
- Navbar/Footer unchanged
- User workflow unchanged

### When to Use Multi-Placement Mode

```typescript
// Use single mode for now (T1/T2 workflow)
<SimplePlacementCanvas useMultiPlacement={false} />

// Use multi mode when placement sidebar is ready (T4-B+)
<SimplePlacementCanvas useMultiPlacement={true} />
```

---

## 🔍 Code Changes Summary

### Files Modified

1. **`src/store/customizerStore.ts`** (60 lines changed)
   - Added `Placement` interface
   - Added `PlacementsBySide` type
   - Added 7 new store actions
   - Initialized `placements` state
   - Added `activePlacementId` state

2. **`src/components/customizer/SimplePlacementCanvas.tsx`** (120 lines changed)
   - Added `useMultiPlacement` prop
   - Imported `useCustomizerStore`
   - Added `drawMultiplePlacements()` function
   - Renamed `drawDesign()` to `drawSingleDesign()`
   - Added active placement highlighting
   - Updated useEffect dependencies

### Files NOT Modified

- ❌ `SimplePlacementPanel.tsx` - No changes
- ❌ `ProductWizard.tsx` - No changes
- ❌ `Customizer.tsx` - No changes (still uses local state)
- ❌ `Navbar.tsx` / `Footer.tsx` - No changes
- ❌ Any UI components - No changes

---

## 💡 Usage Examples

### Example 1: Simple Placement Addition

```typescript
const handleImageUpload = (imageData: string) => {
  const placementId = useCustomizerStore.getState().addPlacement(
    currentSide,
    imageData,
    'fullCenter',
    { scale: 1.0 }
  )
  
  console.log(`Added placement: ${placementId}`)
}
```

### Example 2: Using with React Component

```typescript
function PlacementManager() {
  const placements = useCustomizerStore(state => 
    state.getPlacementsForSide('front')
  )
  const activePlacementId = useCustomizerStore(state => 
    state.activePlacementId
  )
  
  return (
    <div>
      <h3>Front Placements ({placements.length})</h3>
      {placements.map(placement => (
        <div 
          key={placement.id}
          onClick={() => useCustomizerStore.getState().setActivePlacement(placement.id)}
          style={{
            border: placement.id === activePlacementId ? '2px solid blue' : 'none'
          }}
        >
          <img src={placement.designId} alt="Design" />
          <p>Zone: {placement.zone}</p>
          <p>Scale: {placement.scale}x</p>
        </div>
      ))}
    </div>
  )
}
```

### Example 3: Batch Operations

```typescript
// Add multiple placements at once
const designIds = ['data:image/png;base64,AAA...', 'data:image/png;base64,BBB...']
const zones = ['topLeft', 'topRight']

designIds.forEach((designId, index) => {
  useCustomizerStore.getState().addPlacement(
    'front',
    designId,
    zones[index],
    { scale: 0.8 }
  )
})
```

---

## ✅ Deliverables Complete

- ✅ Updated `customizerStore.ts` with multi-placement support
- ✅ Updated `SimplePlacementCanvas.tsx` with multi-rendering
- ✅ Backward compatible (existing workflow unchanged)
- ✅ No UI changes (per requirements)
- ✅ No preset system breakage
- ✅ SimplePlacement workflow fully functional
- ✅ TypeScript compilation: No errors
- ✅ Comprehensive API documentation

---

## 🎯 Summary

**What Changed:**
- Store now supports arrays of placements per side
- Canvas can render multiple designs simultaneously
- Active placement gets visual highlight
- 7 new store actions for placement management

**What Didn't Change:**
- No UI modifications
- Existing T1/T2 workflow still works
- Preset system unchanged
- Product wizard unchanged

**Next Steps:**
- T4-B: Build placement sidebar UI
- T4-C: Add drag & drop reordering
- T4-D: Advanced per-placement controls

**How to Use:**
See "Store API" and "Usage Examples" sections above for complete integration guide.
