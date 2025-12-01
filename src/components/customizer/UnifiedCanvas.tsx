import { useEffect, useRef, useState } from 'react';
import { useCustomizerStore } from '@/store/customizer';
import { motion } from 'framer-motion';
import { PRODUCT_TEMPLATES } from '@/config/productTemplates';

const UnifiedCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    productId,
    currentSide,
    designs,
    addDesign,
    updateDesign,
    deleteDesign,
    zoom,
    setZoom,
    gridEnabled,
    snapToGrid,
  } = useCustomizerStore();

  const product = PRODUCT_TEMPLATES[productId];
  const printArea = product?.printAreas[currentSide];

  useEffect(() => {
    if (!canvasRef.current || !product) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: printArea.width,
      height: printArea.height,
      backgroundColor: 'white',
      selection: true,
    });

    // Add grid logic
    if (gridEnabled) {
      const gridSize = 20;
      for (let i = 0; i < canvas.width; i += gridSize) {
        canvas.add(new fabric.Line([i, 0, i, canvas.height], { stroke: '#ccc', selectable: false }));
      }
      for (let j = 0; j < canvas.height; j += gridSize) {
        canvas.add(new fabric.Line([0, j, canvas.width, j], { stroke: '#ccc', selectable: false }));
      }
    }

    // Drag and drop logic
    canvas.on('drop', (e) => {
      const files = e.e.dataTransfer.files;
      if (files.length > 0) {
        const reader = new FileReader();
        reader.onload = (event) => {
          fabric.Image.fromURL(event.target.result as string, (img) => {
            img.set({
              left: canvas.width / 2,
              top: canvas.height / 2,
              originX: 'center',
              originY: 'center',
            });
            canvas.add(img);
            addDesign({ id: Date.now().toString(), object: img });
          });
        };
        reader.readAsDataURL(files[0]);
      }
    });

    return () => {
      canvas.dispose();
    };
  }, [canvasRef, product, gridEnabled]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative bg-gray-100 rounded-lg shadow-md"
    >
      <canvas ref={canvasRef} />
    </motion.div>
  );
};

export default UnifiedCanvas;