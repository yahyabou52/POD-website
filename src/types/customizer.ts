// Product types and templates
export type ProductType = 'tshirt' | 'hoodie' | 'cap' | 'mug'
export type ProductSide = 'front' | 'back' | 'left-sleeve' | 'right-sleeve' | 'hood'
export type FitType = 'regular' | 'oversize'
export type SleeveType = 'short' | 'full'
export type CapType = 'baseball' | 'trucker'
export type MugType = 'ceramic' | 'travel'

export interface ProductView {
  mockup: string
  mask?: string
  area: {
    x: number
    y: number
    width: number
    height: number
  }
}

export interface ProductTemplate {
  id: string
  type: ProductType
  name: string
  fitTypes?: FitType[]
  sleeveTypes?: SleeveType[]
  capTypes?: CapType[]
  mugTypes?: MugType[]
  availableSides: ProductSide[]
  basePrice: number
  colors: ProductColor[]
  sizes: string[]
  printAreas: Record<ProductSide, PrintArea>
  views: Record<ProductSide, ProductView>
}

export interface ProductColor {
  name: string
  hex: string
  image: string
  mockups?: {
    front?: string
    back?: string
    'left-sleeve'?: string
    'right-sleeve'?: string
    hood?: string
  }
}

export interface PrintArea {
  x: number
  y: number
  width: number
  height: number
  maxWidth: number
  maxHeight: number
  canvasWidth: number
  canvasHeight: number
}

// Design elements
export interface DesignElement {
  id: string
  type: 'image' | 'text'
  src?: string
  text?: string
  x: number
  y: number
  width: number
  height: number
  scaleX: number
  scaleY: number
  rotation: number // in degrees
  locked: boolean
  zIndex: number
}

export interface CanvasState {
  // Product configuration
  productId: string
  productType: ProductType
  fitType?: FitType
  sleeveType?: SleeveType
  currentSide: ProductSide
  selectedColor: string
  selectedSize: string
  
  // Design state
  designs: Record<ProductSide, DesignElement[]>
  selectedElementId: string | null
  
  // Canvas controls
  gridEnabled: boolean
  snapToGrid: boolean
  zoom: number
}

// Product selection wizard
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

// Design library
export interface LibraryDesign {
  id: string
  name: string
  category: string
  thumbnail: string
  url: string
  tags: string[]
}

// Preset positions
export type PresetPosition = 
  | 'center'
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

// History for undo/redo
export interface HistoryState {
  canvasState: CanvasState
  timestamp: number
}
