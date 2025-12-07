import { create } from "zustand";
import type { ProductSide } from "@/types/customizer";

type Layer = {
  id: string;
  type: 'text' | 'image';
  name: string;
  object: any;
  properties?: any;
};

// NEW: Zone-based placement system
export interface ZonePlacement {
  imageUrl: string;
  file: File;
}

// T4-A: Placement interface for multi-placement support (legacy)
export interface Placement {
  id: string;
  designId: string; // Reference to the design image
  zone: string; // Preset zone like 'topLeft', 'fullCenter', etc.
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  rotation?: number;
}

// T4-A: Per-side placements storage (legacy)
export type PlacementsBySide = {
  front: Placement[];
  back: Placement[];
  'left-sleeve': Placement[];
  'right-sleeve': Placement[];
  hood: Placement[];
}

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
  
  // NEW: Zone-based system
  productSide: 'front' | 'back';
  setProductSide: (side: 'front' | 'back') => void;
  zonePlacements: Record<string, ZonePlacement | null>;
  setZonePlacement: (zoneId: string, placement: ZonePlacement) => void;
  removeZonePlacement: (zoneId: string) => void;
  clearAllZones: () => void;
  
  // Show/Hide print areas toggle
  showPrintAreas: boolean;
  togglePrintAreas: () => void;
  
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
  
  // T4-A: Multi-placement support (legacy - keep for backward compatibility)
  placements: PlacementsBySide;
  activePlacementId: string | null;
  addPlacement: (side: ProductSide, designId: string, zone: string, props: Partial<Placement>) => string;
  updatePlacement: (id: string, updates: Partial<Placement>) => void;
  removePlacement: (id: string) => void;
  setActivePlacement: (id: string | null) => void;
  clearPlacementsForSide: (side: ProductSide) => void;
  getPlacementsForSide: (side: ProductSide) => Placement[];
  getPlacementById: (id: string) => Placement | null;
  // T4-B: Additional placement actions for sidebar
  duplicatePlacement: (id: string) => string | null;
  reorderPlacement: (id: string, direction: 'up' | 'down') => void;
  
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
  
  // NEW: Zone-based system
  productSide: 'front',
  setProductSide: (side) => set({ productSide: side }),
  zonePlacements: {},
  setZonePlacement: (zoneId, placement) => set((state) => ({
    zonePlacements: { ...state.zonePlacements, [zoneId]: placement }
  })),
  removeZonePlacement: (zoneId) => set((state) => ({
    zonePlacements: { ...state.zonePlacements, [zoneId]: null }
  })),
  clearAllZones: () => set({ zonePlacements: {} }),
  
  // Show/Hide print areas toggle
  showPrintAreas: true,
  togglePrintAreas: () => set((state) => ({ showPrintAreas: !state.showPrintAreas })),
  
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
  
  // T4-A: Multi-placement state and actions
  placements: {
    front: [],
    back: [],
    'left-sleeve': [],
    'right-sleeve': [],
    hood: []
  },
  activePlacementId: null,
  
  addPlacement: (side, designId, zone, props) => {
    const id = `placement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newPlacement: Placement = {
      id,
      designId,
      zone,
      x: props.x || 0,
      y: props.y || 0,
      width: props.width || 100,
      height: props.height || 100,
      scale: props.scale || 1,
      rotation: props.rotation || 0,
    };
    
    set((state) => ({
      placements: {
        ...state.placements,
        [side]: [...state.placements[side], newPlacement]
      },
      activePlacementId: id
    }));
    
    return id;
  },
  
  updatePlacement: (id, updates) => {
    set((state) => {
      const updatedPlacements = { ...state.placements };
      
      // Find which side contains this placement
      for (const side in updatedPlacements) {
        const sideKey = side as ProductSide;
        const index = updatedPlacements[sideKey].findIndex(p => p.id === id);
        
        if (index !== -1) {
          updatedPlacements[sideKey] = [
            ...updatedPlacements[sideKey].slice(0, index),
            { ...updatedPlacements[sideKey][index], ...updates },
            ...updatedPlacements[sideKey].slice(index + 1)
          ];
          break;
        }
      }
      
      return { placements: updatedPlacements };
    });
  },
  
  removePlacement: (id) => {
    set((state) => {
      const updatedPlacements = { ...state.placements };
      
      // Find and remove placement from its side
      for (const side in updatedPlacements) {
        const sideKey = side as ProductSide;
        updatedPlacements[sideKey] = updatedPlacements[sideKey].filter(p => p.id !== id);
      }
      
      return {
        placements: updatedPlacements,
        activePlacementId: state.activePlacementId === id ? null : state.activePlacementId
      };
    });
  },
  
  setActivePlacement: (id) => set({ activePlacementId: id }),
  
  clearPlacementsForSide: (side) => {
    set((state) => ({
      placements: {
        ...state.placements,
        [side]: []
      },
      activePlacementId: null
    }));
  },
  
  getPlacementsForSide: (side) => {
    return get().placements[side] || [];
  },
  
  getPlacementById: (id) => {
    const { placements } = get();
    
    for (const side in placements) {
      const sideKey = side as ProductSide;
      const placement = placements[sideKey].find(p => p.id === id);
      if (placement) return placement;
    }
    
    return null;
  },
  
  // T4-B: Duplicate placement with new ID
  duplicatePlacement: (id) => {
    const { placements } = get();
    
    // Find the placement
    for (const side in placements) {
      const sideKey = side as ProductSide;
      const original = placements[sideKey].find(p => p.id === id);
      
      if (original) {
        // Create duplicate with new ID
        const newId = `placement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const duplicate: Placement = {
          ...original,
          id: newId,
          // Offset position slightly
          x: original.x + 10,
          y: original.y + 10
        };
        
        set((state) => ({
          placements: {
            ...state.placements,
            [sideKey]: [...state.placements[sideKey], duplicate]
          },
          activePlacementId: newId
        }));
        
        return newId;
      }
    }
    
    return null;
  },
  
  // T4-B: Reorder placement in array (affects z-index)
  reorderPlacement: (id, direction) => {
    set((state) => {
      const updatedPlacements = { ...state.placements };
      
      // Find which side contains this placement
      for (const side in updatedPlacements) {
        const sideKey = side as ProductSide;
        const index = updatedPlacements[sideKey].findIndex(p => p.id === id);
        
        if (index !== -1) {
          const placements = [...updatedPlacements[sideKey]];
          
          if (direction === 'up' && index > 0) {
            // Move up (swap with previous)
            [placements[index - 1], placements[index]] = [placements[index], placements[index - 1]];
          } else if (direction === 'down' && index < placements.length - 1) {
            // Move down (swap with next)
            [placements[index], placements[index + 1]] = [placements[index + 1], placements[index]];
          }
          
          updatedPlacements[sideKey] = placements;
          break;
        }
      }
      
      return { placements: updatedPlacements };
    });
  },
  
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
      activeLayerId: null,
      placements: {
        front: [],
        back: [],
        'left-sleeve': [],
        'right-sleeve': [],
        hood: []
      },
      activePlacementId: null
    }
  })
}))