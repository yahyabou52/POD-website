import React, { useRef, useState } from "react";
// Use global fabric from CDN
import { useCustomizerStore } from "@/store/customizerStoreNew";
import { resizeImageFile, exportCanvasToPngDataUrl } from "@/utils/canvasHelpers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Upload, 
  Layers, 
  Download,
  Trash2,
  Plus,
  Undo2,
  Redo2,
  Type,
  Move3D,
  ZoomIn,
  ZoomOut
} from "lucide-react";

type FabricCanvas = any;
type FabricObject = any;

export default function ControlPanelFixed() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scaleValue, setScaleValue] = useState(100);
  const [rotateValue, setRotateValue] = useState(0);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);

  const {
    undoStack,
    redoStack,
    pushUndo,
    popUndo,
    popRedo,
    clearRedo,
    setExportedDataUrl
  } = useCustomizerStore();

  // Save current canvas state for undo/redo
  const saveState = () => {
    const canvas = (window as any).__fabricCanvas as FabricCanvas;
    if (!canvas) return;
    
    const state = canvas.toJSON();
    pushUndo(state);
    clearRedo();
  };

  // Handle undo action
  const handleUndo = () => {
    const canvas = (window as any).__fabricCanvas as FabricCanvas;
    if (!canvas) return;
    
    const currentState = canvas.toJSON();
    const previousState = popUndo();
    
    if (previousState) {
      pushUndo(currentState); // Push current state to redo
      canvas.loadFromJSON(previousState, canvas.renderAll.bind(canvas));
    }
  };

  // Handle redo action
  const handleRedo = () => {
    const canvas = (window as any).__fabricCanvas as FabricCanvas;
    if (!canvas) return;
    
    const currentState = canvas.toJSON();
    const nextState = popRedo();
    
    if (nextState) {
      pushUndo(currentState);
      canvas.loadFromJSON(nextState, canvas.renderAll.bind(canvas));
    }
  };

  // === UPLOAD FUNCTIONALITY ===
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    try {
      const resizedFile = await resizeImageFile(file, 2000);
      const dataUrl = URL.createObjectURL(resizedFile);
      
      const canvas = (window as any).__fabricCanvas as FabricCanvas;
      if (!canvas) return;

      fabric.Image.fromURL(dataUrl, (img: FabricObject) => {
        img.set({
          scaleX: 0.5,
          scaleY: 0.5,
          left: canvas.width / 2,
          top: canvas.height / 2,
          originX: 'center',
          originY: 'center',
        });
        
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        
        pushUndo(JSON.stringify(canvas.toJSON())); clearRedo();
      });
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // === ADD TEXT ===
  const handleAddText = () => {
    const canvas = (window as any).__fabricCanvas as FabricCanvas;
    if (!canvas) return;

    const text = new fabric.Textbox('Edit me', {
      left: canvas.width / 2,
      top: canvas.height / 2,
      originX: 'center',
      originY: 'center',
      fontSize: 24,
      fontFamily: 'Arial',
      fill: '#000000',
      width: 200,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    saveState();
  };

  // === TRANSFORM CONTROLS ===
  const handleScale = (value: number) => {
    const canvas = (window as any).__fabricCanvas as FabricCanvas;
    if (!canvas) return;

    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;

    const scale = value / 100;
    activeObj.set({ scaleX: scale, scaleY: scale });
    canvas.renderAll();
    setScaleValue(value);
  };

  const handleRotate = (value: number) => {
    const canvas = (window as any).__fabricCanvas as FabricCanvas;
    if (!canvas) return;

    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;

    activeObj.set({ angle: value });
    canvas.renderAll();
    setRotateValue(value);
  };

  const handlePositionX = (value: number) => {
    const canvas = (window as any).__fabricCanvas as FabricCanvas;
    if (!canvas) return;

    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;

    activeObj.set({ left: value });
    canvas.renderAll();
    setPositionX(value);
  };

  const handlePositionY = (value: number) => {
    const canvas = (window as any).__fabricCanvas as FabricCanvas;
    if (!canvas) return;

    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;

    activeObj.set({ top: value });
    canvas.renderAll();
    setPositionY(value);
  };

  // === LAYER CONTROLS ===
  const handleDeleteObject = () => {
    const canvas = (window as any).__fabricCanvas as FabricCanvas;
    if (!canvas) return;

    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;

    canvas.remove(activeObj);
    canvas.discardActiveObject();
    canvas.renderAll();
    saveState();
  };

  const clearAll = () => {
    const canvas = (window as any).__fabricCanvas as FabricCanvas;
    if (!canvas) return;

    canvas.getObjects().forEach((o: FabricObject) => canvas.remove(o));
    canvas.renderAll();
    saveState();
  };

  const bringToFront = () => {
    const canvas = (window as any).__fabricCanvas as FabricCanvas;
    if (!canvas) return;

    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;

    canvas.bringToFront(activeObj);
    canvas.renderAll();
  };

  const sendToBack = () => {
    const canvas = (window as any).__fabricCanvas as FabricCanvas;
    if (!canvas) return;

    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;

    canvas.sendToBack(activeObj);
    canvas.renderAll();
  };

  // === EXPORT ===
  const handleExport = async () => {
    const canvas = (window as any).__fabricCanvas as FabricCanvas;
    if (!canvas) return;

    try {
      const dataUrl = await exportCanvasToPngDataUrl(canvas);
      setExportedDataUrl(dataUrl);

      const link = document.createElement('a');
      link.download = 'custom-design.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // === ZOOM CONTROLS ===
  const zoomIn = () => {
    const canvas = (window as any).__fabricCanvas as FabricCanvas;
    if (!canvas) return;

    const zoom = canvas.getZoom();
    const newZoom = Math.min(zoom * 1.1, 3);
    canvas.setZoom(newZoom);
  };

  const zoomOut = () => {
    const canvas = (window as any).__fabricCanvas as FabricCanvas;
    if (!canvas) return;

    const zoom = canvas.getZoom();
    const newZoom = Math.max(zoom * 0.9, 0.1);
    canvas.setZoom(newZoom);
  };

  const resetZoom = () => {
    const canvas = (window as any).__fabricCanvas as FabricCanvas;
    if (!canvas) return;

    canvas.setZoom(1);
    canvas.absolutePan({ x: 0, y: 0 });
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Upload & Add Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={triggerFileUpload}
            className="w-full flex items-center gap-2"
            variant="outline"
          >
            <Upload className="w-4 h-4" />
            Upload Image
          </Button>
          
          <Button 
            onClick={handleAddText}
            className="w-full flex items-center gap-2"
            variant="outline"
          >
            <Type className="w-4 h-4" />
            Add Text
          </Button>
        </CardContent>
      </Card>

      {/* Transform Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Move3D className="w-5 h-5" />
            Transform
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Scale */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Scale: {scaleValue}%</label>
            <input
              type="range"
              min="10"
              max="300"
              value={scaleValue}
              onChange={(e) => handleScale(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Rotation */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rotation: {rotateValue}°</label>
            <input
              type="range"
              min="0"
              max="360"
              value={rotateValue}
              onChange={(e) => handleRotate(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Position X */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Position X: {positionX}</label>
            <input
              type="range"
              min="0"
              max="800"
              value={positionX}
              onChange={(e) => handlePositionX(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Position Y */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Position Y: {positionY}</label>
            <input
              type="range"
              min="0"
              max="800"
              value={positionY}
              onChange={(e) => handlePositionY(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Layer Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Layers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Button 
              onClick={bringToFront}
              size="sm"
              variant="outline"
              className="flex-1"
            >
              Bring Forward
            </Button>
            <Button 
              onClick={sendToBack}
              size="sm"
              variant="outline"
              className="flex-1"
            >
              Send Back
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleDeleteObject}
              size="sm"
              variant="destructive"
              className="flex-1 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </Button>
            <Button 
              onClick={clearAll}
              size="sm"
              variant="outline"
              className="flex-1"
            >
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Zoom Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Zoom</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Button onClick={zoomIn} size="sm" variant="outline" className="flex-1">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button onClick={resetZoom} size="sm" variant="outline" className="flex-1">
              Reset
            </Button>
            <Button onClick={zoomOut} size="sm" variant="outline" className="flex-1">
              <ZoomOut className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Undo/Redo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Button 
              onClick={handleUndo}
              size="sm"
              variant="outline"
              className="flex-1 flex items-center gap-1"
              disabled={undoStack.length === 0}
            >
              <Undo2 className="w-3 h-3" />
              Undo ({undoStack.length})
            </Button>
            <Button 
              onClick={handleRedo}
              size="sm"
              variant="outline"
              className="flex-1 flex items-center gap-1"
              disabled={redoStack.length === 0}
            >
              <Redo2 className="w-3 h-3" />
              Redo ({redoStack.length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleExport}
            className="w-full flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download PNG
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}