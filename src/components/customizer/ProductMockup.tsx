import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { DesignElement } from '@/types/customizer'
import DesignOverlay from './DesignOverlay'
import { useCustomizerStore } from '@/store/customizer'
import { PRODUCT_TEMPLATES } from '@/config/productTemplates'

export default function ProductMockup() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const {
    productId,
    currentSide,
    selectedColor,
    designs,
    selectedElementId,
    snapToGrid,
    gridEnabled,
    updateDesign,
    setSelectedElement,
    deleteDesign,
  } = useCustomizerStore()

  const product = PRODUCT_TEMPLATES[productId]
  
  // Guard: Don't render if product not loaded
  if (!product) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-4xl mb-4">🎨</div>
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    )
  }

  const currentDesigns = designs[currentSide]
  const printArea = product.printAreas[currentSide]
  
  // Get mockup image for current color and side
  const colorData = product.colors.find(c => c.name === selectedColor)
  const mockupUrl = colorData?.mockups?.[currentSide] || product.views[currentSide]?.mockup

  const gridSize = 20

  return (
    <div 
      id="product-mockup-container"
      className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-8"
    >
      <div
        ref={containerRef}
        className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{
          width: printArea.canvasWidth,
          height: printArea.canvasHeight,
        }}
        onClick={() => setSelectedElement(null)}
      >
        {/* Mockup Background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentSide}-${selectedColor}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 pointer-events-none"
          >
            {mockupUrl ? (
              <img
                src={mockupUrl}
                alt={`${product.name} - ${currentSide}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'https://via.placeholder.com/600x600/F3F4F6/9CA3AF?text=Mockup+Not+Available'
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="text-center">
                  <div className="text-6xl mb-4">👕</div>
                  <p className="text-gray-500 font-medium">Mockup Preview</p>
                  <p className="text-xs text-gray-400 mt-1">{product.name}</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Grid Overlay */}
        {gridEnabled && (
          <div
            className="absolute pointer-events-none z-10"
            style={{
              left: printArea.x,
              top: printArea.y,
              width: printArea.width,
              height: printArea.height,
              backgroundImage: `
                linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px)
              `,
              backgroundSize: `${gridSize}px ${gridSize}px`,
            }}
          />
        )}

        {/* Print Area Outline */}
        <div
          className="absolute border-2 border-dashed border-gold/40 pointer-events-none z-10"
          style={{
            left: printArea.x,
            top: printArea.y,
            width: printArea.width,
            height: printArea.height,
          }}
        >
          <div className="absolute -top-6 left-0 text-xs font-semibold text-gold bg-white px-2 py-1 rounded">
            Print Area
          </div>
        </div>

        {/* Design Overlays */}
        <AnimatePresence>
          {currentDesigns.map((design) => (
            <DesignOverlay
              key={design.id}
              design={design}
              isSelected={design.id === selectedElementId}
              snapToGrid={snapToGrid}
              printArea={printArea}
              onUpdate={(updates) => updateDesign(design.id, updates)}
              onSelect={() => setSelectedElement(design.id)}
              onDelete={() => deleteDesign(design.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
