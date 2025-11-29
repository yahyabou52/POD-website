import { useRef, useEffect, useState } from 'react'
import { useCustomizerStore } from '@/store/customizer'
import { PRODUCT_TEMPLATES, GRID_SIZE, snapToGrid as snapToGridHelper } from '@/config/productTemplates'
import type { DesignElement } from '@/types/customizer'
import { ZoomIn, ZoomOut, Grid3x3, Maximize2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 600

type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se' | null

export default function EnhancedProductCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle>(null)
  const [initialState, setInitialState] = useState({ 
    width: 0, height: 0, x: 0, y: 0,
    mouseX: 0, mouseY: 0
  })

  const {
    productId,
    currentSide,
    selectedColor,
    designs,
    selectedElementId,
    gridEnabled,
    snapToGrid: snapEnabled,
    zoom,
    setZoom,
    selectElement,
    updateDesign,
    saveToHistory,
  } = useCustomizerStore()

  const product = PRODUCT_TEMPLATES[productId]
  const currentDesigns = designs[currentSide]
  const printArea = product.printAreas[currentSide]
  const selectedColorData = product.colors.find((c) => c.name === selectedColor) || product.colors[0]

  // Handle file drop
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter((file) => file.type.startsWith('image/'))

    imageFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const maxWidth = printArea.maxWidth
          const maxHeight = printArea.maxHeight
          
          let width = img.width
          let height = img.height
          
          if (width > maxWidth || height > maxHeight) {
            const scale = Math.min(maxWidth / width, maxHeight / height)
            width = width * scale
            height = height * scale
          }

          useCustomizerStore.getState().addDesign({
            type: 'image',
            src: event.target?.result as string,
            x: printArea.x + 20,
            y: printArea.y + 20,
            width,
            height,
            scaleX: 1,
            scaleY: 1,
            locked: false,
          })
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  // Mouse down on design element (drag)
  const handleMouseDown = (e: React.MouseEvent, design: DesignElement) => {
    if (design.locked) return
    
    e.stopPropagation()
    
    // Always select the element first
    selectElement(design.id)
    
    // Only start dragging if we're clicking on the image itself, not on handles
    const target = e.target as HTMLElement
    if (target.closest('.resize-handle') || target.closest('.rotate-handle')) {
      return
    }
    
    setIsDragging(true)
    setDraggedId(design.id)

    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      const x = (e.clientX - rect.left) / zoom
      const y = (e.clientY - rect.top) / zoom
      setDragOffset({
        x: x - design.x,
        y: y - design.y,
      })
    }
  }

  // Mouse down on resize handle
  const handleResizeStart = (e: React.MouseEvent, design: DesignElement, handle: ResizeHandle) => {
    if (design.locked) return
    
    e.stopPropagation()
    setIsResizing(true)
    setResizeHandle(handle)
    setDraggedId(design.id)
    
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      setInitialState({
        width: design.width,
        height: design.height,
        x: design.x,
        y: design.y,
        mouseX: (e.clientX - rect.left) / zoom,
        mouseY: (e.clientY - rect.top) / zoom,
      })
    }
  }

  // Mouse move handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current || !draggedId) return
      
      const rect = canvasRef.current.getBoundingClientRect()
      const currentX = (e.clientX - rect.left) / zoom
      const currentY = (e.clientY - rect.top) / zoom

      // Handle dragging
      if (isDragging) {
        let x = currentX - dragOffset.x
        let y = currentY - dragOffset.y

        if (snapEnabled) {
          x = snapToGridHelper(x)
          y = snapToGridHelper(y)
        }

        const design = currentDesigns.find((d) => d.id === draggedId)
        if (design) {
          x = Math.max(printArea.x, Math.min(x, printArea.x + printArea.width - design.width))
          y = Math.max(printArea.y, Math.min(y, printArea.y + printArea.height - design.height))
        }

        updateDesign(draggedId, { x, y })
      }

      // Handle resizing
      if (isResizing && resizeHandle) {
        const deltaX = currentX - initialState.mouseX
        const deltaY = currentY - initialState.mouseY

        let newWidth = initialState.width
        let newHeight = initialState.height
        let newX = initialState.x
        let newY = initialState.y

        switch (resizeHandle) {
          case 'se': // Bottom-right
            newWidth = initialState.width + deltaX
            newHeight = initialState.height + deltaY
            break
          case 'sw': // Bottom-left
            newWidth = initialState.width - deltaX
            newHeight = initialState.height + deltaY
            newX = initialState.x + deltaX
            break
          case 'ne': // Top-right
            newWidth = initialState.width + deltaX
            newHeight = initialState.height - deltaY
            newY = initialState.y + deltaY
            break
          case 'nw': // Top-left
            newWidth = initialState.width - deltaX
            newHeight = initialState.height - deltaY
            newX = initialState.x + deltaX
            newY = initialState.y + deltaY
            break
        }

        // Maintain minimum size
        newWidth = Math.max(30, newWidth)
        newHeight = Math.max(30, newHeight)

        updateDesign(draggedId, {
          width: newWidth,
          height: newHeight,
          x: newX,
          y: newY,
        })
      }
    }

    const handleMouseUp = () => {
      if (isDragging || isResizing) {
        setIsDragging(false)
        setIsResizing(false)
        setDraggedId(null)
        setResizeHandle(null)
        saveToHistory()
      }
    }

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, draggedId, dragOffset, zoom, snapEnabled, currentDesigns, printArea, resizeHandle, initialState])

  // Zoom controls
  const handleZoomIn = () => setZoom(zoom + 0.1)
  const handleZoomOut = () => setZoom(zoom - 0.1)
  const handleResetZoom = () => setZoom(1)

  return (
    <div className="relative bg-white rounded-2xl border border-mist shadow-md p-6 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-mist">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-onyx">
            {product.name} - {currentSide.charAt(0).toUpperCase() + currentSide.slice(1)}
          </span>
          <div 
            className="w-6 h-6 rounded-full border-2 border-graphite shadow-sm" 
            style={{ backgroundColor: selectedColorData?.hex }} 
          />
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            className="p-2 hover:bg-mist rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 text-graphite" />
          </button>
          <span className="text-sm text-graphite font-medium min-w-[50px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoom >= 2}
            className="p-2 hover:bg-mist rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4 text-graphite" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-2 hover:bg-mist rounded-lg transition-colors ml-2"
            title="Reset Zoom"
          >
            <Maximize2 className="w-4 h-4 text-graphite" />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex items-center justify-center min-h-[600px] bg-gradient-to-br from-mist/30 to-white rounded-xl overflow-hidden">
        <div
          ref={canvasRef}
          className="relative select-none"
          style={{
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            transform: `scale(${zoom})`,
            transformOrigin: 'center',
            transition: isDragging || isResizing ? 'none' : 'transform 0.2s ease',
          }}
          onDrop={handleFileDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => selectElement(null)}
        >
          {/* Product Template Background */}
          <div className="absolute inset-0 bg-white">
            <div className="w-full h-full flex items-center justify-center text-graphite/20">
              <div className="text-center">
                <div className="text-6xl mb-2">
                  {product.type === 'tshirt' ? '👕' : 
                   product.type === 'hoodie' ? '🧥' : 
                   product.type === 'cap' ? '🧢' : '☕'}
                </div>
                <div className="text-sm">{currentSide.toUpperCase()}</div>
              </div>
            </div>
          </div>

          {/* Grid Overlay */}
          {gridEnabled && (
            <svg
              className="absolute inset-0 pointer-events-none"
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
            >
              <defs>
                <pattern
                  id="grid"
                  width={GRID_SIZE}
                  height={GRID_SIZE}
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`}
                    fill="none"
                    stroke="rgba(0,0,0,0.05)"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="url(#grid)" />
            </svg>
          )}

          {/* Print Area Outline */}
          {printArea.width > 0 && printArea.height > 0 && (
            <div
              className="absolute border-2 border-dashed border-gold/40 pointer-events-none rounded-lg"
              style={{
                left: printArea.x,
                top: printArea.y,
                width: printArea.width,
                height: printArea.height,
              }}
            >
              <div className="absolute -top-6 left-0 text-xs text-gold font-medium">
                Print Area
              </div>
            </div>
          )}

          {/* Design Elements */}
          <AnimatePresence>
            {currentDesigns
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((design) => {
                const isSelected = selectedElementId === design.id
                
                return (
                  <motion.div
                    key={design.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`absolute group ${
                      design.locked ? 'cursor-not-allowed' : 'cursor-move'
                    }`}
                    style={{
                      left: design.x,
                      top: design.y,
                      width: design.width,
                      height: design.height,
                      transform: `scaleX(${design.scaleX}) scaleY(${design.scaleY})`,
                      transformOrigin: 'center center',
                      willChange: 'transform',
                      zIndex: design.zIndex,
                    }}
                    onMouseDown={(e) => handleMouseDown(e, design)}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!design.locked) {
                        selectElement(design.id)
                      }
                    }}
                  >
                    {design.type === 'image' && design.src && (
                      <img
                        src={design.src}
                        alt="Design"
                        className="w-full h-full object-contain select-none"
                        draggable={false}
                      />
                    )}

                    {/* Selection Border & Controls */}
                    {isSelected && !design.locked && (
                      <div className="absolute inset-0">
                        {/* Border */}
                        <div className="absolute inset-0 border-2 border-royal rounded pointer-events-none" />
                        
                        {/* Corner Resize Handles */}
                        {(['nw', 'ne', 'sw', 'se'] as ResizeHandle[]).map((handle) => {
                          const positions = {
                            nw: '-top-2 -left-2',
                            ne: '-top-2 -right-2',
                            sw: '-bottom-2 -left-2',
                            se: '-bottom-2 -right-2',
                          }
                          
                          return (
                            <div
                              key={handle}
                              className={`resize-handle absolute w-4 h-4 bg-white border-2 border-royal rounded-full cursor-${handle}-resize hover:scale-125 transition-transform ${positions[handle!]}`}
                              onMouseDown={(e) => handleResizeStart(e, design, handle)}
                            />
                          )
                        })}
                      </div>
                    )}

                    {/* Locked Indicator */}
                    {design.locked && (
                      <div className="absolute top-1 right-1 bg-onyx/70 text-white px-2 py-1 rounded text-xs">
                        🔒
                      </div>
                    )}
                  </motion.div>
                )
              })}
          </AnimatePresence>

          {/* Drop Zone Hint */}
          {currentDesigns.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-graphite/40">
                <div className="text-4xl mb-2">📤</div>
                <p className="text-sm">Drag & drop images here</p>
                <p className="text-xs">or upload from the panel</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid Toggle */}
      <button
        onClick={() => useCustomizerStore.getState().setGridEnabled(!gridEnabled)}
        className={`absolute bottom-6 left-6 p-3 rounded-xl shadow-md transition-all duration-300 ${
          gridEnabled
            ? 'bg-onyx text-white'
            : 'bg-white text-graphite border border-mist'
        }`}
        title={gridEnabled ? 'Hide Grid' : 'Show Grid'}
      >
        <Grid3x3 className="w-5 h-5" />
      </button>
    </div>
  )
}
