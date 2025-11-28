import React, { useRef, useState } from "react";
// Use global fabric from CDN
import { useCustomizerStore } from "@/store/customizerStoreNew";
import { resizeImageFile, exportCanvasToPngDataUrl } from "@/utils/canvasHelpers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Upload, 
  RotateCcw, 
  FlipHorizontal, 
  FlipVertical, 
  Trash2, 
  Download,
  Undo,
  Redo,
  Type,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Target
} from "lucide-react";

export default function ControlPanel() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [scaleValue, setScaleValue] = useState(1);
  const [rotationValue, setRotationValue] = useState(0);
  
  const setExportedDataUrl = useCustomizerStore((s) => s.setExportedDataUrl);
  const popUndo = useCustomizerStore((s) => s.popUndo);
  const popRedo = useCustomizerStore((s) => s.popRedo);
  const pushUndo = useCustomizerStore((s) => s.pushUndo);
  const pushRedo = useCustomizerStore((s) => s.pushRedo);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    
    console.info("File selected:", f.name, "Size:", f.size);
    
    if (f.size > 3 * 1024 * 1024) {
      console.info("Large file - will resize");
    }
    
    try {
      const blob = await resizeImageFile(f, 2000);
      const dataUrl = URL.createObjectURL(blob);
      const canvas = (window as any).__fabricCanvas as any;
      if (!canvas) {
        alert("Canvas not initialized yet");
        return;
      }
      
      fabric.Image.fromURL(dataUrl, (img: any) => {
        img.set({
          left: canvas.getWidth() / 2,
          top: canvas.getHeight() / 2,
          originX: "center",
          originY: "center",
          selectable: true,
          hasControls: true,
          perPixelTargetFind: true,
        });
        img.scaleToWidth(canvas.getWidth() * 0.5);
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        
        console.info("Image added");
        
        // Save for undo
        pushUndo(canvas.toJSON(["selectable"]));
        
        URL.revokeObjectURL(dataUrl);
      }, { crossOrigin: "anonymous" } as any);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload image");
    }
  }

  function triggerUpload() {
    fileInputRef.current?.click();
  }

  function updateScale(value: number) {
    const canvas = (window as any).__fabricCanvas as any;
    const obj = canvas?.getActiveObject();
    if (!obj) return;
    
    obj.scale(value);
    canvas.requestRenderAll();
    setScaleValue(value);
    console.info("Scale updated to:", value);
  }

  function updateRotation(value: number) {
    const canvas = (window as any).__fabricCanvas as any;
    const obj = canvas?.getActiveObject();
    if (!obj) return;
    
    obj.rotate(value);
    canvas.requestRenderAll();
    setRotationValue(value);
    console.info("Rotation updated to:", value);
  }

  function bringForward() {
    const canvas = (window as any).__fabricCanvas as any;
    const obj = canvas?.getActiveObject();
    if (!obj) return;
    canvas.bringForward(obj);
    canvas.requestRenderAll();
    console.info("Brought forward");
  }

  function sendBack() {
    const canvas = (window as any).__fabricCanvas as any;
    const obj = canvas?.getActiveObject();
    if (!obj) return;
    canvas.sendBackwards(obj);
    canvas.requestRenderAll();
    console.info("Sent backward");
  }

  function flipHorizontal() {
    const canvas = (window as any).__fabricCanvas as any;
    const obj = canvas?.getActiveObject();
    if (!obj) return;
    obj.set("flipX", !obj.get("flipX"));
    canvas.requestRenderAll();
    console.info("Flipped horizontally");
  }

  function flipVertical() {
    const canvas = (window as any).__fabricCanvas as any;
    const obj = canvas?.getActiveObject();
    if (!obj) return;
    obj.set("flipY", !obj.get("flipY"));
    canvas.requestRenderAll();
    console.info("Flipped vertically");
  }

  function deleteObject() {
    const canvas = (window as any).__fabricCanvas as any;
    const obj = canvas?.getActiveObject();
    if (!obj) return;
    
    // Save state before deletion
    pushUndo(canvas.toJSON(["selectable"]));
    
    canvas.remove(obj);
    canvas.requestRenderAll();
    console.info("Object deleted");
  }

  function resetCanvas() {
    const canvas = (window as any).__fabricCanvas as any;
    if (!canvas) return;
    
    // Save state before reset
    pushUndo(canvas.toJSON(["selectable"]));
    
    canvas.getObjects().forEach((o: any) => canvas.remove(o));
    canvas.clear();
    canvas.renderAll();
    console.info("Canvas reset");
  }

  function addText() {
    const canvas = (window as any).__fabricCanvas as any;
    if (!canvas) return;
    
    const text = new fabric.Text('Edit this text', {
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
      originX: 'center',
      originY: 'center',
      fontFamily: 'Arial',
      fontSize: 40,
      fill: '#000000',
      selectable: true,
      hasControls: true,
    });
    
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    
    console.info("Text added");
    pushUndo(canvas.toJSON(["selectable"]));
  }

  function positionObject(where: "left" | "right" | "top" | "bottom" | "center") {
    const canvas = (window as any).__fabricCanvas as any;
    const obj = canvas?.getActiveObject();
    if (!obj) return;
    
    const padding = 20;
    switch (where) {
      case "left":
        obj.set({ left: padding, originX: "left" });
        break;
      case "right":
        obj.set({ left: canvas.getWidth() - padding, originX: "right" });
        break;
      case "top":
        obj.set({ top: padding, originY: "top" });
        break;
      case "bottom":
        obj.set({ top: canvas.getHeight() - padding, originY: "bottom" });
        break;
      case "center":
        obj.center();
        obj.setCoords();
        break;
    }
    canvas.requestRenderAll();
    console.info("Object positioned:", where);
  }

  function handleUndo() {
    const canvas = (window as any).__fabricCanvas as any;
    if (!canvas) return;
    
    const prevState = popUndo();
    if (prevState) {
      // Save current state to redo stack
      pushRedo(canvas.toJSON(["selectable"]));
      
      canvas.loadFromJSON(prevState, () => {
        canvas.renderAll();
        console.info("Undo performed");
      });
    }
  }

  function handleRedo() {
    const canvas = (window as any).__fabricCanvas as any;
    if (!canvas) return;
    
    const nextState = popRedo();
    if (nextState) {
      // Save current state to undo stack
      pushUndo(canvas.toJSON(["selectable"]));
      
      canvas.loadFromJSON(nextState, () => {
        canvas.renderAll();
        console.info("Redo performed");
      });
    }
  }

  function handleExport() {
    const canvas = (window as any).__fabricCanvas as any;
    if (!canvas) {
      console.error("Canvas not available for export");
      return;
    }
    
    console.info("Exporting canvas");
    const dataUrl = exportCanvasToPngDataUrl(canvas);
    setExportedDataUrl(dataUrl);
    
    // Also create a download for quick test:
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "design.png";
    a.click();
    
    console.info("Design exported");
    
    // For future: send to cart/backend
    // const blob = await (await fetch(dataUrl)).blob();
    // const form = new FormData();
    // form.append("file", blob, "design.png");
    // fetch('/api/upload', { method: 'POST', body: form });
  }

  return (
    <div className="space-y-6">
      {/* Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Design
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input 
            ref={fileInputRef} 
            onChange={handleFile} 
            type="file" 
            accept="image/*" 
            className="hidden" 
          />
          <Button onClick={triggerUpload} className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Choose Image
          </Button>
        </CardContent>
      </Card>

      {/* Transform Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Transform</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Scale (0.1x - 3x)</label>
            <Input
              type="range"
              min="0.1"
              max="3"
              step="0.01"
              value={scaleValue}
              onChange={(e) => updateScale(Number(e.target.value))}
              className="mt-1"
            />
            <span className="text-xs text-gray-500">{scaleValue.toFixed(2)}x</span>
          </div>
          
          <div>
            <label className="text-sm font-medium">Rotation (-180° to 180°)</label>
            <Input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={rotationValue}
              onChange={(e) => updateRotation(Number(e.target.value))}
              className="mt-1"
            />
            <span className="text-xs text-gray-500">{rotationValue}°</span>
          </div>
        </CardContent>
      </Card>

      {/* Position Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Position</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            <Button onClick={() => positionObject("top")} variant="outline" size="sm">
              <ArrowUp className="w-4 h-4" />
            </Button>
            <Button onClick={() => positionObject("center")} variant="outline" size="sm">
              <Target className="w-4 h-4" />
            </Button>
            <Button onClick={() => positionObject("bottom")} variant="outline" size="sm">
              <ArrowDown className="w-4 h-4" />
            </Button>
            <Button onClick={() => positionObject("left")} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div></div>
            <Button onClick={() => positionObject("right")} variant="outline" size="sm">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Layer Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Layers & Effects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <Button onClick={bringForward} variant="outline" size="sm" className="flex-1">
              ↑ Forward
            </Button>
            <Button onClick={sendBack} variant="outline" size="sm" className="flex-1">
              ↓ Backward
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={flipHorizontal} variant="outline" size="sm" className="flex-1">
              <FlipHorizontal className="w-4 h-4" />
            </Button>
            <Button onClick={flipVertical} variant="outline" size="sm" className="flex-1">
              <FlipVertical className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Elements */}
      <Card>
        <CardHeader>
          <CardTitle>Add Elements</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={addText} variant="outline" className="w-full">
            <Type className="w-4 h-4 mr-2" />
            Add Text
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <Button onClick={handleUndo} variant="outline" size="sm" className="flex-1">
              <Undo className="w-4 h-4 mr-1" />
              Undo
            </Button>
            <Button onClick={handleRedo} variant="outline" size="sm" className="flex-1">
              <Redo className="w-4 h-4 mr-1" />
              Redo
            </Button>
          </div>
          
          <Button onClick={deleteObject} variant="outline" className="w-full text-red-600">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected
          </Button>
          
          <Button onClick={resetCanvas} variant="outline" className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Canvas
          </Button>
          
          <Button onClick={handleExport} className="w-full bg-black text-white">
            <Download className="w-4 h-4 mr-2" />
            Export / Add to Cart
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
