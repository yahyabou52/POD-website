import { useEffect, useRef, useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { motion, AnimatePresence } from 'framer-motion'
import type { ProductSide, DesignElement } from '@/types/customizer'
import { Button } from '@/components/ui/button'
import { X, Download } from 'lucide-react'
import { downloadProductImage } from '@/utils/downloadUtils'
import { useToast } from '@/components/ui/use-toast'
import { useCustomizerStore } from '@/store/customizer'
import { PRODUCT_TEMPLATES } from '@/config/productTemplates'

interface PreviewModalProps {
  onClose: () => void
}

export default function PreviewModal({ onClose }: PreviewModalProps) {
  const { productId, currentSide, designs } = useCustomizerStore()
  const product = PRODUCT_TEMPLATES[productId]
  
  const [selectedView, setSelectedView] = useState<ProductSide>(currentSide)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mockupRef = useRef<HTMLImageElement>(null)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Record<string, HTMLImageElement>>({})
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()

  // Guard: Don't render if product not loaded
  if (!product) {
    return (
      <Modal isOpen={true} onClose={onClose}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-4xl mb-4">🎨</div>
            <p className="text-gray-500">Loading product...</p>
          </div>
        </div>
      </Modal>
    )
  }

  // Update selected view when initial side changes
  useEffect(() => {
    setSelectedView(currentSide)
  }, [currentSide])

  // Preload all images (mockup, mask, and designs)
  useEffect(() => {
    if (!product) return

    const view = product.views[selectedView]
    if (!view?.mockup) return

    setImagesLoaded(false)
    const imagesToLoad: Record<string, string> = {
      mockup: view.mockup,
    }

    if (view.mask) {
      imagesToLoad.mask = view.mask
    }

    // Add design images
    const sideDesigns = designs[selectedView] || []
    sideDesigns.forEach((design, idx) => {
      if (design.type === 'image' && design.src) {
        imagesToLoad[`design-${idx}`] = design.src
      }
    })

    const imagePromises = Object.entries(imagesToLoad).map(([key, src]) => {
      return new Promise<[string, HTMLImageElement]>((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => resolve([key, img])
        img.onerror = reject
        img.src = src
      })
    })

    Promise.all(imagePromises)
      .then((results) => {
        const loaded: Record<string, HTMLImageElement> = {}
        results.forEach(([key, img]) => {
          loaded[key] = img
        })
        setLoadedImages(loaded)
        setImagesLoaded(true)
      })
      .catch((err) => {
        console.error('Failed to load preview images:', err)
        setImagesLoaded(true) // Show error state
      })
  }, [selectedView, designs, product])

  // Draw the preview with masking
  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current || !loadedImages.mockup) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const view = product.views[selectedView]
    const mockupImg = loadedImages.mockup
    const maskImg = loadedImages.mask
    const sideDesigns = designs[selectedView] || []

    // Set canvas size to match mockup
    canvas.width = mockupImg.width
    canvas.height = mockupImg.height

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw mockup background
    ctx.drawImage(mockupImg, 0, 0, canvas.width, canvas.height)

    // Create a temporary canvas for design layer with masking
    const designCanvas = document.createElement('canvas')
    designCanvas.width = canvas.width
    designCanvas.height = canvas.height
    const designCtx = designCanvas.getContext('2d')
    if (!designCtx) return

    // Draw all designs scaled to the view area
    const printArea = product.printAreas[selectedView]
    
    sideDesigns
      .sort((a, b) => a.zIndex - b.zIndex)
      .forEach((design, idx) => {
        const designImg = loadedImages[`design-${idx}`]
        if (!designImg) return

        // Calculate relative position within print area (0-1 range)
        const relativeX = (design.x - printArea.x) / printArea.width
        const relativeY = (design.y - printArea.y) / printArea.height
        const relativeWidth = design.width / printArea.width
        const relativeHeight = design.height / printArea.height

        // Map to view area coordinates on mockup
        const drawX = view.area.x + relativeX * view.area.width
        const drawY = view.area.y + relativeY * view.area.height
        const drawWidth = relativeWidth * view.area.width
        const drawHeight = relativeHeight * view.area.height

        // Apply rotation if any
        if (design.rotation && design.rotation !== 0) {
          designCtx.save()
          designCtx.translate(drawX + drawWidth / 2, drawY + drawHeight / 2)
          designCtx.rotate((design.rotation * Math.PI) / 180)
          designCtx.drawImage(designImg, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)
          designCtx.restore()
        } else {
          designCtx.drawImage(designImg, drawX, drawY, drawWidth, drawHeight)
        }
      })

    // Apply mask if provided
    if (maskImg) {
      designCtx.globalCompositeOperation = 'destination-in'
      designCtx.drawImage(maskImg, view.area.x, view.area.y, view.area.width, view.area.height)
      designCtx.globalCompositeOperation = 'source-over'
    }

    // Draw the design layer onto main canvas
    ctx.drawImage(designCanvas, 0, 0)

  }, [imagesLoaded, selectedView, designs, product, loadedImages])

  const availableViews = product.availableSides.filter(
    (side) => product.views[side]?.mockup
  )

  const view = product.views[selectedView]

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      await downloadProductImage(
        product,
        selectedView,
        designs[selectedView] || [],
        `${product.name.replace(/\s+/g, '-')}-${selectedView}-design.png`
      )
      toast({
        title: 'Download Complete',
        description: 'Your product design has been downloaded successfully.',
      })
    } catch (error) {
      console.error('Download failed:', error)
      toast({
        title: 'Download Failed',
        description: 'Failed to download the product image. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      size="full"
      showCloseButton={false}
      className="bg-gradient-to-br from-slate-50 via-white to-slate-50"
    >
      <div className="relative h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Design Preview
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              {product.name} • {selectedView.charAt(0).toUpperCase() + selectedView.slice(1).replace('-', ' ')}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-11 w-11 p-0 hover:bg-slate-100 rounded-full transition-all hover:scale-105"
          >
            <X className="h-5 w-5 text-slate-600" />
          </Button>
        </div>

        {/* View Tabs */}
        {availableViews.length > 1 && (
          <div className="flex items-center justify-center gap-2 px-8 py-5 bg-gradient-to-b from-white to-slate-50/50 border-b border-slate-200/50">
            <div className="inline-flex items-center gap-2 p-1.5 bg-white rounded-xl shadow-sm border border-slate-200/60">
              {availableViews.map((side) => (
                <button
                  key={side}
                  onClick={() => {
                    setSelectedView(side)
                    setImagesLoaded(false)
                  }}
                  className={`relative px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 capitalize ${
                    selectedView === side
                      ? 'bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-lg shadow-slate-900/20 scale-105'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {side.replace('-', ' ')}
                  {selectedView === side && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Preview Content */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-hidden bg-gradient-to-br from-slate-50 to-white">
          <AnimatePresence mode="wait">
            {view?.mockup ? (
              <motion.div
                key={selectedView}
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="relative max-w-5xl w-full h-full flex items-center justify-center"
              >
                {/* Canvas Container */}
                <div className="relative rounded-2xl shadow-2xl shadow-slate-900/10 overflow-hidden bg-white border border-slate-200/50">
                  {!imagesLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm z-10">
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
                          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-gold/40 rounded-full animate-spin animation-delay-150" />
                        </div>
                        <p className="text-sm text-slate-600 font-semibold tracking-wide">Loading preview...</p>
                      </div>
                    </div>
                  )}
                  
                  <canvas
                    ref={canvasRef}
                    className={`max-w-full max-h-[calc(90vh-250px)] w-auto h-auto transition-opacity duration-500 ${
                      imagesLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mb-6 shadow-inner">
                  <svg
                    className="w-12 h-12 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  No Preview Available
                </h3>
                <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                  Mockup image for {selectedView.replace('-', ' ')} is not available yet.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-8 py-6 border-t border-slate-200/80 bg-white/90 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-slate-600 font-medium">
                <span className="font-bold text-slate-900">
                  {designs[selectedView]?.length || 0}
                </span>{' '}
                design{designs[selectedView]?.length !== 1 ? 's' : ''} on this view
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleDownload}
              disabled={isDownloading || !designs[selectedView]?.length}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download Design
                </>
              )}
            </Button>
            <Button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-slate-900/20 hover:shadow-xl hover:scale-105"
            >
              Close Preview
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
