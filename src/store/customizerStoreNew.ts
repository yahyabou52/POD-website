import { create } from "zustand";

type CustomizerState = {
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
};

export const useCustomizerStore = create<CustomizerState>((set, get) => ({
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
}));