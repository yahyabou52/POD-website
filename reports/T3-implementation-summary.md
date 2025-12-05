# T3 Implementation: Improved Print-Area Presets

**Date:** December 4, 2025  
**Task:** Upgrade placement presets with better UI and configuration system

---

## ✅ What Was Implemented

### New Preset Configuration System

Created a centralized preset configuration that defines visual metadata for each placement option.

**New File:** `src/config/placementPresets.ts`

**Features:**
- Defines icon, label, and description for each placement preset
- Categorizes presets by type (front, back, sleeve, universal)
- Provides helper functions for preset lookup and filtering
- Type-safe with TypeScript interfaces

**Preset Definitions:**

| Placement ID | Label | Description | Icon | Category |
|-------------|-------|-------------|------|----------|
| `topLeft` | Top Left | Small logo placement on upper left chest | AlignLeft | front |
| `topRight` | Top Right | Small logo placement on upper right chest | AlignRight | front |
| `centerTop` | Center Top | Centered placement at chest level | AlignCenter | front |
| `fullCenter` | Full Center | Large centered design (recommended) | Maximize2 | front |
| `fullBack` | Full Back | Large back design (full print area) | Square | back |
| `centered` | Centered | Centered on available print area | AlignCenter | universal |

---

### Enhanced SimplePlacementPanel UI

Upgraded the placement selection interface with richer visual feedback and descriptions.

**Changes to:** `src/components/customizer/SimplePlacementPanel.tsx`

**Before (Old UI):**
- 2-column grid of small buttons
- Icon + label only
- Minimal visual distinction
- No descriptions

**After (New UI):**
- Full-width card-style buttons
- Icon in colored badge + label + description
- Clear selected state with blue accent
- Better hover effects with Framer Motion
- Active indicator dot when selected

**UI Components:**
```tsx
<motion.button> // Animated preset card
  <Icon in colored badge />
  <div>
    <Label (bold) />
    <Description (small text) />
  </div>
  <Active indicator dot />
</motion.button>
```

---

## 🎨 Visual Improvements

### Preset Button States

**Unselected:**
- Gray border (`border-mist`)
- White background
- Gray icon badge
- Hover: darker border + light gray background
- Scale animation: 1.02x on hover, 0.98x on tap

**Selected:**
- Blue border (`border-royal`)
- Blue tinted background (`bg-royal/10`)
- Blue icon badge with white icon
- Shadow for depth
- Blue active dot indicator

### Layout Changes

**Old:** 2-column grid, compact buttons
```
[Top Left] [Top Right]
[Center Top] [Full Center]
```

**New:** Vertical stack, detailed cards
```
┌─────────────────────────────────────┐
│ [Icon] Top Left                   ● │
│       Small logo on upper left      │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ [Icon] Center Top                   │
│       Centered at chest level       │
└─────────────────────────────────────┘
```

---

## 🔧 How It Works

### 1. Preset Loading

**Configuration Import:**
```typescript
import { PLACEMENT_PRESETS } from '@/config/placementPresets'
```

The `PLACEMENT_PRESETS` object is imported from the centralized config file. Each preset contains:
- `id`: Matches the placement ID from printAreas.ts
- `label`: User-friendly name
- `description`: Helpful explanation of placement
- `icon`: Lucide icon component
- `category`: Classification (front/back/sleeve/universal)

### 2. Coordinate Application

**Print Area Coordinates:**
```typescript
// From printAreas.ts
const printArea = getPrintArea(productType, currentSide, selectedPlacement)
// Returns: { x, y, width, height }
```

When user selects a preset:
1. `onPlacementChange(placement)` is called
2. Parent component updates `selectedPlacement` state
3. Canvas component receives new placement via props
4. `getPrintArea(productType, currentSide, placement)` fetches coordinates
5. Design is rendered at the preset position

**Hoodie vs T-Shirt Differences:**
The system automatically adapts because `printAreas.ts` has different coordinates for each product type:

```typescript
PRINT_AREAS = {
  hoodie: {
    front: {
      topLeft: { x: 210, y: 373, width: 140, height: 115 },
      fullCenter: { x: 200, y: 333, width: 325, height: 285 },
      // ...
    }
  },
  tshirt: {
    front: {
      topLeft: { x: 225, y: 360, width: 140, height: 115 },
      fullCenter: { x: 217, y: 340, width: 325, height: 470 },
      // ...
    }
  }
}
```

### 3. Side-Based Placement Storage

**Per-Side Design State (from T2):**
```typescript
const [designs, setDesigns] = useState<Record<ProductSide, {
  image: string | null
  placement: string | null  // ← Stores selected preset ID
  scale: number
}>>({
  front: { image: null, placement: null, scale: 1 },
  back: { image: null, placement: null, scale: 1 },
  // ... other sides
})
```

**Flow:**
1. User selects "Full Center" preset on Front side
2. `onPlacementChange('fullCenter')` is called
3. Parent updates: `designs.front.placement = 'fullCenter'`
4. User switches to Back side
5. Front placement is preserved in `designs.front.placement`
6. Back has its own independent placement in `designs.back.placement`

**Benefits:**
- Each side remembers its selected preset
- No data loss when switching sides
- Independent configuration per side

---

## 📦 Files Modified

### 1. Created: `src/config/placementPresets.ts` (NEW)
- Centralized preset configuration
- Type-safe preset definitions
- Helper functions for preset lookup
- 85 lines total

### 2. Modified: `src/components/customizer/SimplePlacementPanel.tsx`
- **Imports:** Removed individual icon imports, added `PLACEMENT_PRESETS` import
- **Removed:** Hardcoded `PLACEMENT_CONFIGS` object
- **Placement Selection UI:** Replaced grid layout with enhanced card-style vertical stack
- **Added:** Motion animations for hover/tap
- **Added:** Descriptions and visual indicators

---

## 🎯 User Experience Improvements

### Before T3:
- Generic button grid
- No guidance on what each placement does
- Minimal visual feedback
- Hard to distinguish options

### After T3:
- Clear, descriptive preset cards
- Helpful descriptions explain each option
- Strong visual feedback (selected state is obvious)
- Smooth animations make UI feel polished
- Better information hierarchy (icon → label → description)

**Example User Flow:**
```
1. User uploads design
2. Sees preset list with descriptions:
   - "Small logo placement on upper left chest"
   - "Large centered design (recommended)"
3. Hovers over preset → subtle scale animation
4. Clicks "Full Center" → card highlights in blue
5. Switches to Back side → Front preset is preserved
6. Selects different preset on Back → independent storage
```

---

## 🧪 Testing

**Manual Testing Checklist:**
- ✅ Start customizer with T-Shirt
- ✅ Upload design on Front
- ✅ Verify 4 presets show: Top Left, Top Right, Center Top, Full Center
- ✅ Check descriptions are visible
- ✅ Select "Full Center" → card highlights blue
- ✅ Hover over unselected preset → see animation
- ✅ Switch to Back → verify "Full Back" preset appears
- ✅ Switch product to Hoodie → verify presets still work
- ✅ Check coordinates differ between T-Shirt and Hoodie

**TypeScript Compilation:**
- ✅ No errors in `placementPresets.ts`
- ✅ No errors in `SimplePlacementPanel.tsx`

---

## 🔍 Technical Details

### Preset Configuration Structure

```typescript
interface PlacementPreset {
  id: string              // 'topLeft', 'fullCenter', etc.
  label: string           // 'Top Left', 'Full Center'
  description: string     // 'Small logo placement...'
  icon: LucideIcon        // React component (AlignLeft, etc.)
  category: 'front' | 'back' | 'sleeve' | 'universal'
}
```

### Available Placements (Dynamic)

```typescript
const availablePlacements = getAvailablePlacementsForSide(productType, currentSide)
// Returns: ['topLeft', 'topRight', 'centerTop', 'fullCenter']
// Different results for hoodie vs tshirt, front vs back
```

### Print Area Integration

```typescript
// When preset is selected:
const printArea = getPrintArea(productType, currentSide, selectedPlacement)
// Returns coordinates from printAreas.ts

// Canvas uses these coordinates to position design:
ctx.drawImage(designImg, printArea.x, printArea.y, scaledWidth, scaledHeight)
```

---

## 🚀 Next Steps

**Completed:**
- ✅ T1: Cart Integration
- ✅ T2: Per-Side Design Persistence
- ✅ T3: Improved Print-Area Presets

**Future Tasks (from atomic list):**
- T4: Add Canvas Loading States
- T5: Image Resolution Validation
- T6: Replace alert() with Toast Notifications
- T7: Mobile Responsive Improvements

---

## 📝 Summary

**What Changed:**
- Created centralized preset configuration system
- Enhanced placement UI with card-style layout
- Added descriptions and better icons
- Improved visual feedback and animations

**How It Works:**
- Presets loaded from `placementPresets.ts`
- Coordinates fetched from `printAreas.ts` based on product type
- Each side stores its selected preset independently
- Canvas applies preset coordinates automatically

**Impact:**
- Users understand placement options better
- Professional, polished UI
- Easier to select correct placement
- Per-side storage prevents data loss
- Adapts to hoodie/t-shirt differences automatically

**Code Quality:**
- Type-safe TypeScript
- Clean separation of concerns (config vs UI)
- Reusable preset system
- No errors, compiles cleanly
