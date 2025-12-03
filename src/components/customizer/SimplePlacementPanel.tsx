import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Image as ImageIcon, Eye, Settings, AlignLeft, AlignRight, AlignCenter, Maximize2, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PRODUCT_TEMPLATES } from '@/config/productTemplates'
import { getAvailablePlacementsForSide } from '@/config/printAreas'
import type { ProductSide, ProductType } from '@/types/customizer'

interface SimplePlacementPanelProps {
  productId: string
  currentSide: ProductSide
  selectedColor: string
  selectedSize: string
  designImage: string | null
  selectedPlacement: string | null
  scale: number
  onSideChange: (side: ProductSide) => void
  onColorChange: (color: string) => void
  onSizeChange: (size: string) => void
  onImageUpload: (image: string) => void
  onPlacementChange: (placement: string) => void
  onScaleChange: (scale: number) => void
  onGeneratePreview: () => void
  onChangeProduct: () => void
}

// Placement button configurations with icons
const PLACEMENT_CONFIGS: Record<string, { label: string; icon: React.ElementType }> = {
  topLeft: { label: 'Top Left', icon: AlignLeft },
  topRight: { label: 'Top Right', icon: AlignRight },
  centerTop: { label: 'Center Top', icon: AlignCenter },
  fullCenter: { label: 'Full Center', icon: Maximize2 },
  fullBack: { label: 'Full Back', icon: Square },
  centered: { label: 'Centered', icon: AlignCenter },
}

export default function SimplePlacementPanel({
  productId,
  currentSide,
  selectedColor,
  selectedSize,
  designImage,
  selectedPlacement,
  scale,
  onSideChange,
  onColorChange,
  onSizeChange,
  onImageUpload,
  onPlacementChange,
  onScaleChange,
  onGeneratePreview,
  onChangeProduct,
}: SimplePlacementPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const product = PRODUCT_TEMPLATES[productId]
  const productType = product?.type as ProductType
  const availablePlacements = getAvailablePlacementsForSide(productType, currentSide)

  // File upload handler
  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (result) {
        onImageUpload(result)
      }
    }
    reader.readAsDataURL(file)
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const getProductEmoji = (type: ProductType): string => {
    const emojis: Record<ProductType, string> = {
      tshirt: '👕',
      hoodie: '🧥',
      cap: '🧢',
      mug: '☕',
    }
    return emojis[type] || '👕'
  }

  if (!product) return null

  return (
    <div className="bg-white rounded-2xl border border-mist shadow-md h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-mist">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getProductEmoji(product.type)}</span>
            <div>
              <h3 className="font-semibold text-onyx">{product.name}</h3>
              <p className="text-sm text-carbon">{currentSide.charAt(0).toUpperCase() + currentSide.slice(1)}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onChangeProduct}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Upload Design */}
        <div>
          <label className="text-sm font-medium text-graphite mb-3 block flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Design
          </label>

          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging
                ? 'border-gold bg-gold/5'
                : designImage
                ? 'border-green-400 bg-green-50'
                : 'border-mist hover:border-carbon'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {designImage ? (
              <div className="space-y-3">
                <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden border-2 border-green-400">
                  <img src={designImage} alt="Design" className="w-full h-full object-cover" />
                </div>
                <p className="text-sm font-medium text-green-600">Design uploaded!</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs"
                >
                  <ImageIcon className="w-3 h-3 mr-1.5" />
                  Change Image
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto bg-mist rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-carbon" />
                </div>
                <div>
                  <p className="text-sm font-medium text-graphite mb-1">
                    Drop image here or click to browse
                  </p>
                  <p className="text-xs text-carbon">PNG, JPG, SVG up to 10MB</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose File
                </Button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>
        </div>

        {/* Placement Selection */}
        {availablePlacements.length > 0 && (
          <div>
            <label className="text-sm font-medium text-graphite mb-3 block">
              Select Placement
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availablePlacements.map((placement) => {
                const config = PLACEMENT_CONFIGS[placement] || { 
                  label: placement, 
                  icon: Square 
                }
                const Icon = config.icon
                
                return (
                  <button
                    key={placement}
                    onClick={() => onPlacementChange(placement)}
                    className={`px-3 py-2 rounded-xl border-2 transition-all flex items-center gap-2 justify-center text-sm ${
                      selectedPlacement === placement
                        ? 'border-royal bg-royal/10 text-royal font-medium'
                        : 'border-mist hover:bg-gray-100 text-graphite'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{config.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Scale Slider */}
        {selectedPlacement && (
          <div>
            <label className="text-sm font-medium text-graphite mb-3 block">
              Scale: {scale.toFixed(1)}x
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0.3"
                max="1.0"
                step="0.05"
                value={scale}
                onChange={(e) => onScaleChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-mist rounded-lg appearance-none cursor-pointer accent-royal"
              />
              <div className="flex justify-between text-xs text-carbon">
                <span>0.3x (Min)</span>
                <span>0.65x (Med)</span>
                <span>1.0x (Max)</span>
              </div>
            </div>
          </div>
        )}

        {/* Product Side */}
        <div>
          <label className="text-sm font-medium text-graphite mb-3 block">Product Side</label>
          <div className="flex gap-2 flex-wrap">
            {product.availableSides.map((side) => (
              <button
                key={side}
                onClick={() => onSideChange(side)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentSide === side
                    ? 'bg-onyx text-white'
                    : 'bg-mist text-carbon hover:bg-carbon hover:text-white'
                }`}
              >
                {side.charAt(0).toUpperCase() + side.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <label className="text-sm font-medium text-graphite mb-3 block">Product Color</label>
          <div className="flex gap-2 flex-wrap">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => onColorChange(color.name)}
                className={`w-12 h-12 rounded-lg border-2 transition-all ${
                  selectedColor === color.name
                    ? 'border-royal scale-110'
                    : 'border-mist hover:border-carbon'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div>
          <label className="text-sm font-medium text-graphite mb-3 block">Product Size</label>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => onSizeChange(size)}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  selectedSize === size
                    ? 'border-gold bg-gold text-white'
                    : 'border-mist bg-white text-graphite hover:border-carbon'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-mist space-y-3">
        <Button
          onClick={onGeneratePreview}
          disabled={!designImage || !selectedPlacement}
          className="w-full h-12 font-semibold"
        >
          <Eye className="w-5 h-5 mr-2" />
          Generate Preview
        </Button>

        {(!designImage || !selectedPlacement) && (
          <p className="text-xs text-center text-carbon">
            {!designImage ? 'Upload a design first' : 'Select a placement'}
          </p>
        )}
      </div>
    </div>
  )
}
