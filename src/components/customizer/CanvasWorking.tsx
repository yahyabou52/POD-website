import { useEffect, useRef, useState } from 'react'
import { useCustomizerStore } from '@/store/customizerStore'
import { motion } from 'framer-motion'

// Import Fabric.js using dynamic import to avoid SSR issues
let fabric: any = null
if (typeof window !== 'undefined') {
  import('fabric').then(fabricModule => {
    fabric = fabricModule.fabric
  })
}

interface CanvasProps {
  className?: string
}

export default function CanvasWorking({ className }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [fabricCanvas, setFabricCanvas] = useState<any>(null)
  const [isReady, setIsReady] = useState(false)
  
  const {
    // selectedProduct,
    layers,
    addLayer,
    setCanvas
  } = useCustomizerStore()

  useEffect(() => {
    const initCanvas = async () => {
      if (!canvasRef.current) return
      
      try {
        // Wait for fabric to be loaded
        if (!fabric) {
          const fabricModule = await import('fabric')
          fabric = fabricModule.fabric
        }
        
        // Initialize Fabric canvas
        const canvas = new fabric.Canvas(canvasRef.current, {
          width: 600,
          height: 600,
          backgroundColor: '#ffffff'
        })
        
        setFabricCanvas(canvas)
        setCanvas(canvas)
        setIsReady(true)
        
        // Expose canvas globally for control panel access
        ;(window as any).fabricCanvas = canvas
        
        // Enable drag and drop
        canvas.on('drop', handleDrop)
        
        return canvas
      } catch (error) {
        console.error('Failed to initialize canvas:', error)
      }
    }
    
    initCanvas()
    
    return () => {
      if (fabricCanvas) {
        fabricCanvas.dispose()
      }
    }
  }, [])

  const handleDrop = (e: any) => {
    e.preventDefault()
    if (!fabricCanvas) return
    
    const files = e.dataTransfer?.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        addImageToCanvas(file)
      }
    }
  }
  
  const addImageToCanvas = (file: File) => {
    if (!fabricCanvas || !fabric) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const imgUrl = e.target?.result as string
      
      fabric.Image.fromURL(imgUrl, (img: any) => {
        // Scale image to fit nicely
        const maxWidth = 200
        const maxHeight = 200
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height)
        
        img.set({
          left: 200,
          top: 200,
          scaleX: scale,
          scaleY: scale,
          selectable: true,
          moveable: true
        })
        
        fabricCanvas.add(img)
        fabricCanvas.setActiveObject(img)
        fabricCanvas.renderAll()
        
        // Add to store
        addLayer({
          id: Date.now().toString(),
          type: 'image',
          object: img,
          name: file.name
        })
      })
    }
    reader.readAsDataURL(file)
  }
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }
  
  // Expose addImageToCanvas for use by control panel
  useEffect(() => {
    if (fabricCanvas && isReady) {
      (window as any).addImageToCanvas = addImageToCanvas
    }
  }, [fabricCanvas, isReady])

  if (!isReady) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded-lg min-h-[600px]`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading canvas...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${className} bg-white rounded-lg shadow-lg p-6`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
    >
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border border-gray-200 rounded-lg w-full max-w-full"
        />
        
        {/* Drag and drop overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full border-2 border-dashed border-transparent hover:border-blue-300 transition-colors duration-200 rounded-lg flex items-center justify-center">
            {layers.length === 0 && (
              <div className="text-center text-gray-400">
                <div className="mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm font-medium">Drag & Drop Images Here</p>
                <p className="text-xs">or use the upload button</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}