import { useEffect, useRef, useState } from 'react'
// Use global fabric from CDN
import { useCustomizerStore } from '@/store/customizerStore'
import { motion } from 'framer-motion'

const productMockups = {
  tshirt: '/src/assets/tshirt-placeholder.svg',
  hoodie: '/src/assets/hoodie-placeholder.svg',
  cap: '/src/assets/cap-placeholder.svg',
  mug: '/src/assets/mug-placeholder.svg'
}

interface CanvasProps {
  className?: string
}

export default function Canvas({ className }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const { 
    canvas, 
    setCanvas, 
    selectedProduct, 
    addLayer, 
    setActiveLayerId,
    layers
  } = useCustomizerStore()

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 400,
      height: 500,
      backgroundColor: '#f8f9fa',
      selection: true,
      preserveObjectStacking: true
    })

    // Enable object controls
    fabricCanvas.on('selection:created', (e: any) => {
      const activeObject = e.selected?.[0]
      if (activeObject) {
        const layer = layers.find(l => l.object === activeObject)
        if (layer) {
          setActiveLayerId(layer.id)
        }
      }
    })

    fabricCanvas.on('selection:cleared', () => {
      setActiveLayerId(null)
    })

    setCanvas(fabricCanvas)
    setIsLoading(false)

    return () => {
      fabricCanvas.dispose()
      setCanvas(null)
    }
  }, [])

  // Load product mockup
  useEffect(() => {
    if (!canvas) return

    const mockupUrl = productMockups[selectedProduct as keyof typeof productMockups]
    
    fabric.loadSVGFromURL(mockupUrl, (objects: any, options: any) => {
      const mockupGroup = fabric.util.groupSVGElements(objects, options)
      
      // Scale and position mockup
      mockupGroup.set({
        left: canvas.width! / 2,
        top: canvas.height! / 2,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
        opacity: 0.3,
        scaleX: 1.2,
        scaleY: 1.2
      })

      // Remove existing mockup
      const existingMockup = canvas.getObjects().find((obj: any) => obj.name === 'productMockup')
      if (existingMockup) {
        canvas.remove(existingMockup)
      }

      mockupGroup.name = 'productMockup'
      canvas.add(mockupGroup)
      mockupGroup.sendToBack()
      canvas.renderAll()
    })
  }, [canvas, selectedProduct])

  // Handle drag and drop
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    if (!canvas) return

    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))

    for (const file of imageFiles) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        
        fabric.Image.fromURL(imageUrl, (img: any) => {
          // Scale image to fit canvas
          const maxWidth = canvas.width! * 0.4
          const maxHeight = canvas.height! * 0.4
          
          const scale = Math.min(maxWidth / img.width!, maxHeight / img.height!)
          
          img.set({
            left: canvas.width! / 2,
            top: canvas.height! / 2,
            originX: 'center',
            originY: 'center',
            scaleX: scale,
            scaleY: scale,
            cornerSize: 10,
            transparentCorners: false,
            cornerColor: '#2563eb',
            cornerStrokeColor: '#1d4ed8',
            borderColor: '#3b82f6',
            rotatingPointOffset: 30
          })

          canvas.add(img)
          canvas.setActiveObject(img)
          canvas.renderAll()

          // Add to store
          const layerId = `layer-${Date.now()}`
          addLayer({
            id: layerId,
            type: 'image',
            object: img,
            name: `Image ${layers.length + 1}`
          })
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-2xl ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden ${className}`}
    >
      {/* Canvas Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Design Canvas</h3>
          <div className="text-sm text-gray-500">
            {selectedProduct.charAt(0).toUpperCase() + selectedProduct.slice(1)}
          </div>
        </div>
      </div>

      {/* Canvas Container */}
      <div 
        className="p-6 flex items-center justify-center min-h-[500px] relative"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <canvas ref={canvasRef} className="border border-gray-300 rounded-lg shadow-sm" />
        
        {/* Drop overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg opacity-0 transition-opacity duration-200 hover:opacity-100 flex items-center justify-center">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-2 text-sm font-medium text-gray-600">Drop images here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Footer */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Layers: {layers.length}</span>
          <span>400 × 500px</span>
        </div>
      </div>
    </motion.div>
  )
}