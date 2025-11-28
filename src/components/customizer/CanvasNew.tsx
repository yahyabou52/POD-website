import { useEffect, useRef } from "react";
// Use global fabric from CDN
import { useCustomizerStore } from "@/store/customizerStoreNew";
import { resizeImageFile } from "@/utils/canvasHelpers";

type Props = {
  productMockupUrl?: string; // optional background mockup
  canvasId?: string;
  width?: number; // desired canvas width in px
  height?: number;
  className?: string;
};

export default function Canvas({ 
  // productMockupUrl, 
  canvasId = "prod-canvas", 
  width = 800, 
  height = 800, 
  className 
}: Props) {
  const canvasRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // const setExportedDataUrl = useCustomizerStore((s) => s.setExportedDataUrl);
  const setCanvasJson = useCustomizerStore((s) => s.setCanvasJson);
  const pushUndo = useCustomizerStore((s) => s.pushUndo);
  const clearRedo = useCustomizerStore((s) => s.clearRedo);

  useEffect(() => {
    console.info("Initializing Fabric.js Canvas");
    
    const canvas = new fabric.Canvas(canvasId, {
      backgroundColor: "transparent",
      preserveObjectStacking: true,
      selection: true,
      allowTouchScrolling: true,
    });
    canvasRef.current = canvas;

    // responsive: fit to container
    function resize() {
      const container = containerRef.current;
      if (!container || !canvasRef.current) return;
      const ratio = container.clientWidth / width;
      canvasRef.current.setWidth(width * ratio);
      canvasRef.current.setHeight(height * ratio);
      canvasRef.current.calcOffset();
      canvasRef.current.renderAll();
    }
    window.addEventListener("resize", resize);
    resize();

    // Save state for undo/redo after object modifications
    canvas.on("object:modified", () => {
      console.info("Object modified - saving state");
      const json = canvas.toJSON(["selectable"]);
      setCanvasJson(json);
      pushUndo(json);
      clearRedo(); // Clear redo stack when new action is performed
    });

    // Mobile/Touch support
    canvas.on('touch:gesture', function() {
      console.info("Touch gesture detected");
      // Fabric handles basic gestures, but we can add custom logic here
    });

    // Drag and drop support
    function handleDragOver(e: DragEvent) {
      e.preventDefault();
      e.stopPropagation();
    }

    function handleDrop(e: DragEvent) {
      e.preventDefault();
      e.stopPropagation();
      
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
          console.info("Image dropped:", file.name);
          handleImageUpload(file);
        }
      }
    }

    async function handleImageUpload(file: File) {
      try {
        if (file.size > 3 * 1024 * 1024) {
          console.info("Large file detected, resizing...");
        }
        
        const blob = await resizeImageFile(file, 2000);
        const dataUrl = URL.createObjectURL(blob);
        
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
          
          console.info("Image added to canvas");
          
          // Save state for undo
          const json = canvas.toJSON(["selectable"]);
          pushUndo(json);
          
          URL.revokeObjectURL(dataUrl);
        }, { crossOrigin: "anonymous" } as any);
      } catch (err) {
        console.error("Failed to upload image:", err);
        alert("Failed to upload image");
      }
    }

    const canvasElement = canvas.getElement();
    canvasElement.addEventListener('dragover', handleDragOver);
    canvasElement.addEventListener('drop', handleDrop);

    // clean up
    return () => {
      console.info("Cleaning up canvas");
      window.removeEventListener("resize", resize);
      canvasElement.removeEventListener('dragover', handleDragOver);
      canvasElement.removeEventListener('drop', handleDrop);
      canvas.dispose();
      canvasRef.current = null;
    };
  }, [canvasId, height, width, setCanvasJson, pushUndo, clearRedo]);

  // Expose functions for ControlPanel
  useEffect(() => {
    (window as any).__fabricCanvas = canvasRef.current;
    return () => {
      delete (window as any).__fabricCanvas;
    };
  }, []);

  return (
    <div ref={containerRef} className={`w-full h-full flex items-center justify-center ${className || ''}`}>
      <canvas id={canvasId} />
      {/* Note: keep the design and wrapper as existing UI. */}
    </div>
  );
}