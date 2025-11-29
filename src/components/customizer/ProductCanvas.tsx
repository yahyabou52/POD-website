import { useRef, useEffect } from 'react'
import { Rnd } from 'react-rnd'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Copy, ZoomIn, ZoomOut } from 'lucide-react'
import { useCustomizerStore } from '@/store/customizer'
import { PRODUCT_TEMPLATES } from '@/config/productTemplates'

export default function ProductCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  
  const {
    productId,
    currentSide,
    selectedColor,
    designs,
    selectedElementId,
    gridEnabled,
    snapToGrid,
    zoom,
    updateDesign,
    deleteDesign,
    selectElement,
    duplicateDesign,
    setZoom,
    saveToHistory,
  } = useCustomizerStore()

  const template = PRODUCT_TEMPLATES[productId]
  const printArea = template?.printAreas[currentSide]
  const currentDesigns = designs[currentSide] || []
  const selectedColorData = template?.colors.find((c) => c.name === selectedColor)

  const gridSize = 20

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedElementId) return

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        deleteDesign(selectedElementId)
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault()
        duplicateDesign(selectedElementId)
      } else if (e.key === 'Escape') {
        selectElement(null)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedElementId, deleteDesign, duplicateDesign, selectElement])

  if (!template || !printArea) {
    return (
      <div className="flex-1 flex items-center justify-center bg-mist">
        <p className="text-gray-500">No product selected</p>
      </div>
    )
  }

  const handleDragStop = (id: string, d: any) => {
    let newX = d.x
    let newY = d.y

    if (snapToGrid) {
      newX = Math.round(newX / gridSize) * gridSize
      newY = Math.round(newY / gridSize) * gridSize
    }

    // Boundary constraints
    const design = currentDesigns.find((d) => d.id === id)
    if (design) {
      newX = Math.max(printArea.x, Math.min(newX, printArea.x + printArea.width - design.width))
      newY = Math.max(printArea.y, Math.min(newY, printArea.y + printArea.height - design.height))
    }

    updateDesign(id, { x: newX, y: newY })
    saveToHistory()
  }

  const handleResizeStop = (id: string, ref: any, _delta: any, position: any) => {
    let newWidth = parseInt(ref.style.width)
    let newHeight = parseInt(ref.style.height)
    let newX = position.x
    let newY = position.y

    if (snapToGrid) {
      newWidth = Math.round(newWidth / gridSize) * gridSize
      newHeight = Math.round(newHeight / gridSize) * gridSize
      newX = Math.round(newX / gridSize) * gridSize
      newY = Math.round(newY / gridSize) * gridSize
    }

    // Boundary constraints
    newWidth = Math.min(newWidth, printArea.maxWidth)
    newHeight = Math.min(newHeight, printArea.maxHeight)
    newX = Math.max(printArea.x, Math.min(newX, printArea.x + printArea.width - newWidth))
    newY = Math.max(printArea.y, Math.min(newY, printArea.y + printArea.height - newHeight))

    updateDesign(id, { 
      x: newX, 
      y: newY, 
      width: newWidth, 
      height: newHeight 
    })
    saveToHistory()
  }

  return (
    <div className="flex-1 flex flex-col bg-mist">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold capitalize">
            {currentSide.replace('-', ' ')}
          </h3>
          <div className="text-sm text-gray-600">
            {printArea.width} × {printArea.height}px
          </div>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(zoom - 0.1)}
            disabled={zoom <= 0.5}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ZoomOut size={20} />
          </button>
          <span className="text-sm font-medium w-16 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(zoom + 0.1)}
            disabled={zoom >= 2}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ZoomIn size={20} />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
        <div
          ref={canvasRef}
          className="relative bg-white rounded-xl shadow-2xl"
          style={{
            width: printArea.canvasWidth,
            height: printArea.canvasHeight,
            transform: `scale(${zoom})`,
            transformOrigin: 'center',
          }}
          onClick={(e) => {
            if (e.target === canvasRef.current) {
              selectElement(null)
            }
          }}
        >
          {/* Product mockup background */}
          {selectedColorData?.image && (
            <img
              src={selectedColorData.image}
              alt={`${template.name} - ${selectedColor}`}
              className="absolute inset-0 w-full h-full object-cover rounded-xl pointer-events-none"
            />
          )}

          {/* Grid overlay */}
          {gridEnabled && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: printArea.x,
                top: printArea.y,
                width: printArea.width,
                height: printArea.height,
                backgroundImage: `
                  linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
                `,
                backgroundSize: `${gridSize}px ${gridSize}px`,
              }}
            />
          )}

          {/* Print area outline */}
          <div
            className="absolute border-2 border-dashed border-gold/30 pointer-events-none"
            style={{
              left: printArea.x,
              top: printArea.y,
              width: printArea.width,
              height: printArea.height,
            }}
          />

          {/* Design elements */}
          <AnimatePresence>
            {currentDesigns
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((design) => (
                <Rnd
                  key={design.id}
                  position={{ x: design.x, y: design.y }}
                  size={{ width: design.width, height: design.height }}
                  onDragStop={(_e, d) => handleDragStop(design.id, d)}
                  onResizeStop={(_e, _direction, ref, delta, position) =>
                    handleResizeStop(design.id, ref, delta, position)
                  }
                  onClick={() => selectElement(design.id)}
                  bounds="parent"
                  dragGrid={snapToGrid ? [gridSize, gridSize] : undefined}
                  resizeGrid={snapToGrid ? [gridSize, gridSize] : undefined}
                  lockAspectRatio={design.type === 'image'}
                  enableResizing={{
                    top: true,
                    right: true,
                    bottom: true,
                    left: true,
                    topRight: true,
                    bottomRight: true,
                    bottomLeft: true,
                    topLeft: true,
                  }}
                  className={`cursor-move ${
                    selectedElementId === design.id ? 'ring-2 ring-gold' : ''
                  }`}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="w-full h-full relative"
                  >
                    {design.type === 'image' && (
                      <img
                        src={design.src || 'https://via.placeholder.com/300x300/FFD700/000000?text=Design'}
                        alt="Design"
                        className="w-full h-full object-contain select-none"
                        draggable={false}
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement
                          target.src = 'https://via.placeholder.com/300x300/FFD700/000000?text=Design'
                        }}
                      />
                    )}
                    {design.type === 'text' && (
                      <div
                        className="w-full h-full flex items-center justify-center select-none text-2xl font-semibold"
                      >
                        Text (Coming Soon)
                      </div>
                    )}

                    {/* Quick actions */}
                    {selectedElementId === design.id && (
                      <div className="absolute -top-12 left-0 right-0 flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            duplicateDesign(design.id)
                          }}
                          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
                          title="Duplicate (Ctrl+D)"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteDesign(design.id)
                          }}
                          className="p-2 bg-white rounded-lg shadow-lg hover:bg-red-50 text-red-600 transition-colors"
                          title="Delete (Del)"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </motion.div>
                </Rnd>
              ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Info bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between text-sm text-gray-600">
        <div>
          {currentDesigns.length} design{currentDesigns.length !== 1 ? 's' : ''}
        </div>
        <div>
          {selectedElementId && (
            <>
              Selected: {currentDesigns.find((d) => d.id === selectedElementId)?.type}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
