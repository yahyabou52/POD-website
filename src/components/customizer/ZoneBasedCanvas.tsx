import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import ZoneOverlay from './ZoneOverlay'
import { useCustomizerStore } from '@/store/customizerStore'
import { PRODUCT_TEMPLATES } from '@/config/productTemplates'
import { getMockupPath, getPrintZonesForProduct } from '@/config/printAreas'
import type { ProductType } from '@/types/customizer'

interface ZoneBasedCanvasProps {
  productId: string
  currentSide: 'front' | 'back'
  selectedColor: string
  onCanvasReady?: (canvas: HTMLCanvasElement) => void
}

export default function ZoneBasedCanvas({
  productId,
  currentSide,
  selectedColor,
  onCanvasReady,
}: ZoneBasedCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Store state
  const zonePlacements = useCustomizerStore((state) => state.zonePlacements)
  const setZonePlacement = useCustomizerStore((state) => state.setZonePlacement)
  const removeZonePlacement = useCustomizerStore((state) => state.removeZonePlacement)
  const showPrintAreas = useCustomizerStore((state) => state.showPrintAreas)
  const togglePrintAreas = useCustomizerStore((state) => state.togglePrintAreas)

  const product = PRODUCT_TEMPLATES[productId]
  const productType = product?.type as ProductType

  // Get zones for current product and side from centralized config
  const allZones = getPrintZonesForProduct(productType)
  const visibleZones = allZones.filter(zone => zone.side === currentSide)

  // Get mockup image
  const colorData = product?.colors.find(c => c.name === selectedColor)
  const mockupUrl = colorData?.mockups?.[currentSide] 
    || getMockupPath(productType, selectedColor, currentSide)
    || `/mockups/${productType}/${selectedColor.toLowerCase()}/${currentSide}.png`

  const mockupWidth = 800
  const mockupHeight = 1000

  // Draw canvas with mockup and designs
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = mockupWidth
    canvas.height = mockupHeight

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw mockup
    const mockupImg = new Image()
    mockupImg.crossOrigin = 'anonymous'
    
    mockupImg.onload = () => {
      ctx.drawImage(mockupImg, 0, 0, mockupWidth, mockupHeight)
      
      // Draw designs in zones
      visibleZones.forEach(zone => {
        const placement = zonePlacements[zone.id]
        if (placement?.imageUrl) {
          const designImg = new Image()
          designImg.crossOrigin = 'anonymous'
          
          designImg.onload = () => {
            const imgWidth = designImg.naturalWidth || designImg.width
            const imgHeight = designImg.naturalHeight || designImg.height
            
            // Calculate fit dimensions (maintain aspect ratio)
            const aspectRatio = imgWidth / imgHeight
            const zoneAspectRatio = zone.width / zone.height
            
            let finalWidth: number
            let finalHeight: number
            
            if (aspectRatio > zoneAspectRatio) {
              finalWidth = zone.width
              finalHeight = finalWidth / aspectRatio
            } else {
              finalHeight = zone.height
              finalWidth = finalHeight * aspectRatio
            }
            
            // Center in zone
            const x = zone.x + (zone.width - finalWidth) / 2
            const y = zone.y + (zone.height - finalHeight) / 2
            
            ctx.drawImage(designImg, x, y, finalWidth, finalHeight)
          }
          
          designImg.src = placement.imageUrl
        }
      })

      if (onCanvasReady) {
        onCanvasReady(canvas)
      }
    }
    
    mockupImg.onerror = () => {
      // Fallback background
      const gradient = ctx.createLinearGradient(0, 0, mockupWidth, mockupHeight)
      gradient.addColorStop(0, '#F3F4F6')
      gradient.addColorStop(1, '#E5E7EB')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, mockupWidth, mockupHeight)

      ctx.font = '80px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const emoji = productType === 'hoodie' ? '🧥' : 
                    productType === 'tshirt' ? '👕' :
                    productType === 'cap' ? '🧢' : '☕'
      ctx.fillText(emoji, mockupWidth / 2, mockupHeight / 2)
    }
    
    mockupImg.src = mockupUrl
  }, [productId, currentSide, selectedColor, mockupUrl, zonePlacements, visibleZones, onCanvasReady])

  const handleZoneUpload = (zoneId: string, file: File, imageUrl: string) => {
    setZonePlacement(zoneId, { imageUrl, file })
  }

  const handleZoneRemove = (zoneId: string) => {
    removeZonePlacement(zoneId)
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Floating Toggle Button */}
      <button
        onClick={togglePrintAreas}
        className="absolute top-4 right-4 z-50 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg border border-gray-200 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
        title={showPrintAreas ? 'Hide Print Area Guides' : 'Show Print Area Guides'}
      >
        {showPrintAreas ? (
          <>
            <EyeOff className="w-5 h-5 text-gray-700" />
            <span className="text-sm font-medium text-gray-700 pr-1">Hide Guides</span>
          </>
        ) : (
          <>
            <Eye className="w-5 h-5 text-gray-700" />
            <span className="text-sm font-medium text-gray-700 pr-1">Show Guides</span>
          </>
        )}
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-2xl shadow-2xl overflow-visible"
        style={{
          width: mockupWidth,
          height: mockupHeight,
        }}
      >
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{
            imageRendering: 'auto',
            objectFit: 'contain',
          }}
        />

        {/* Zone Overlays */}
        {visibleZones.map(zone => (
          <ZoneOverlay
            key={zone.id}
            zone={zone}
            hasImage={!!zonePlacements[zone.id]}
            imageUrl={zonePlacements[zone.id]?.imageUrl}
            onUpload={(file, imageUrl) => handleZoneUpload(zone.id, file, imageUrl)}
            onRemove={() => handleZoneRemove(zone.id)}
            showPrintAreas={showPrintAreas}
          />
        ))}
      </motion.div>
    </div>
  )
}
