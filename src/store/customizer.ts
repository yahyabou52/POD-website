import { create } from 'zustand'
import type { CanvasState, DesignElement, ProductSide, HistoryState, ProductSelection } from '@/types/customizer'
import { PRODUCT_TEMPLATES, calculatePresetPosition, getProductTemplate } from '@/config/productTemplates'

interface CustomizerStore extends CanvasState {
  // History
  history: HistoryState[]
  historyIndex: number
  
  // Actions
  setProductFromSelection: (selection: ProductSelection) => void
  setCurrentSide: (side: ProductSide) => void
  setSelectedColor: (color: string) => void
  setSelectedSize: (size: string) => void
  setGridEnabled: (enabled: boolean) => void
  setSnapToGrid: (enabled: boolean) => void
  setZoom: (zoom: number) => void
  
  // Design actions
  addDesign: (design: Omit<DesignElement, 'id' | 'zIndex'>) => void
  updateDesign: (id: string, updates: Partial<DesignElement>) => void
  deleteDesign: (id: string) => void
  selectElement: (id: string | null) => void
  setSelectedElement: (id: string | null) => void
  duplicateDesign: (id: string) => void
  bringToFront: (id: string) => void
  sendToBack: (id: string) => void
  
  // Preset positions
  moveToPreset: (id: string, position: string) => void
  
  // Copy/paste
  copyDesignToSide: (fromSide: ProductSide, toSide: ProductSide) => void
  
  // Undo/Redo
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  
  // Reset
  reset: () => void
  resetCurrentSide: () => void
  
  // Save state to history
  saveToHistory: () => void
}

const initialState: CanvasState = {
  productId: 'tshirt-regular-short',
  productType: 'tshirt',
  fitType: 'regular',
  sleeveType: 'short',
  currentSide: 'front',
  selectedColor: 'White',
  selectedSize: 'M',
  designs: {
    front: [],
    back: [],
    'left-sleeve': [],
    'right-sleeve': [],
    hood: [],
  },
  selectedElementId: null,
  gridEnabled: true,
  snapToGrid: true,
  zoom: 1,
}

export const useCustomizerStore = create<CustomizerStore>((set, get) => ({
  ...initialState,
  history: [{ canvasState: initialState, timestamp: Date.now() }],
  historyIndex: 0,

  setProductFromSelection: (selection: ProductSelection) => {
    const template = getProductTemplate(
      selection.productType!,
      selection.fitType,
      selection.sleeveType,
      selection.capType,
      selection.mugType
    )
    if (!template) return
    
    set({
      productId: template.id,
      productType: template.type,
      fitType: selection.fitType,
      sleeveType: selection.sleeveType,
      currentSide: selection.printArea || template.availableSides[0],
      selectedColor: selection.color || template.colors[0].name,
      selectedSize: selection.size || template.sizes[0],
      designs: {
        front: [],
        back: [],
        'left-sleeve': [],
        'right-sleeve': [],
        hood: [],
      },
      selectedElementId: null,
    })
    get().saveToHistory()
  },

  setCurrentSide: (side) => {
    set({ currentSide: side, selectedElementId: null })
  },

  setSelectedColor: (color) => {
    set({ selectedColor: color })
  },

  setSelectedSize: (size) => {
    set({ selectedSize: size })
  },

  setGridEnabled: (enabled) => {
    set({ gridEnabled: enabled })
  },

  setSnapToGrid: (enabled) => {
    set({ snapToGrid: enabled })
  },

  setZoom: (zoom) => {
    set({ zoom: Math.max(0.5, Math.min(2, zoom)) })
  },

  addDesign: (design) => {
    const state = get()
    const newId = `design-${Date.now()}-${Math.random()}`
    const currentDesigns = state.designs[state.currentSide]
    const maxZIndex = currentDesigns.reduce((max, d) => Math.max(max, d.zIndex), 0)

    const newDesign: DesignElement = {
      ...design,
      id: newId,
      zIndex: maxZIndex + 1,
    }

    set({
      designs: {
        ...state.designs,
        [state.currentSide]: [...currentDesigns, newDesign],
      },
      selectedElementId: newId,
    })
    get().saveToHistory()
  },

  updateDesign: (id, updates) => {
    const state = get()
    const currentDesigns = state.designs[state.currentSide]
    
    set({
      designs: {
        ...state.designs,
        [state.currentSide]: currentDesigns.map((d) =>
          d.id === id ? { ...d, ...updates } : d
        ),
      },
    })
    
    // Save to history for significant changes
    if (updates.x !== undefined || updates.y !== undefined || 
        updates.width !== undefined || updates.height !== undefined ||
        updates.rotation !== undefined || updates.scaleX !== undefined ||
        updates.locked !== undefined) {
      get().saveToHistory()
    }
  },

  deleteDesign: (id) => {
    const state = get()
    set({
      designs: {
        ...state.designs,
        [state.currentSide]: state.designs[state.currentSide].filter((d) => d.id !== id),
      },
      selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
    })
    get().saveToHistory()
  },

  selectElement: (id) => {
    set({ selectedElementId: id })
  },

  setSelectedElement: (id) => {
    set({ selectedElementId: id })
  },

  duplicateDesign: (id) => {
    const state = get()
    const design = state.designs[state.currentSide].find((d) => d.id === id)
    if (!design) return

    get().addDesign({
      ...design,
      x: design.x + 20,
      y: design.y + 20,
    })
  },

  bringToFront: (id) => {
    const state = get()
    const currentDesigns = state.designs[state.currentSide]
    const maxZIndex = currentDesigns.reduce((max, d) => Math.max(max, d.zIndex), 0)

    set({
      designs: {
        ...state.designs,
        [state.currentSide]: currentDesigns.map((d) =>
          d.id === id ? { ...d, zIndex: maxZIndex + 1 } : d
        ),
      },
    })
  },

  sendToBack: (id) => {
    const state = get()
    const currentDesigns = state.designs[state.currentSide]
    const minZIndex = currentDesigns.reduce((min, d) => Math.min(min, d.zIndex), 999)

    set({
      designs: {
        ...state.designs,
        [state.currentSide]: currentDesigns.map((d) =>
          d.id === id ? { ...d, zIndex: minZIndex - 1 } : d
        ),
      },
    })
  },

  moveToPreset: (id, position) => {
    const state = get()
    const design = state.designs[state.currentSide].find((d) => d.id === id)
    if (!design) return

    const product = PRODUCT_TEMPLATES[state.productId]
    const printArea = product.printAreas[state.currentSide]

    const newPos = calculatePresetPosition(position, printArea, design.width, design.height)

    get().updateDesign(id, newPos)
    get().saveToHistory()
  },

  copyDesignToSide: (fromSide, toSide) => {
    const state = get()
    const designsToCopy = state.designs[fromSide]

    set({
      designs: {
        ...state.designs,
        [toSide]: designsToCopy.map((d) => ({
          ...d,
          id: `design-${Date.now()}-${Math.random()}`,
        })),
      },
    })
    get().saveToHistory()
  },

  saveToHistory: () => {
    const state = get()
    const currentState: CanvasState = {
      productId: state.productId,
      productType: state.productType,
      currentSide: state.currentSide,
      selectedColor: state.selectedColor,
      selectedSize: state.selectedSize,
      designs: state.designs,
      selectedElementId: state.selectedElementId,
      gridEnabled: state.gridEnabled,
      snapToGrid: state.snapToGrid,
      zoom: state.zoom,
    }

    const newHistory = state.history.slice(0, state.historyIndex + 1)
    newHistory.push({ canvasState: currentState, timestamp: Date.now() })

    // Keep only last 50 history states
    if (newHistory.length > 50) {
      newHistory.shift()
    }

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    })
  },

  undo: () => {
    const state = get()
    if (!get().canUndo()) return

    const newIndex = state.historyIndex - 1
    const previousState = state.history[newIndex].canvasState

    set({
      ...previousState,
      historyIndex: newIndex,
    })
  },

  redo: () => {
    const state = get()
    if (!get().canRedo()) return

    const newIndex = state.historyIndex + 1
    const nextState = state.history[newIndex].canvasState

    set({
      ...nextState,
      historyIndex: newIndex,
    })
  },

  canUndo: () => {
    return get().historyIndex > 0
  },

  canRedo: () => {
    const state = get()
    return state.historyIndex < state.history.length - 1
  },

  reset: () => {
    set({
      ...initialState,
      productId: get().productId,
      productType: get().productType,
      fitType: get().fitType,
      sleeveType: get().sleeveType,
      selectedColor: get().selectedColor,
      selectedSize: get().selectedSize,
      designs: {
        front: [],
        back: [],
        'left-sleeve': [],
        'right-sleeve': [],
        hood: [],
      },
    })
    get().saveToHistory()
  },

  resetCurrentSide: () => {
    const state = get()
    set({
      designs: {
        ...state.designs,
        [state.currentSide]: [],
      },
      selectedElementId: null,
    })
    get().saveToHistory()
  },
}))
