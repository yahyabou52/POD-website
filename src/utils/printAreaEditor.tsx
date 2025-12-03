import { useState, useRef, useEffect } from 'react'
import { Copy, Move, Maximize2, Lock, Unlock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PrintAreaEditorProps {
  mockupWidth: number
  mockupHeight: number
  onClose: () => void
}

interface BoxDimensions {
  x: number
  y: number
  width: number
  height: number
}

export default function PrintAreaEditor({
  mockupWidth,
  mockupHeight,
  onClose,
}: PrintAreaEditorProps) {
  const [box, setBox] = useState<BoxDimensions>({
    x: 100,
    y: 100,
    width: 300,
    height: 400,
  })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const [lockAspectRatio, setLockAspectRatio] = useState(false)
  const [areaName, setAreaName] = useState('fullCenter')
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const boxRef = useRef<HTMLDivElement>(null)

  const aspectRatio = box.width / box.height

  // Handle mouse move for dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStart.x
        const deltaY = e.clientY - dragStart.y

        setBox((prev) => ({
          ...prev,
          x: Math.max(0, Math.min(mockupWidth - prev.width, prev.x + deltaX)),
          y: Math.max(0, Math.min(mockupHeight - prev.height, prev.y + deltaY)),
        }))

        setDragStart({ x: e.clientX, y: e.clientY })
      } else if (isResizing && resizeHandle) {
        handleResize(e)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
      setResizeHandle(null)
    }

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, dragStart, mockupWidth, mockupHeight, resizeHandle])

  const handleResize = (e: MouseEvent) => {
    if (!resizeHandle) return

    setBox((prev) => {
      let newBox = { ...prev }

      const mouseX = e.clientX - (boxRef.current?.parentElement?.getBoundingClientRect().left || 0)
      const mouseY = e.clientY - (boxRef.current?.parentElement?.getBoundingClientRect().top || 0)

      switch (resizeHandle) {
        case 'se': // Bottom-right
          newBox.width = Math.max(50, mouseX - prev.x)
          newBox.height = lockAspectRatio 
            ? newBox.width / aspectRatio 
            : Math.max(50, mouseY - prev.y)
          break
        case 'sw': // Bottom-left
          const newWidth = Math.max(50, prev.x + prev.width - mouseX)
          newBox.x = Math.max(0, mouseX)
          newBox.width = newWidth
          newBox.height = lockAspectRatio
            ? newWidth / aspectRatio
            : Math.max(50, mouseY - prev.y)
          break
        case 'ne': // Top-right
          const newHeight = Math.max(50, prev.y + prev.height - mouseY)
          newBox.y = Math.max(0, mouseY)
          newBox.width = Math.max(50, mouseX - prev.x)
          newBox.height = lockAspectRatio
            ? newBox.width / aspectRatio
            : newHeight
          break
        case 'nw': // Top-left
          const nwWidth = Math.max(50, prev.x + prev.width - mouseX)
          const nwHeight = Math.max(50, prev.y + prev.height - mouseY)
          newBox.x = Math.max(0, mouseX)
          newBox.y = Math.max(0, mouseY)
          newBox.width = nwWidth
          newBox.height = lockAspectRatio ? nwWidth / aspectRatio : nwHeight
          break
      }

      // Ensure box stays within bounds
      if (newBox.x + newBox.width > mockupWidth) {
        newBox.width = mockupWidth - newBox.x
        if (lockAspectRatio) {
          newBox.height = newBox.width / aspectRatio
        }
      }
      if (newBox.y + newBox.height > mockupHeight) {
        newBox.height = mockupHeight - newBox.y
        if (lockAspectRatio) {
          newBox.width = newBox.height * aspectRatio
        }
      }

      return newBox
    })
  }

  const handleDragStart = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('resize-handle')) return
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleResizeStart = (handle: string) => (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeHandle(handle)
  }

  const copyToClipboard = () => {
    const printAreaConfig = {
      [areaName]: {
        x: Math.round(box.x),
        y: Math.round(box.y),
        width: Math.round(box.width),
        height: Math.round(box.height),
      },
    }

    const jsonString = JSON.stringify(printAreaConfig, null, 2)
    navigator.clipboard.writeText(jsonString)
    
    // Visual feedback
    const btn = document.getElementById('copy-btn')
    if (btn) {
      btn.textContent = '✓ Copied!'
      setTimeout(() => {
        btn.textContent = 'Copy Print Area'
      }, 2000)
    }
  }

  return (
    <div className="absolute inset-0 z-50">
      {/* Resizable/Draggable Box */}
      <div
        ref={boxRef}
        className="absolute border-4 border-blue-500 bg-blue-500/10 cursor-move"
        style={{
          left: box.x,
          top: box.y,
          width: box.width,
          height: box.height,
        }}
        onMouseDown={handleDragStart}
      >
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
            <Move className="inline w-4 h-4 mr-1" />
            Drag to Move
          </div>
        </div>

        {/* Resize Handles */}
        <div
          className="resize-handle absolute -top-2 -left-2 w-4 h-4 bg-blue-600 border-2 border-white rounded-full cursor-nw-resize hover:scale-125 transition-transform"
          onMouseDown={handleResizeStart('nw')}
        />
        <div
          className="resize-handle absolute -top-2 -right-2 w-4 h-4 bg-blue-600 border-2 border-white rounded-full cursor-ne-resize hover:scale-125 transition-transform"
          onMouseDown={handleResizeStart('ne')}
        />
        <div
          className="resize-handle absolute -bottom-2 -left-2 w-4 h-4 bg-blue-600 border-2 border-white rounded-full cursor-sw-resize hover:scale-125 transition-transform"
          onMouseDown={handleResizeStart('sw')}
        />
        <div
          className="resize-handle absolute -bottom-2 -right-2 w-4 h-4 bg-blue-600 border-2 border-white rounded-full cursor-se-resize hover:scale-125 transition-transform"
          onMouseDown={handleResizeStart('se')}
        />
      </div>

      {/* Control Panel - Moved to Left */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-4 w-80 border-2 border-blue-500">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Maximize2 className="w-5 h-5 text-blue-600" />
            Print Area Editor
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-bold text-xl"
          >
            ×
          </button>
        </div>

        {/* Area Name Input */}
        <div className="mb-4">
          <label className="text-xs font-medium text-gray-600 block mb-1">
            Area Name
          </label>
          <input
            type="text"
            value={areaName}
            onChange={(e) => setAreaName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., fullCenter, topLeft"
          />
        </div>

        {/* Live Coordinates */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4 font-mono text-xs">
          <div className="text-gray-600 font-semibold mb-2">Live Coordinates:</div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">x:</span>
              <span className="font-bold">{Math.round(box.x)}px</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">y:</span>
              <span className="font-bold">{Math.round(box.y)}px</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">width:</span>
              <span className="font-bold">{Math.round(box.width)}px</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">height:</span>
              <span className="font-bold">{Math.round(box.height)}px</span>
            </div>
          </div>
        </div>

        {/* Aspect Ratio Lock */}
        <div className="mb-4">
          <button
            onClick={() => setLockAspectRatio(!lockAspectRatio)}
            className={`w-full px-3 py-2 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
              lockAspectRatio
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {lockAspectRatio ? (
              <Lock className="w-4 h-4" />
            ) : (
              <Unlock className="w-4 h-4" />
            )}
            <span className="font-medium">
              {lockAspectRatio ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}
            </span>
          </button>
          {lockAspectRatio && (
            <div className="text-xs text-gray-500 text-center mt-1">
              Ratio: {aspectRatio.toFixed(2)}
            </div>
          )}
        </div>

        {/* Copy Button */}
        <Button
          id="copy-btn"
          onClick={copyToClipboard}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Print Area
        </Button>

        {/* Preview JSON */}
        <div className="mt-4 bg-gray-900 text-green-400 rounded-lg p-3 font-mono text-xs overflow-x-auto">
          <pre>{JSON.stringify(
            {
              [areaName]: {
                x: Math.round(box.x),
                y: Math.round(box.y),
                width: Math.round(box.width),
                height: Math.round(box.height),
              },
            },
            null,
            2
          )}</pre>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-xs text-gray-500 border-t border-gray-200 pt-3">
          <p className="font-semibold mb-1">Instructions:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Drag the blue box to move</li>
            <li>Drag corners to resize</li>
            <li>Lock aspect ratio if needed</li>
            <li>Click "Copy" to copy JSON</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// Helper function to check if in dev mode
export function isDevMode(): boolean {
  return import.meta.env.DEV || import.meta.env.MODE === 'development'
}
