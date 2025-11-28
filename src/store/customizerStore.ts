import { create } from "zustand";

type Layer = {
  id: string;
  type: 'text' | 'image';
  name: string;
  object: any;
  properties?: any;
};

type CustomizerState = {
  // Export/Canvas data
  exportedDataUrl?: string | null;
  canvasJson?: any;
  undoStack: any[];
  redoStack: any[];
  setExportedDataUrl: (d?: string | null) => void;
  setCanvasJson: (j: any) => void;
  pushUndo: (state: any) => void;
  popUndo: () => any;
  pushRedo: (state: any) => void;
  popRedo: () => any;
  clearRedo: () => void;
  
  // Product selection
  selectedProduct: string;
  setSelectedProduct: (product: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  
  // Canvas
  canvas?: any;
  setCanvas: (canvas: any) => void;
  
  // Layers
  layers: Layer[];
  activeLayerId: string | null;
  addLayer: (layer: Layer) => void;
  removeLayer: (layerId: string) => void;
  updateLayer: (layerId: string, updates: Partial<Layer>) => void;
  clearLayers: () => void;
  setActiveLayerId: (layerId: string | null) => void;
  
  // Design management
  exportDesign: () => string | null;
  resetDesign: () => void;
};

export const useCustomizerStore = create<CustomizerState>((set, get) => ({
  // Export/Canvas data
  exportedDataUrl: null,
  canvasJson: null,
  undoStack: [],
  redoStack: [],
  setExportedDataUrl: (d) => set({ exportedDataUrl: d }),
  setCanvasJson: (j) => set({ canvasJson: j }),
  pushUndo: (state) => set((prev) => ({
    undoStack: [...prev.undoStack.slice(-19), state], // keep last 20 states
  })),
  popUndo: () => {
    const { undoStack } = get();
    if (undoStack.length === 0) return null;
    const lastState = undoStack[undoStack.length - 1];
    set({ undoStack: undoStack.slice(0, -1) });
    return lastState;
  },
  pushRedo: (state) => set((prev) => ({
    redoStack: [...prev.redoStack.slice(-19), state],
  })),
  popRedo: () => {
    const { redoStack } = get();
    if (redoStack.length === 0) return null;
    const lastState = redoStack[redoStack.length - 1];
    set({ redoStack: redoStack.slice(0, -1) });
    return lastState;
  },
  clearRedo: () => set({ redoStack: [] }),
  
  // Canvas
  canvas: undefined,
  setCanvas: (canvas) => set({ canvas }),
  
  // Product
  selectedProduct: 'tshirt',
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  selectedColor: '#ffffff',
  setSelectedColor: (color) => set({ selectedColor: color }),
  selectedSize: 'M',
  setSelectedSize: (size) => set({ selectedSize: size }),
  
  // Layers
  layers: [],
  addLayer: (layer) => set((state) => ({ 
    layers: [...state.layers, layer],
    activeLayerId: layer.id
  })),
  removeLayer: (layerId) => set((state) => {
    const layer = state.layers.find(l => l.id === layerId)
    if (layer && state.canvas) {
      state.canvas.remove(layer.object)
      state.canvas.renderAll()
    }
    return {
      layers: state.layers.filter(l => l.id !== layerId),
      activeLayerId: state.activeLayerId === layerId ? null : state.activeLayerId
    }
  }),
  updateLayer: (layerId, updates) => set((state) => ({
    layers: state.layers.map(layer => 
      layer.id === layerId ? { ...layer, ...updates } : layer
    )
  })),
  clearLayers: () => set((state) => {
    if (state.canvas) {
      state.canvas.clear()
      state.canvas.renderAll()
    }
    return { layers: [], activeLayerId: null }
  }),
  
  // Design properties
  activeLayerId: null,
  setActiveLayerId: (layerId) => set({ activeLayerId: layerId }),
  
  // Export
  exportDesign: () => {
    const { canvas } = get()
    if (!canvas) return null
    return canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    })
  },
  
  // Reset
  resetDesign: () => set((state) => {
    if (state.canvas) {
      state.canvas.clear()
      state.canvas.renderAll()
    }
    return {
      layers: [],
      activeLayerId: null
    }
  })
}))