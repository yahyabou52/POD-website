import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import ZoneOverlay, { type PrintZone } from './ZoneOverlay'
import { useCustomizerStore } from '@/store/customizerStore'
import { PRODUCT_TEMPLATES } from '@/config/productTemplates'
import { getMockupPath } from '@/config/printAreas'
import type { ProductType } from '@/types/customizer'

interface ZoneBasedCanvasProps {
  productId: string
  currentSide: 'front' | 'back'
  selectedColor: string
  onCanvasReady?: (canvas: HTMLCanvasElement) => void
}

// Define print zones (coordinates will be refined based on actual mockups)
const PRINT_ZONES: Record<string, PrintZone[]> = {
  'tshirt': [
    // Front zones
    { id: 'front-top-left', label: 'Top Left', x: 237, y: 360, width: 140, height: 115, side: 'front' },
    { id: 'front-top-right', label: 'Top Right', x: 422, y: 360, width: 140, height: 115, side: 'front' },
    { id: 'front-center-top', label: 'Center Top', x: 310, y: 360, width: 180, height: 115, side: 'front' },
    { id: 'front-full-center', label: 'Full Center', x: 237, y: 340, width: 325, height: 470, side: 'front' },
    // Back zones
    { id: 'back-full', label: 'Full Back', x: 237, y: 340, width: 325, height: 470, side: 'back' },
  ],
  'hoodie': [
    // Front zones
    { id: 'front-top-left', label: 'Top Left', x: 210, y: 373, width: 140, height: 115, side: 'front' },
    { id: 'front-top-right', label: 'Top Right', x: 380, y: 373, width: 140, height: 115, side: 'front' },
    { id: 'front-center-top', label: 'Center Top', x: 275, y: 340, width: 180, height: 115, side: 'front' },
    { id: 'front-full-center', label: 'Full Center', x: 200, y: 333, width: 325, height: 285, side: 'front' },
    // Back zones
    { id: 'back-full', label: 'Full Back', x: 200, y: 400, width: 325, height: 370, side: 'back' },
  ],
  'cap': [
    { id: 'front-center', label: 'Front Center', x: 150, y: 200, width: 400, height: 200, side: 'front' },
    { id: 'back-center', label: 'Back Center', x: 150, y: 200, width: 400, height: 150, side: 'back' },
  ],
  'mug': [
    { id: 'front-center', label: 'Front', x: 150, y: 150, width: 400, height: 400, side: 'front' },
    { id: 'back-center', label: 'Back', x: 150, y: 150, width: 400, height: 400, side: 'back' },
  ],
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

  const product = PRODUCT_TEMPLATES[productId]
  const productType = product?.type as ProductType

  // Get zones for current product and side
  const allZones = PRINT_ZONES[productType] || []
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
          />
        ))}
      </motion.div>
    </div>
  )
}
