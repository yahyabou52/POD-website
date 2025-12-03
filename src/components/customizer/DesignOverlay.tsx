import { Rnd } from 'react-rnd'
import { motion } from 'framer-motion'
import type { DesignElement, PrintArea } from '@/types/customizer'
import { Trash2, Lock, Unlock } from 'lucide-react'

interface DesignOverlayProps {
  design: DesignElement
  printArea: PrintArea
  isSelected: boolean
  snapToGrid: boolean
  onUpdate: (updates: Partial<DesignElement>) => void
  onSelect: () => void
  onDelete: () => void
}

export default function DesignOverlay({
  design,
  printArea,
  isSelected,
  snapToGrid,
  onUpdate,
  onSelect,
  onDelete,
}: DesignOverlayProps) {
  const gridSize = 20

  const handleDragStop = (_e: any, d: any) => {
    let newX = d.x
    let newY = d.y

    if (snapToGrid) {
      newX = Math.round(newX / gridSize) * gridSize
      newY = Math.round(newY / gridSize) * gridSize
    }

    // Boundary constraints
    newX = Math.max(printArea.x, Math.min(newX, printArea.x + printArea.width - design.width))
    newY = Math.max(printArea.y, Math.min(newY, printArea.y + printArea.height - design.height))

    onUpdate({ x: newX, y: newY })
  }

  const handleResizeStop = (_e: any, _direction: any, ref: any, _delta: any, position: any) => {
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

    onUpdate({ 
      x: newX, 
      y: newY, 
      width: newWidth, 
      height: newHeight 
    })
  }

  if (design.locked) {
    return (
      <div
        onClick={onSelect}
        className="absolute pointer-events-none"
        style={{
          left: design.x,
          top: design.y,
          width: design.width,
          height: design.height,
          transformOrigin: 'center',
        }}
      >
        <img
          src={design.src || ''}
          alt="Design"
          className="w-full h-full object-contain select-none"
          draggable={false}
        />
        <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">
          <Lock className="w-3 h-3" />
        </div>
      </div>
    )
  }

  return (
    <Rnd
      position={{ x: design.x, y: design.y }}
      size={{ width: design.width, height: design.height }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      bounds="parent"
      dragGrid={snapToGrid ? [gridSize, gridSize] : undefined}
      resizeGrid={snapToGrid ? [gridSize, gridSize] : undefined}
      lockAspectRatio={true}
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
      className={`cursor-move ${isSelected ? 'ring-4 ring-gold shadow-2xl' : ''}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full h-full relative"
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
        style={{
          transform: `scale(${design.scaleX || 1}, ${design.scaleY || 1})`,
          transformOrigin: 'center',
        }}
      >
        {design.type === 'image' && design.src && (
          <img
            src={design.src}
            alt="Design"
            className="w-full h-full object-contain select-none pointer-events-none"
            draggable={false}
          />
        )}

        {/* Control buttons */}
        {isSelected && (
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white rounded-lg shadow-2xl p-2 border border-gray-200">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onUpdate({ locked: true })
              }}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Lock Position"
            >
              <Unlock className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="p-2 hover:bg-red-50 rounded transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        )}
      </motion.div>
    </Rnd>
  )
}
