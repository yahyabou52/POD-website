import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ProductSide, ProductType } from '@/types/customizer'
import { PRODUCT_TEMPLATES } from '@/config/productTemplates'
import { getPrintArea, calculateFitDimensions, getMockupPath } from '@/config/printAreas'
import { useCustomizerStore, type Placement } from '@/store/customizerStore'
import FloatingToolbar from './FloatingToolbar'

interface SimplePlacementCanvasProps {
  productId: string
  currentSide: ProductSide
  selectedColor: string
  designImage: string | null
  selectedPlacement: string | null
  scale: number
  onCanvasReady?: (canvas: HTMLCanvasElement) => void
  // T4-A: Optional flag to enable multi-placement rendering
  useMultiPlacement?: boolean
}

export default function SimplePlacementCanvas({
  productId,
  currentSide,
  selectedColor,
  designImage,
  selectedPlacement,
  scale,
  onCanvasReady,
  useMultiPlacement = false,
}: SimplePlacementCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [mockupDimensions, setMockupDimensions] = useState({ width: 800, height: 1000 })
  const [placementBounds, setPlacementBounds] = useState<Array<{
    id: string
    x: number
    y: number
    width: number
    height: number
  }>>([])

  // T4-A: Get placements from store for multi-placement mode
  const placements = useCustomizerStore((state) => state.getPlacementsForSide(currentSide))
  const activePlacementId = useCustomizerStore((state) => state.activePlacementId)
  const getPlacementById = useCustomizerStore((state) => state.getPlacementById)
  const setActivePlacement = useCustomizerStore((state) => state.setActivePlacement)
  
  // T4-D: Get active placement for floating toolbar
  const activePlacement = activePlacementId ? getPlacementById(activePlacementId) : null

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
        
        // T4-A: Draw designs based on mode
        if (useMultiPlacement) {
          drawMultiplePlacements(ctx, finalWidth, finalHeight)
        } else {
          drawSingleDesign(ctx, finalWidth, finalHeight)
        }
      }
      
      mockupImg.onerror = () => {
        console.warn('Failed to load mockup:', mockupUrl)
        drawFallbackBackground(ctx, canvas.width, canvas.height)
        
        if (useMultiPlacement) {
          drawMultiplePlacements(ctx, canvas.width, canvas.height)
        } else {
          drawSingleDesign(ctx, canvas.width, canvas.height)
        }
      }
      
      mockupImg.src = mockupUrl
    } else {
      drawFallbackBackground(ctx, canvas.width, canvas.height)
      
      if (useMultiPlacement) {
        drawMultiplePlacements(ctx, canvas.width, canvas.height)
      } else {
        drawSingleDesign(ctx, canvas.width, canvas.height)
      }
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

    // T4-A: Render all placements from store
    function drawMultiplePlacements(ctx: CanvasRenderingContext2D, canvasW: number, canvasH: number) {
      if (placements.length === 0) return

      const bounds: typeof placementBounds = []

      // Draw each placement
      placements.forEach((placement) => {
        const placementPrintArea = getPrintArea(productType, currentSide, placement.zone)
        if (!placementPrintArea) return

        const designImg = new Image()
        designImg.crossOrigin = 'anonymous'
        
        designImg.onload = () => {
          const imgWidth = designImg.naturalWidth || designImg.width
          const imgHeight = designImg.naturalHeight || designImg.height
          
          // Calculate fit dimensions maintaining aspect ratio
          const fit = calculateFitDimensions(imgWidth, imgHeight, placementPrintArea)
          
          // Apply placement's scale factor
          const scaledWidth = fit.width * placement.scale
          const scaledHeight = fit.height * placement.scale
          
          // Ensure scaled design stays within print area
          let finalWidth = Math.min(scaledWidth, placementPrintArea.width)
          let finalHeight = scaledHeight
          
          if (finalWidth < scaledWidth) {
            finalHeight = finalWidth * (imgHeight / imgWidth)
          }
          
          if (finalHeight > placementPrintArea.height) {
            finalHeight = placementPrintArea.height
            finalWidth = finalHeight * (imgWidth / imgHeight)
          }
          
          // Use placement's x, y if provided, otherwise center
          let x = placement.x
          let y = placement.y
          
          // If x/y are 0 (default), center within print area
          if (x === 0 && y === 0) {
            x = placementPrintArea.x + (placementPrintArea.width - finalWidth) / 2
            y = placementPrintArea.y + (placementPrintArea.height - finalHeight) / 2
          }
          
          // T4-D: Track bounds for click detection
          bounds.push({
            id: placement.id,
            x,
            y,
            width: finalWidth,
            height: finalHeight
          })
          
          // Save context for potential rotation
          ctx.save()
          
          // Apply rotation if specified
          if (placement.rotation && placement.rotation !== 0) {
            const centerX = x + finalWidth / 2
            const centerY = y + finalHeight / 2
            ctx.translate(centerX, centerY)
            ctx.rotate((placement.rotation * Math.PI) / 180)
            ctx.translate(-centerX, -centerY)
          }
          
          // Draw design
          ctx.drawImage(designImg, x, y, finalWidth, finalHeight)
          
          // T4-A: Highlight active placement
          if (placement.id === activePlacementId) {
            ctx.strokeStyle = '#3B82F6' // Blue for active
            ctx.lineWidth = 3
            ctx.strokeRect(x - 2, y - 2, finalWidth + 4, finalHeight + 4)
          }
          
          ctx.restore()

          // Update bounds state
          setPlacementBounds(bounds)

          // Notify parent that canvas is ready
          if (onCanvasReady && canvas) {
            onCanvasReady(canvas)
          }
        }
        
        designImg.src = placement.designId
      })
    }

    // Original single design rendering (backward compatible)
    function drawSingleDesign(ctx: CanvasRenderingContext2D, canvasW: number, canvasH: number) {
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
  }, [
    productId, 
    currentSide, 
    selectedColor, 
    designImage, 
    selectedPlacement, 
    scale, 
    mockupUrl, 
    productType,
    // T4-A: Add placements to dependencies for multi-placement mode
    useMultiPlacement ? placements.length : null,
    useMultiPlacement ? activePlacementId : null
  ])

  // T4-D: Handle canvas clicks to select placements
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!useMultiPlacement || placementBounds.length === 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    // Check if click is within any placement bounds (reverse order for z-index)
    for (let i = placementBounds.length - 1; i >= 0; i--) {
      const bound = placementBounds[i]
      if (
        x >= bound.x &&
        x <= bound.x + bound.width &&
        y >= bound.y &&
        y <= bound.y + bound.height
      ) {
        setActivePlacement(bound.id)
        return
      }
    }

    // Click outside all placements - deselect
    setActivePlacement(null)
  }

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
          onClick={handleCanvasClick}
          className="w-full h-full cursor-pointer"
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

        {/* T4-D: Floating Toolbar for Active Placement */}
        <AnimatePresence>
          {activePlacement && useMultiPlacement && (
            <FloatingToolbar placement={activePlacement} />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
