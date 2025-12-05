import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Replace, 
  Copy, 
  Trash2, 
  ArrowUp, 
  ArrowDown,
  Maximize2
} from 'lucide-react'
import { useCustomizerStore, type Placement } from '@/store/customizerStore'

interface FloatingToolbarProps {
  placement: Placement
  canvasScale?: number // For positioning adjustment if canvas is scaled
}

export default function FloatingToolbar({ 
  placement,
  canvasScale = 1 
}: FloatingToolbarProps) {
  const [showScaleSlider, setShowScaleSlider] = useState(false)
  
  // Store actions
  const updatePlacement = useCustomizerStore((state) => state.updatePlacement)
  const duplicatePlacement = useCustomizerStore((state) => state.duplicatePlacement)
  const removePlacement = useCustomizerStore((state) => state.removePlacement)
  const reorderPlacement = useCustomizerStore((state) => state.reorderPlacement)

  // Calculate toolbar position (above the placement)
  const toolbarX = placement.x
  const toolbarY = placement.y - 50 // 50px above the placement

  const handleScaleChange = (newScale: number) => {
    updatePlacement(placement.id, { scale: newScale })
  }

  const handleReplace = () => {
    // TODO: Implement file picker modal for replacing design
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const imageData = event.target?.result as string
          updatePlacement(placement.id, { designId: imageData })
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const handleDuplicate = () => {
    duplicatePlacement(placement.id)
  }

  const handleDelete = () => {
    if (confirm('Delete this placement?')) {
      removePlacement(placement.id)
    }
  }

  const handleBringForward = () => {
    reorderPlacement(placement.id, 'up')
  }

  const handleSendBackward = () => {
    reorderPlacement(placement.id, 'down')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute z-[999] bg-white shadow-lg rounded-md px-3 py-2 flex gap-2 items-center border border-gray-200"
      style={{
        left: `${toolbarX * canvasScale}px`,
        top: `${toolbarY * canvasScale}px`,
        transform: toolbarY < 0 ? 'translateY(60px)' : 'translateY(0)', // Flip below if too close to top
      }}
    >
      {/* Replace Button */}
      <button
        onClick={handleReplace}
        className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"
        title="Replace design"
      >
        <Replace className="w-4 h-4" />
      </button>

      {/* Duplicate Button */}
      <button
        onClick={handleDuplicate}
        className="p-1.5 rounded hover:bg-green-50 text-green-600 transition-colors"
        title="Duplicate"
      >
        <Copy className="w-4 h-4" />
      </button>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="p-1.5 rounded hover:bg-red-50 text-red-600 transition-colors"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-200" />

      {/* Scale Toggle */}
      <button
        onClick={() => setShowScaleSlider(!showScaleSlider)}
        className={`p-1.5 rounded transition-colors ${
          showScaleSlider 
            ? 'bg-purple-50 text-purple-600' 
            : 'hover:bg-purple-50 text-purple-600'
        }`}
        title="Scale"
      >
        <Maximize2 className="w-4 h-4" />
      </button>

      {/* Scale Slider (conditionally shown) */}
      {showScaleSlider && (
        <div className="flex items-center gap-2 px-2">
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {(placement.scale * 100).toFixed(0)}%
          </span>
          <input
            type="range"
            min={0.4}
            max={1.5}
            step={0.05}
            value={placement.scale}
            onChange={(e) => handleScaleChange(Number(e.target.value))}
            className="w-24 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            title={`Scale: ${(placement.scale * 100).toFixed(0)}%`}
          />
        </div>
      )}

      {/* Divider */}
      <div className="w-px h-6 bg-gray-200" />

      {/* Bring Forward Button */}
      <button
        onClick={handleBringForward}
        className="p-1.5 rounded hover:bg-orange-50 text-orange-600 transition-colors"
        title="Bring forward"
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      {/* Send Backward Button */}
      <button
        onClick={handleSendBackward}
        className="p-1.5 rounded hover:bg-orange-50 text-orange-600 transition-colors"
        title="Send backward"
      >
        <ArrowDown className="w-4 h-4" />
      </button>
    </motion.div>
  )
}
