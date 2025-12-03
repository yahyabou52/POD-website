import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { ProductSide, ProductType } from '@/types/customizer'
import { PRODUCT_TEMPLATES } from '@/config/productTemplates'
import { getPrintArea, calculateFitDimensions, getMockupPath } from '@/config/printAreas'

interface SimplePlacementCanvasProps {
  productId: string
  currentSide: ProductSide
  selectedColor: string
  designImage: string | null
  selectedPlacement: string | null
  scale: number
  onCanvasReady?: (canvas: HTMLCanvasElement) => void
}

export default function SimplePlacementCanvas({
  productId,
  currentSide,
  selectedColor,
  designImage,
  selectedPlacement,
  scale,
  onCanvasReady,
}: SimplePlacementCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [mockupDimensions, setMockupDimensions] = useState({ width: 800, height: 1000 })

  const product = PRODUCT_TEMPLATES[productId]
  const productType = product?.type as ProductType
  
  // Get print area from new config
  const printArea = selectedPlacement 
    ? getPrintArea(productType, currentSide, selectedPlacement)
    : null

  // Get mockup image - prioritize color mockups, then fallback
  const colorData = product?.colors.find(c => c.name === selectedColor)
  const mockupUrl = colorData?.mockups?.[currentSide] 
    || getMockupPath(productType, selectedColor, currentSide)
    || product?.views[currentSide]?.mockup

  // Draw canvas with aspect ratio preservation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size based on mockup (will be determined by mockup load)
    canvas.width = mockupDimensions.width
    canvas.height = mockupDimensions.height

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw mockup background if available
    if (mockupUrl) {
      const mockupImg = new Image()
      mockupImg.crossOrigin = 'anonymous'
      
      mockupImg.onload = () => {
        // Update canvas dimensions to match mockup (preserves aspect ratio)
        const mockupWidth = mockupImg.naturalWidth || mockupImg.width
        const mockupHeight = mockupImg.naturalHeight || mockupImg.height
        
        // Set max dimensions to keep UI reasonable
        const maxWidth = 800
        const maxHeight = 1000
        const aspectRatio = mockupWidth / mockupHeight
        
        let finalWidth = mockupWidth
        let finalHeight = mockupHeight
        
        if (mockupWidth > maxWidth || mockupHeight > maxHeight) {
          if (aspectRatio > maxWidth / maxHeight) {
            finalWidth = maxWidth
            finalHeight = maxWidth / aspectRatio
          } else {
            finalHeight = maxHeight
            finalWidth = maxHeight * aspectRatio
          }
        }
        
        canvas.width = finalWidth
        canvas.height = finalHeight
        setMockupDimensions({ width: finalWidth, height: finalHeight })
        
        // Draw mockup at actual size (no stretching/deformation)
        ctx.drawImage(mockupImg, 0, 0, finalWidth, finalHeight)
        
        // Draw design after mockup
        drawDesign(ctx, finalWidth, finalHeight)
      }
      
      mockupImg.onerror = () => {
        console.warn('Failed to load mockup:', mockupUrl)
        drawFallbackBackground(ctx, canvas.width, canvas.height)
        drawDesign(ctx, canvas.width, canvas.height)
      }
      
      mockupImg.src = mockupUrl
    } else {
      drawFallbackBackground(ctx, canvas.width, canvas.height)
      drawDesign(ctx, canvas.width, canvas.height)
    }

    function drawFallbackBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, w, h)
      gradient.addColorStop(0, '#F3F4F6')
      gradient.addColorStop(1, '#E5E7EB')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, w, h)

      // Product emoji
      ctx.font = '80px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const emoji = productType === 'hoodie' ? '🧥' : 
                    productType === 'tshirt' ? '👕' :
                    productType === 'cap' ? '🧢' : '☕'
      ctx.fillText(emoji, w / 2, h / 2)
    }

    function drawDesign(ctx: CanvasRenderingContext2D, canvasW: number, canvasH: number) {
      if (!designImage || !printArea) return

      const designImg = new Image()
      designImg.crossOrigin = 'anonymous'
      
      designImg.onload = () => {
        const imgWidth = designImg.naturalWidth || designImg.width
        const imgHeight = designImg.naturalHeight || designImg.height
        
        // Calculate fit dimensions maintaining aspect ratio
        const fit = calculateFitDimensions(imgWidth, imgHeight, printArea)
        
        // Apply scale factor
        const scaledWidth = fit.width * scale
        const scaledHeight = fit.height * scale
        
        // Ensure scaled design stays within print area
        const maxWidth = printArea.width
        const maxHeight = printArea.height
        
        let finalWidth = scaledWidth
        let finalHeight = scaledHeight
        
        if (scaledWidth > maxWidth) {
          finalWidth = maxWidth
          finalHeight = maxWidth * (imgHeight / imgWidth)
        }
        
        if (finalHeight > maxHeight) {
          finalHeight = maxHeight
          finalWidth = maxHeight * (imgWidth / imgHeight)
        }
        
        // Center within print area
        const x = printArea.x + (printArea.width - finalWidth) / 2
        const y = printArea.y + (printArea.height - finalHeight) / 2
        
        // Draw design with perfect aspect ratio
        ctx.drawImage(designImg, x, y, finalWidth, finalHeight)

        // Notify parent that canvas is ready
        if (onCanvasReady && canvas) {
          onCanvasReady(canvas)
        }
      }
      
      designImg.src = designImage
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, currentSide, selectedColor, designImage, selectedPlacement, scale, mockupUrl, productType])

  if (!product) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-xl">
        <div className="text-center">
          <div className="text-4xl mb-4">🎨</div>
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-8"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{
          width: mockupDimensions.width,
          height: mockupDimensions.height,
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{
            imageRendering: 'high-quality',
            objectFit: 'contain',
          }}
        />

        {/* Print Area Outline (only when placement selected) */}
        {printArea && (
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
        )}

        {/* Placement Guide (when placement selected but no design) */}
        {printArea && !designImage && (
          <div
            className="absolute border-2 border-blue-400 border-dashed bg-blue-50/30 pointer-events-none z-20 flex items-center justify-center"
            style={{
              left: printArea.x,
              top: printArea.y,
              width: printArea.width,
              height: printArea.height,
            }}
          >
            <div className="text-xs text-blue-600 font-medium bg-white px-2 py-1 rounded">
              {selectedPlacement?.replace(/([A-Z])/g, ' $1').trim()}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
