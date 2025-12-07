import { motion, AnimatePresence } from 'framer-motion'
import { X, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PreviewData } from '@/config/placements'
import { useCustomizerStore } from '@/store/customizerStore'
import { useEffect, useRef } from 'react'
import { PRODUCT_TEMPLATES } from '@/config/productTemplates'
import { getMockupPath, getPrintZonesForProduct } from '@/config/printAreas'
import type { ProductType } from '@/types/customizer'

interface SimplePreviewModalProps {
  isOpen: boolean
  previewData: PreviewData | null // Keep for compatibility but not used
  onClose: () => void
  productId: string
  selectedColor: string
}

export default function SimplePreviewModal({
  isOpen,
  onClose,
  productId,
  selectedColor,
}: SimplePreviewModalProps) {
  const zonePlacements = useCustomizerStore((state) => state.zonePlacements)
  const frontCanvasRef = useRef<HTMLCanvasElement>(null)
  const backCanvasRef = useRef<HTMLCanvasElement>(null)

  const product = PRODUCT_TEMPLATES[productId]
  const productType = product?.type as ProductType

  useEffect(() => {
    if (!isOpen || !product) return

    // Render both front and back
    renderSide('front', frontCanvasRef.current)
    renderSide('back', backCanvasRef.current)
  }, [isOpen, zonePlacements, productId, selectedColor])

  const renderSide = (side: 'front' | 'back', canvas: HTMLCanvasElement | null) => {
    if (!canvas || !product) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const mockupWidth = 800
    const mockupHeight = 1000

    canvas.width = mockupWidth
    canvas.height = mockupHeight

    // Get mockup
    const colorData = product.colors.find(c => c.name === selectedColor)
    const mockupUrl = colorData?.mockups?.[side] 
      || getMockupPath(productType, selectedColor, side)
      || `/mockups/${productType}/${selectedColor.toLowerCase()}/${side}.png`

    const mockupImg = new Image()
    mockupImg.crossOrigin = 'anonymous'
    mockupImg.src = mockupUrl

    mockupImg.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, mockupWidth, mockupHeight)

      // Draw mockup
      ctx.drawImage(mockupImg, 0, 0, mockupWidth, mockupHeight)

      // Draw designs
      const zones = getPrintZonesForProduct(productType).filter(z => z.side === side)
      
      zones.forEach(zone => {
        const placement = zonePlacements[zone.id]
        if (!placement?.imageUrl) return

        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = placement.imageUrl

        img.onload = () => {
          // Calculate aspect ratio fit
          const imgAspect = img.width / img.height
          const zoneAspect = zone.width / zone.height
          
          let drawWidth = zone.width
          let drawHeight = zone.height
          let drawX = zone.x
          let drawY = zone.y
          
          // Contain the image within the zone while maintaining aspect ratio
          if (imgAspect > zoneAspect) {
            // Image is wider - fit to width
            drawHeight = zone.width / imgAspect
            drawY = zone.y + (zone.height - drawHeight) / 2
          } else {
            // Image is taller - fit to height
            drawWidth = zone.height * imgAspect
            drawX = zone.x + (zone.width - drawWidth) / 2
          }
          
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
        }
      })
    }

    mockupImg.onerror = () => {
      // Fallback
      const gradient = ctx.createLinearGradient(0, 0, mockupWidth, mockupHeight)
      gradient.addColorStop(0, '#F3F4F6')
      gradient.addColorStop(1, '#E5E7EB')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, mockupWidth, mockupHeight)
    }
  }
  const handleDownload = () => {
    if (!frontCanvasRef.current && !backCanvasRef.current) return

    // Create a combined image with both sides
    const combinedCanvas = document.createElement('canvas')
    const ctx = combinedCanvas.getContext('2d')
    if (!ctx) return

    combinedCanvas.width = 1600 // Two 800px canvases side by side
    combinedCanvas.height = 1000

    // Draw front
    if (frontCanvasRef.current) {
      ctx.drawImage(frontCanvasRef.current, 0, 0)
    }

    // Draw back
    if (backCanvasRef.current) {
      ctx.drawImage(backCanvasRef.current, 800, 0)
    }

    const link = document.createElement('a')
    link.href = combinedCanvas.toDataURL('image/png')
    link.download = `design-${productId}-both-sides-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-luxury-lg max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-brand-gold/20 bg-gradient-to-r from-brand-gold/5 to-brand-gold-dark/5 flex-shrink-0">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-carbon">Design Preview</h2>
              <p className="text-xs md:text-sm text-gray-700 mt-1">
                Front & Back • {selectedColor}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-brand-gold/10 transition-colors flex items-center justify-center"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Preview Images - Side by Side */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-bg-cream to-gray-50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Front */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-luxury hover:shadow-luxury-lg transition-shadow duration-300">
                <div className="bg-gradient-to-r from-brand-gold/10 to-brand-gold-dark/10 px-4 py-2 text-center border-b border-brand-gold/20">
                  <h3 className="text-sm font-semibold text-carbon">Front</h3>
                </div>
                <div className="flex items-center justify-center p-4">
                  <canvas
                    ref={frontCanvasRef}
                    className="max-w-full h-auto object-contain"
                    style={{ maxHeight: '600px' }}
                  />
                </div>
              </div>

              {/* Back */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-luxury hover:shadow-luxury-lg transition-shadow duration-300">
                <div className="bg-gradient-to-r from-brand-gold/10 to-brand-gold-dark/10 px-4 py-2 text-center border-b border-brand-gold/20">
                  <h3 className="text-sm font-semibold text-carbon">Back</h3>
                </div>
                <div className="flex items-center justify-center p-4">
                  <canvas
                    ref={backCanvasRef}
                    className="max-w-full h-auto object-contain"
                    style={{ maxHeight: '600px' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 md:p-6 border-t border-brand-gold/20 bg-gradient-to-r from-brand-gold/5 to-brand-gold-dark/5 flex-shrink-0">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                onClick={handleDownload}
                className="flex-1 h-11 md:h-12 font-semibold text-sm md:text-base"
              >
                <Download className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Download Both Sides
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="h-11 md:h-12 px-6 text-sm md:text-base"
              >
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
