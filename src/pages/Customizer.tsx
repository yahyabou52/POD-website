import { useState, useRef } from 'react'
import ProductWizard from '@/components/customizer/ProductWizard'
import ZoneBasedCanvas from '@/components/customizer/ZoneBasedCanvas'
import ZoneControlPanel from '@/components/customizer/ZoneControlPanel'
import SimplePreviewModal from '@/components/customizer/SimplePreviewModal'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import type { ProductSelection } from '@/types/customizer'
import type { PreviewData } from '@/config/placements'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import { useNavigate, useLocation } from 'react-router-dom'
import { PRODUCT_TEMPLATES } from '@/config/productTemplates'
import { useCartStore } from '@/store/cart'
import { useToast } from '@/components/ui/use-toast'
import { useCustomizerStore } from '@/store/customizerStore'

function Customizer() {
  const navigate = useNavigate()
  const location = useLocation()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { addToast } = useToast()
  
  // Store state
  const productSide = useCustomizerStore((state) => state.productSide)
  const setProductSide = useCustomizerStore((state) => state.setProductSide)
  const zonePlacements = useCustomizerStore((state) => state.zonePlacements)
  const clearAllZones = useCustomizerStore((state) => state.clearAllZones)
  
  const [showWizard, setShowWizard] = useState(true)
  const [showChangeProduct, setShowChangeProduct] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  
  // Product state
  const [productId, setProductId] = useState<string>('tshirt-regular-short')
  const [selectedColor, setSelectedColor] = useState('White')
  const [selectedSize, setSelectedSize] = useState('M')

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
    setProductSide('front')
    setSelectedColor(selection.color || template.colors[0].name)
    setSelectedSize(selection.size || template.sizes[0])
    clearAllZones()
    
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

  const handleCanvasReady = (canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas
  }

  const handleAddToCart = () => {
    if (!canvasRef.current) {
      addToast({
        title: '⚠️ No Design',
        description: 'Please add at least one design to a zone',
        duration: 3000
      })
      return
    }

    // Check if any zones have designs
    const hasDesigns = Object.values(zonePlacements).some(p => p !== null)
    if (!hasDesigns) {
      addToast({
        title: '⚠️ No Design',
        description: 'Please add at least one design to a zone',
        duration: 3000
      })
      return
    }

    // Export canvas as image
    const previewImage = canvasRef.current.toDataURL('image/png')
    
    // Add to cart store
    useCartStore.getState().addItem({
      productId,
      productType: product!.type,
      productName: product!.name,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
      price: product!.basePrice,
      customDesign: {
        imageUrl: previewImage,
        position: { x: 0, y: 0 },
        scale: 1,
        rotation: 0
      },
      designUrl: previewImage
    })

    addToast({
      title: '✅ Added to Cart',
      description: `${product!.name} (${selectedColor}, ${selectedSize})`,
      duration: 3000
    })
    
    // Show preview
    const preview: PreviewData = {
      preview: previewImage,
      design: {
        image: previewImage,
        placement: 'zone-based',
        scale: 1,
        side: productSide,
        color: selectedColor,
        size: selectedSize,
        productId,
      },
      timestamp: Date.now(),
    }

    setPreviewData(preview)
    setShowPreview(true)
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
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-onyx rounded-full text-sm font-medium text-white shadow-lg mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Zone-Based Designer</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold text-onyx mb-4 tracking-tight">
            Create Your Design
          </h1>
          <p className="text-lg text-carbon max-w-2xl mx-auto leading-relaxed">
            Click on zones to add your designs
          </p>
        </motion.div>

        {/* Main Content */}
        {!showWizard && product ? (
          <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
            {/* Left Column - Control Panel */}
            <ZoneControlPanel
              productId={productId}
              currentSide={productSide}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              onSideChange={setProductSide}
              onColorChange={setSelectedColor}
              onSizeChange={setSelectedSize}
              onAddToCart={handleAddToCart}
              onChangeProduct={() => setShowChangeProduct(true)}
            />

            {/* Center - Canvas */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-1 flex items-center justify-center min-h-[600px]"
            >
              <ZoneBasedCanvas
                productId={productId}
                currentSide={productSide}
                selectedColor={selectedColor}
                onCanvasReady={handleCanvasReady}
              />
            </motion.div>
          </div>
        ) : null}
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