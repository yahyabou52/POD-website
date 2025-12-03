import { useState, useRef } from 'react'
import ProductWizard from '@/components/customizer/ProductWizard'
import SimplePlacementCanvas from '@/components/customizer/SimplePlacementCanvas'
import SimplePlacementPanel from '@/components/customizer/SimplePlacementPanel'
import SimplePreviewModal from '@/components/customizer/SimplePreviewModal'
import PrintAreaEditor, { isDevMode } from '@/utils/printAreaEditor'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Settings } from 'lucide-react'
import type { ProductSelection, ProductSide } from '@/types/customizer'
import type { PreviewData, DesignData } from '@/config/placements'
import { getAvailablePlacementsForSide } from '@/config/printAreas'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import { useNavigate, useLocation } from 'react-router-dom'
import { PRODUCT_TEMPLATES } from '@/config/productTemplates'
import { Button } from '@/components/ui/button'

function Customizer() {
  const navigate = useNavigate()
  const location = useLocation()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  
  const [showWizard, setShowWizard] = useState(true)
  const [showChangeProduct, setShowChangeProduct] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [editorMode, setEditorMode] = useState(false)
  const [mockupDimensions, setMockupDimensions] = useState({ width: 800, height: 1000 })
  
  // Product state
  const [productId, setProductId] = useState<string>('tshirt-regular-short')
  const [currentSide, setCurrentSide] = useState<ProductSide>('front')
  const [selectedColor, setSelectedColor] = useState('White')
  const [selectedSize, setSelectedSize] = useState('M')
  
  // Design state
  const [designImage, setDesignImage] = useState<string | null>(null)
  const [selectedPlacement, setSelectedPlacement] = useState<string | null>(null)
  const [scale, setScale] = useState(1)

  const product = PRODUCT_TEMPLATES[productId]

  const handleWizardComplete = (selection: ProductSelection) => {
    if (!selection.productType) return
    
    // Find matching product template
    let newProductId = 'tshirt-regular-short'
    
    if (selection.productType === 'tshirt') {
      if (selection.fitType === 'regular' && selection.sleeveType === 'short') {
        newProductId = 'tshirt-regular-short'
      } else if (selection.fitType === 'regular' && selection.sleeveType === 'full') {
        newProductId = 'tshirt-regular-full'
      } else if (selection.fitType === 'oversize' && selection.sleeveType === 'short') {
        newProductId = 'tshirt-oversize-short'
      } else if (selection.fitType === 'oversize' && selection.sleeveType === 'full') {
        newProductId = 'tshirt-oversize-full'
      }
    } else if (selection.productType === 'hoodie') {
      newProductId = selection.fitType === 'regular' ? 'hoodie-regular' : 'hoodie-oversize'
    } else if (selection.productType === 'cap') {
      newProductId = selection.capType === 'baseball' ? 'cap-baseball' : 'cap-trucker'
    } else if (selection.productType === 'mug') {
      newProductId = selection.mugType === 'ceramic' ? 'mug-ceramic' : 'mug-travel'
    }
    
    const template = PRODUCT_TEMPLATES[newProductId]
    if (!template) return
    
    setProductId(newProductId)
    setCurrentSide(selection.printArea || template.availableSides[0])
    setSelectedColor(selection.color || template.colors[0].name)
    setSelectedSize(selection.size || template.sizes[0])
    
    // Set default placement for the selected side
    const side = selection.printArea || template.availableSides[0]
    const placements = getAvailablePlacementsForSide(template.type, side)
    setSelectedPlacement(placements.length > 0 ? placements[0] : null)
    
    setShowWizard(false)
    setShowChangeProduct(false)
  }

  const handleModalClose = () => {
    if (location.state?.from) {
      navigate(location.state.from)
    } else {
      setShowWizard(false)
      setShowChangeProduct(false)
    }
  }

  const handleSideChange = (side: ProductSide) => {
    setCurrentSide(side)
    // Set default placement for new side
    const placements = getAvailablePlacementsForSide(product!.type, side)
    setSelectedPlacement(placements.length > 0 ? placements[0] : null)
  }

  const handleCanvasReady = (canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas
    // Track mockup dimensions for editor
    setMockupDimensions({ width: canvas.width, height: canvas.height })
  }

  const handleGeneratePreview = () => {
    if (!canvasRef.current || !designImage || !selectedPlacement) {
      alert('Please upload a design and select a placement first')
      return
    }

    // Get canvas data URL
    const previewImage = canvasRef.current.toDataURL('image/png')
    
    // Prepare design data
    const designData: DesignData = {
      image: designImage,
      placement: selectedPlacement,
      scale,
      side: currentSide,
      color: selectedColor,
      size: selectedSize,
      productId,
    }

    // Create preview data
    const preview: PreviewData = {
      preview: previewImage,
      design: designData,
      timestamp: Date.now(),
    }

    setPreviewData(preview)
    setShowPreview(true)
    
    // Log for order preparation
    console.log('📦 Order Data Ready:', {
      preview: previewImage.substring(0, 50) + '...',
      design: designData,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mist via-white to-mist">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-onyx rounded-full text-sm font-medium text-white shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span>Simple Placement Designer</span>
            </div>
            
            {/* Print Area Editor Toggle (Dev Mode Only) */}
            {isDevMode() && !showWizard && (
              <Button
                onClick={() => setEditorMode(!editorMode)}
                variant={editorMode ? "default" : "outline"}
                className={`transition-all ${
                  editorMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'border-blue-500 text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Settings className="w-4 h-4 mr-2" />
                {editorMode ? 'Exit Editor Mode' : 'Print Area Editor'}
              </Button>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold text-onyx mb-4 tracking-tight">
            Create Your Design
          </h1>
          <p className="text-lg text-carbon max-w-2xl mx-auto leading-relaxed">
            Upload your design, select a placement, and generate your preview
          </p>
        </motion.div>

        {/* Main Content */}
        {!showWizard && product ? (
          <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto relative">
            {/* Left Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:w-96 shrink-0"
            >
              <SimplePlacementPanel
                productId={productId}
                currentSide={currentSide}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                designImage={designImage}
                selectedPlacement={selectedPlacement}
                scale={scale}
                onSideChange={handleSideChange}
                onColorChange={setSelectedColor}
                onSizeChange={setSelectedSize}
                onImageUpload={setDesignImage}
                onPlacementChange={setSelectedPlacement}
                onScaleChange={setScale}
                onGeneratePreview={handleGeneratePreview}
                onChangeProduct={() => setShowChangeProduct(true)}
              />
            </motion.div>

            {/* Center Canvas */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex-1 flex items-center justify-center min-h-[600px] relative"
            >
              <div className="relative">
                <SimplePlacementCanvas
                  productId={productId}
                  currentSide={currentSide}
                  selectedColor={selectedColor}
                  designImage={designImage}
                  selectedPlacement={selectedPlacement}
                  scale={scale}
                  onCanvasReady={handleCanvasReady}
                />
                
                {/* Print Area Editor Overlay - Positioned over canvas */}
                {editorMode && (
                  <PrintAreaEditor
                    mockupWidth={mockupDimensions.width}
                    mockupHeight={mockupDimensions.height}
                    onClose={() => setEditorMode(false)}
                  />
                )}
              </div>
            </motion.div>
          </div>
        ) : null}

        {/* Help Text */}
        {!showWizard && product && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8 space-y-2"
          >
            <p className="text-sm text-graphite/70">
              💡 <span className="font-medium">Simple & Fast:</span> Upload design → Select placement → Adjust scale → Generate preview
            </p>
            <p className="text-xs text-graphite/50">
              Preview shows exactly how your design will look on the product
            </p>
          </motion.div>
        )}
      </div>

      {/* Product Wizard */}
      <AnimatePresence>
        {(showWizard || showChangeProduct) && (
          <ProductWizard
            onComplete={handleWizardComplete}
            onCancel={handleModalClose}
          />
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <SimplePreviewModal
        isOpen={showPreview}
        previewData={previewData}
        onClose={() => setShowPreview(false)}
      />
    </div>
  )
}

export default function CustomizerPage() {
  return (
    <ErrorBoundary>
      <Customizer />
    </ErrorBoundary>
  )
}