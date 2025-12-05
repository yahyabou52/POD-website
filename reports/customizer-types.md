# Customizer TypeScript Types Reference

**Generated:** 2025-12-04  
**Purpose:** Complete type definitions used by the Customizer page

---

## Core Types (src/types/customizer.ts)

### Product Types

```typescript
export type ProductType = 'tshirt' | 'hoodie' | 'cap' | 'mug'

export type ProductSide = 
  | 'front' 
  | 'back' 
  | 'left-sleeve' 
  | 'right-sleeve' 
  | 'hood'

export type FitType = 'regular' | 'oversize'

export type SleeveType = 'short' | 'full'

export type CapType = 'baseball' | 'trucker'

export type MugType = 'ceramic' | 'travel'
```

---

### Product Template

```typescript
export interface ProductTemplate {
  id: string                          // e.g., 'tshirt-regular-short'
  type: ProductType                   // Product category
  name: string                        // Display name
  fitTypes?: FitType[]                // Available fits (t-shirt, hoodie)
  sleeveTypes?: SleeveType[]          // Available sleeves (t-shirt)
  capTypes?: CapType[]                // Cap styles
  mugTypes?: MugType[]                // Mug types
  availableSides: ProductSide[]       // Printable sides
  basePrice: number                   // Starting price in USD
  colors: ProductColor[]              // Available colors
  sizes: string[]                     // Available sizes
  printAreas: Record<ProductSide, PrintArea>  // Print zones per side
  views: Record<ProductSide, ProductView>     // Mockup images per side
}
```

**Example:**
```typescript
const tshirt: ProductTemplate = {
  id: 'tshirt-regular-short',
  type: 'tshirt',
  name: 'Regular Fit T-Shirt (Short Sleeve)',
  fitTypes: ['regular'],
  sleeveTypes: ['short'],
  availableSides: ['front', 'back'],
  basePrice: 19.99,
  colors: [
    { name: 'White', hex: '#FFFFFF', image: '/templates/tshirt-white.svg', mockups: {...} }
  ],
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  printAreas: { front: {...}, back: {...} },
  views: { front: {...}, back: {...} }
}
```

---

### Product Color

```typescript
export interface ProductColor {
  name: string                        // Color name
  hex: string                         // Hex color code
  image: string                       // SVG template path
  mockups?: {                         // Optional per-side mockup URLs
    front?: string
    back?: string
    'left-sleeve'?: string
    'right-sleeve'?: string
    hood?: string
  }
}
```

---

### Print Area

```typescript
export interface PrintArea {
  x: number                           // Top-left X coordinate (px)
  y: number                           // Top-left Y coordinate (px)
  width: number                       // Print zone width (px)
  height: number                      // Print zone height (px)
  maxWidth: number                    // Maximum printable width
  maxHeight: number                   // Maximum printable height
  canvasWidth: number                 // Full canvas width
  canvasHeight: number                // Full canvas height
}
```

**Example:**
```typescript
const frontPrintArea: PrintArea = {
  x: 150,
  y: 100,
  width: 300,
  height: 350,
  maxWidth: 350,
  maxHeight: 400,
  canvasWidth: 600,
  canvasHeight: 600
}
```

---

### Product View

```typescript
export interface ProductView {
  mockup: string                      // Mockup image URL
  mask?: string                       // Optional mask for design clipping
  area: {                             // Design placement area on mockup
    x: number
    y: number
    width: number
    height: number
  }
}
```

---

### Design Element (Unused in Simple Flow)

```typescript
export interface DesignElement {
  id: string                          // Unique identifier
  type: 'image' | 'text'              // Element type
  src?: string                        // Image source (base64 or URL)
  text?: string                       // Text content (for text elements)
  x: number                           // X position (px)
  y: number                           // Y position (px)
  width: number                       // Width (px)
  height: number                      // Height (px)
  scaleX: number                      // Horizontal scale factor
  scaleY: number                      // Vertical scale factor
  rotation: number                    // Rotation in degrees
  locked: boolean                     // Whether element is locked
  zIndex: number                      // Layer order
}
```

**Note:** This type is defined but not used in the current SimplePlacement flow. It's used by the unused `src/store/customizer.ts` store for multi-design support.

---

### Canvas State (Unused in Simple Flow)

```typescript
export interface CanvasState {
  // Product configuration
  productId: string
  productType: ProductType
  fitType?: FitType
  sleeveType?: SleeveType
  currentSide: ProductSide
  selectedColor: string
  selectedSize: string
  
  // Design state (multi-design support)
  designs: Record<ProductSide, DesignElement[]>
  selectedElementId: string | null
  
  // Canvas controls
  gridEnabled: boolean
  snapToGrid: boolean
  zoom: number
}
```

**Note:** This is for the full canvas system. Current SimplePlacement flow uses local component state instead.

---

### Product Selection

```typescript
export interface ProductSelection {
  productType?: ProductType
  fitType?: FitType
  sleeveType?: SleeveType
  capType?: CapType
  mugType?: MugType
  printArea?: ProductSide
  color?: string
  size?: string
}
```

**Used By:** ProductWizard component to collect user selections before initializing canvas.

---

### Preset Position (Unused)

```typescript
export type PresetPosition = 
  | 'center'
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
```

**Note:** Defined for multi-design system but not used in SimplePlacement (uses placement zones instead).

---

### History State (Unused)

```typescript
export interface HistoryState {
  canvasState: CanvasState
  timestamp: number
}
```

**Note:** For undo/redo functionality. Not implemented in SimplePlacement flow.

---

## Config Types (src/config/placements.ts)

### Placement Config (Unused)

```typescript
export interface PlacementConfig {
  x: number                           // Position X
  y: number                           // Position Y
  size: number                        // Default size
  label: string                       // Display label
}
```

**Note:** Defined but not used. Current implementation uses printAreas.ts instead.

---

### Design Data

```typescript
export interface DesignData {
  image: string                       // Design image (base64 or URL)
  placement: string                   // Placement ID (e.g., 'fullCenter')
  scale: number                       // Scale factor (0.3 - 1.0)
  side: ProductSide                   // Product side
  color: string                       // Product color
  size: string                        // Product size
  productId: string                   // Product template ID
}
```

**Used By:** Preview modal and cart payload.

---

### Preview Data

```typescript
export interface PreviewData {
  preview: string                     // Preview image (base64 PNG)
  design: DesignData                  // Design metadata
  timestamp: number                   // Creation timestamp
}
```

**Used By:** SimplePreviewModal component.

---

## Print Area Types (src/config/printAreas.ts)

### Print Area Position

```typescript
export interface PrintAreaPosition {
  x: number                           // Top-left X (px)
  y: number                           // Top-left Y (px)
  width: number                       // Zone width (px)
  height: number                      // Zone height (px)
}
```

**Example:**
```typescript
const fullCenter: PrintAreaPosition = {
  x: 217,
  y: 340,
  width: 325,
  height: 470
}
```

---

### Product Print Areas

```typescript
export interface ProductPrintAreas {
  [side: string]: {                   // e.g., 'front', 'back'
    [placement: string]: PrintAreaPosition  // e.g., 'fullCenter', 'topLeft'
  }
}
```

**Example:**
```typescript
const tshirtPrintAreas: ProductPrintAreas = {
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

---

### Full Print Areas Map

```typescript
const PRINT_AREAS: Record<ProductType, ProductPrintAreas> = {
  tshirt: { front: {...}, back: {...}, ... },
  hoodie: { front: {...}, back: {...}, ... },
  cap: { front: {...}, back: {...} },
  mug: { front: {...}, back: {...} }
}
```

---

## Cart Types (src/store/cart.ts)

### Cart Item

```typescript
export interface CartItem {
  id: string                          // Unique cart item ID
  productId: string                   // Product template ID
  productType: string                 // Product category
  productName: string                 // Display name
  size: string                        // Selected size
  color: string                       // Selected color
  quantity: number                    // Item quantity
  price: number                       // Unit price
  designUrl?: string                  // Preview image URL (optional)
  customDesign?: {                    // Custom design data (optional)
    imageUrl: string                  // Design image (base64)
    position: { x: number; y: number }  // Position on product
    scale: number                     // Scale factor
    rotation: number                  // Rotation in degrees
  }
}
```

**Example:**
```typescript
const cartItem: CartItem = {
  id: 'abc123',
  productId: 'tshirt-regular-short',
  productType: 'tshirt',
  productName: 'Regular Fit T-Shirt (Short Sleeve)',
  size: 'M',
  color: 'White',
  quantity: 1,
  price: 19.99,
  customDesign: {
    imageUrl: 'data:image/png;base64,...',
    position: { x: 150, y: 100 },
    scale: 0.75,
    rotation: 0
  },
  designUrl: 'data:image/png;base64,...'
}
```

---

## Component Prop Types

### SimplePlacementCanvas Props

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

---

### SimplePlacementPanel Props

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

---

### ProductWizard Props

```typescript
interface ProductWizardProps {
  onComplete: (selection: ProductSelection) => void
  onCancel?: () => void
}
```

---

### SimplePreviewModal Props

```typescript
interface SimplePreviewModalProps {
  isOpen: boolean
  previewData: PreviewData | null
  onClose: () => void
}
```

---

## Recommended Type Additions

### 1. Per-Side Design State (For BUG-1 Fix)

```typescript
export interface SideDesignState {
  image: string | null
  placement: string | null
  scale: number
}

export type DesignsState = Record<ProductSide, SideDesignState>
```

**Usage:**
```typescript
const [designs, setDesigns] = useState<DesignsState>({
  front: { image: null, placement: null, scale: 1 },
  back: { image: null, placement: null, scale: 1 },
  'left-sleeve': { image: null, placement: null, scale: 1 },
  'right-sleeve': { image: null, placement: null, scale: 1 },
  hood: { image: null, placement: null, scale: 1 }
})
```

---

### 2. Toast Notification Type

```typescript
export interface ToastNotification {
  title: string
  description?: string
  variant?: 'default' | 'destructive' | 'success' | 'warning'
  duration?: number
}
```

---

### 3. File Upload Validation

```typescript
export interface FileValidationResult {
  valid: boolean
  error?: string
  warnings?: string[]
  file?: File
  dimensions?: { width: number; height: number }
}
```

---

### 4. Order Payload (Backend Integration)

```typescript
export interface OrderPayload {
  orderId: string
  items: OrderItem[]
  customer: {
    name: string
    email: string
    address: string
  }
  total: number
  createdAt: number
}

export interface OrderItem {
  productId: string
  color: string
  size: string
  quantity: number
  designs: DesignPlacement[]
  mockupUrl: string
}

export interface DesignPlacement {
  side: ProductSide
  imageUrl: string
  placement: string
  scale: number
  printArea: {
    x: number
    y: number
    width: number
    height: number
  }
}
```

---

## Type Safety Checklist

- [x] All product types defined
- [x] Print area coordinates typed
- [x] Component props fully typed
- [x] Cart payload typed
- [ ] Per-side design state (needs BUG-1 fix)
- [ ] Toast notification types
- [ ] File validation types
- [ ] Backend order payload types
- [ ] Error handling types

---

## Import Paths

```typescript
// Core types
import type { 
  ProductType, 
  ProductSide, 
  ProductTemplate,
  PrintArea,
  DesignElement,
  ProductSelection 
} from '@/types/customizer'

// Config types
import type { 
  DesignData, 
  PreviewData 
} from '@/config/placements'

import type { 
  PrintAreaPosition 
} from '@/config/printAreas'

// Store types
import type { CartItem } from '@/store/cart'
```

---

## Type Utility Functions

```typescript
// Type guard for ProductType
export function isProductType(value: string): value is ProductType {
  return ['tshirt', 'hoodie', 'cap', 'mug'].includes(value)
}

// Type guard for ProductSide
export function isProductSide(value: string): value is ProductSide {
  return ['front', 'back', 'left-sleeve', 'right-sleeve', 'hood'].includes(value)
}

// Extract product type from product ID
export function getProductTypeFromId(productId: string): ProductType {
  if (productId.startsWith('tshirt')) return 'tshirt'
  if (productId.startsWith('hoodie')) return 'hoodie'
  if (productId.startsWith('cap')) return 'cap'
  if (productId.startsWith('mug')) return 'mug'
  throw new Error(`Invalid product ID: ${productId}`)
}
```

---

## Notes

- All types are strongly typed (no `any`)
- Optional fields use `?` syntax
- Union types for enums (e.g., `ProductType`)
- Record types for dynamic keys (e.g., `designs: Record<ProductSide, ...>`)
- Interface vs Type: Use `interface` for objects, `type` for unions/primitives
