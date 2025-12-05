# T4-B Implementation: Design Manager Sidebar

**Date:** December 4, 2025  
**Task:** Implement left sidebar for managing multiple placements visually

---

## ✅ What Was Implemented

### 1. Design Manager Component

**New File:** `src/components/customizer/SimplePlacement/DesignManager.tsx`

A comprehensive sidebar panel that displays and manages all placements for the current product side.

### 2. Store Enhancements

**Modified:** `src/store/customizerStore.ts`

Added two new actions:
- `duplicatePlacement(id)` - Clone a placement with new ID
- `reorderPlacement(id, direction)` - Move placement up/down in array (z-index)

### 3. Layout Integration

**Modified:** `src/pages/Customizer.tsx`

- Added DesignManager to left column
- Maintains existing SimplePlacementPanel
- No changes to canvas or other components

---

## 🎨 Design Manager Features

### Empty State

When no placements exist:
```
┌─────────────────────────────┐
│ 🔷 Design Manager           │
│    Manage placements        │
├─────────────────────────────┤
│                             │
│      📋                     │
│   No designs yet            │
│   Upload a design to start  │
│                             │
└─────────────────────────────┘
```

### With Placements

```
┌─────────────────────────────────┐
│ 🔷 Design Manager               │
│    3 designs on front           │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ [IMG] Placement 1    [Active]│ │
│ │       Zone: Top Left         │ │
│ │       Scale: 1.0x            │ │
│ │ [Edit] [📋] [🗑️]             │ │
│ │ [↑ Move Up] [↓ Move Down]   │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ [IMG] Placement 2            │ │
│ │       Zone: Full Center      │ │
│ │       Scale: 0.8x            │ │
│ │ [Edit] [📋] [🗑️]             │ │
│ │ [↑ Move Up] [↓ Move Down]   │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### Placement Card Details

Each placement displays:
- **Thumbnail** - 64x64px preview of the design
- **Placement Index** - "Placement 1", "Placement 2", etc.
- **Active Badge** - Yellow "Active" pill if selected
- **Zone Name** - From placement presets (e.g., "Top Left", "Full Center")
- **Scale Value** - Current scale factor (e.g., "1.0x", "0.8x")

### Action Buttons

Each card has 5 action buttons:

1. **Edit** 
   - Sets this placement as active
   - Yellow background when active
   - Icon: ✏️

2. **Duplicate**
   - Clones the placement with new ID
   - Slightly offsets position (x+10, y+10)
   - Icon: 📋

3. **Delete**
   - Removes placement after confirmation
   - Red hover state
   - Icon: 🗑️

4. **Move Up**
   - Swaps with previous placement in array
   - Affects rendering z-index
   - Disabled if already first
   - Icon: ↑

5. **Move Down**
   - Swaps with next placement in array
   - Affects rendering z-index
   - Disabled if already last
   - Icon: ↓

---

## 🎯 Visual States

### Active Placement

```css
border: 2px solid #FACC15 (gold)
background: rgba(250, 204, 21, 0.05)
shadow: large
active-indicator-dot: top-right corner
```

### Inactive Placement

```css
border: 2px solid #E5E7EB (mist)
background: white
hover-border: #6B7280 (carbon)
hover-shadow: medium
```

### Button States

**Edit (Active):**
```css
background: #FACC15 (gold)
color: white
```

**Edit (Inactive):**
```css
background: #E5E7EB (mist)
color: #52525B (graphite)
hover-background: #6B7280 (carbon)
hover-color: white
```

**Duplicate:**
```css
background: #E5E7EB (mist)
hover-background: #3B82F6 (royal)
hover-color: white
```

**Delete:**
```css
background: #E5E7EB (mist)
hover-background: #EF4444 (red-500)
hover-color: white
```

---

## 🔧 Store API Usage

### Duplicate Placement

```typescript
import { useCustomizerStore } from '@/store/customizerStore'

const duplicatePlacement = useCustomizerStore((state) => state.duplicatePlacement)

// Clone a placement
const newId = duplicatePlacement('placement-123')

console.log('Created duplicate:', newId)
// Output: "placement-1733328500456-abc123"
```

**Implementation:**
- Finds original placement across all sides
- Creates new placement with new ID
- Offsets position by (10, 10) pixels
- Adds to same side as original
- Sets as active placement
- Returns new ID or null if not found

### Reorder Placement

```typescript
import { useCustomizerStore } from '@/store/customizerStore'

const reorderPlacement = useCustomizerStore((state) => state.reorderPlacement)

// Move placement up in z-index
reorderPlacement('placement-123', 'up')

// Move placement down in z-index
reorderPlacement('placement-123', 'down')
```

**Implementation:**
- Finds placement's index in array
- Swaps with adjacent placement
- Up = swap with previous (renders on top)
- Down = swap with next (renders below)
- No-op if at boundary (first/last)

---

## 📐 Layout Integration

### Before (2-Column)

```
┌──────────────────────────────────────┐
│  [Panel]     [Canvas]                │
└──────────────────────────────────────┘
```

### After (3-Column)

```
┌─────────────────────────────────────────┐
│ [Manager]  [Canvas]  [Panel]            │
└─────────────────────────────────────────┘
```

**Layout Structure:**
```tsx
<div className="flex gap-6">
  {/* Left Column */}
  <div className="lg:w-96 space-y-6">
    <DesignManager currentSide={currentSide} />
    <SimplePlacementPanel {...props} />
  </div>

  {/* Center */}
  <div className="flex-1">
    <SimplePlacementCanvas {...props} />
  </div>
</div>
```

**Key Points:**
- ✅ DesignManager and SimplePlacementPanel stacked vertically in left column
- ✅ Canvas remains centered and full-size
- ✅ No changes to existing panel functionality
- ✅ Responsive: collapses to single column on mobile

---

## 🎬 User Workflow

### Adding Multiple Placements

**Current T1/T2 workflow still works:**

1. User uploads design via SimplePlacementPanel
2. Selects placement preset (e.g., "Top Left")
3. Adjusts scale with slider
4. Clicks "Add to Cart"

**Future multi-placement workflow:**

1. User uploads design → creates placement in store
2. Design appears in DesignManager sidebar
3. User uploads another design → creates 2nd placement
4. Both designs shown in sidebar
5. Click placement to edit (set active)
6. Adjust scale/position for active placement
7. Duplicate, reorder, or delete placements

### Editing Placements

1. **Select:** Click placement card in sidebar → becomes active (yellow border)
2. **Edit:** Use controls in SimplePlacementPanel to adjust active placement
3. **Reorder:** Use ↑↓ buttons to change z-index
4. **Duplicate:** Click 📋 to clone the placement
5. **Delete:** Click 🗑️ to remove (with confirmation)

### Z-Index Management

Placements render in array order:
- First placement = bottom layer
- Last placement = top layer

**Move Up** = renders on top of more items
**Move Down** = renders below more items

---

## 🎨 Styling Details

### Component Colors

```typescript
const colors = {
  primary: '#3B82F6',      // royal (blue)
  accent: '#FACC15',       // gold (yellow)
  success: '#10B981',      // green
  danger: '#EF4444',       // red
  background: '#FFFFFF',   // white
  mist: '#E5E7EB',         // light gray
  carbon: '#6B7280',       // medium gray
  graphite: '#52525B',     // dark gray
  onyx: '#18181B',         // very dark
}
```

### Card Dimensions

```css
width: 320px (w-80)
max-height: calc(100vh - 120px)
border-radius: 16px (rounded-2xl)
padding: 16px (p-4)
gap: 12px (space-y-3)
```

### Thumbnail

```css
width: 64px (w-16)
height: 64px (h-16)
border-radius: 8px (rounded-lg)
border: 2px solid #E5E7EB
object-fit: contain
```

### Animation

```typescript
<motion.div
  layout                              // Animate position changes
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.9 }}
/>
```

---

## 🧪 Testing

### Manual Testing Checklist

**Store Actions:**
```typescript
// In browser console or component

import { useCustomizerStore } from '@/store/customizerStore'

// 1. Add placements to front
const id1 = useCustomizerStore.getState().addPlacement(
  'front',
  'data:image/png;base64,...',
  'topLeft',
  { scale: 1.0 }
)

const id2 = useCustomizerStore.getState().addPlacement(
  'front',
  'data:image/png;base64,...',
  'fullCenter',
  { scale: 0.8 }
)

// 2. Verify sidebar shows 2 placements
// 3. Click placement → verify active state
// 4. Duplicate → verify new placement appears
// 5. Move Up/Down → verify order changes
// 6. Delete → verify removal
```

**UI Testing:**
1. ✅ Open customizer
2. ✅ Verify DesignManager appears on left
3. ✅ Verify empty state message
4. ✅ Upload design via SimplePlacementPanel
5. ✅ **Note:** Design won't appear in sidebar yet (needs integration)
6. ✅ Manually add placement via store (see above)
7. ✅ Verify placement appears in sidebar
8. ✅ Click placement → verify yellow border
9. ✅ Click Edit → verify active state
10. ✅ Click Duplicate → verify copy appears
11. ✅ Click Move Up/Down → verify reorder
12. ✅ Click Delete → verify confirmation + removal

---

## 🔗 Integration Status

### ✅ Completed

- DesignManager component created
- Store actions implemented (duplicate, reorder)
- Layout integration added
- Visual design matching existing UI
- Active state tracking
- Empty state handling

### 🔄 Next Steps (Future Tasks)

**T4-C: Connect Upload to Store**

Currently, SimplePlacementPanel uploads still use local state. To fully integrate:

```typescript
// In SimplePlacementPanel onImageUpload handler:
onImageUpload={(image) => {
  // Instead of local state:
  // setDesigns(prev => ({ ...prev, [currentSide]: { image } }))
  
  // Add to store:
  useCustomizerStore.getState().addPlacement(
    currentSide,
    image,
    selectedPlacement,
    { scale: 1.0 }
  )
}}
```

**T4-D: Enable Multi-Placement Canvas**

```typescript
<SimplePlacementCanvas
  useMultiPlacement={true}  // Enable multi-placement rendering
  // ... other props
/>
```

**T4-E: Per-Placement Scale Control**

Add scale slider to DesignManager cards:
```typescript
<input
  type="range"
  min="0.3"
  max="1.0"
  step="0.05"
  value={placement.scale}
  onChange={(e) => {
    updatePlacement(placement.id, {
      scale: parseFloat(e.target.value)
    })
  }}
/>
```

---

## 📊 Component Props

### DesignManager Props

```typescript
interface DesignManagerProps {
  currentSide: ProductSide  // Required: which side to show placements for
}
```

**Usage:**
```tsx
<DesignManager currentSide="front" />
<DesignManager currentSide="back" />
<DesignManager currentSide="left-sleeve" />
```

### Store Hooks Used

```typescript
// Read placements for current side
const placements = useCustomizerStore((state) => 
  state.placements[currentSide] || []
)

// Read active placement ID
const activePlacementId = useCustomizerStore((state) => 
  state.activePlacementId
)

// Actions
const setActivePlacement = useCustomizerStore((state) => 
  state.setActivePlacement
)
const removePlacement = useCustomizerStore((state) => 
  state.removePlacement
)
const duplicatePlacement = useCustomizerStore((state) => 
  state.duplicatePlacement
)
const reorderPlacement = useCustomizerStore((state) => 
  state.reorderPlacement
)
```

---

## ✅ Deliverables Complete

1. ✅ **DesignManager.tsx** - Full component with all features
2. ✅ **Store Actions** - `duplicatePlacement()` and `reorderPlacement()`
3. ✅ **Layout Integration** - Added to Customizer page
4. ✅ **No Breaking Changes** - Existing workflow intact
5. ✅ **TypeScript** - No compilation errors
6. ✅ **Styling** - Matches existing UI conventions
7. ✅ **Documentation** - Complete usage guide

---

## 📝 Summary

**What Changed:**
- Created DesignManager sidebar component
- Added duplicate and reorder actions to store
- Integrated sidebar into customizer layout
- Maintains backward compatibility

**What Didn't Change:**
- SimplePlacementPanel functionality
- SimplePlacementCanvas rendering (still single-design mode)
- Product wizard
- Cart integration
- Existing T1/T2/T3 features

**How to Use:**
1. Open customizer
2. DesignManager appears on left (empty state)
3. Manually add placements via store for now
4. Click placements to select/edit
5. Use buttons to duplicate/delete/reorder

**Next Integration:**
- Connect upload button to store.addPlacement()
- Enable useMultiPlacement={true} on canvas
- Add per-placement controls
