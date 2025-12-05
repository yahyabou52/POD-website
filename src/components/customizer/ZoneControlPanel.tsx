import { motion } from 'framer-motion'
import { ShoppingCart, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PRODUCT_TEMPLATES } from '@/config/productTemplates'

interface ZoneControlPanelProps {
  productId: string
  currentSide: 'front' | 'back'
  selectedColor: string
  selectedSize: string
  onSideChange: (side: 'front' | 'back') => void
  onColorChange: (color: string) => void
  onSizeChange: (size: string) => void
  onAddToCart: () => void
  onChangeProduct: () => void
}

export default function ZoneControlPanel({
  productId,
  currentSide,
  selectedColor,
  selectedSize,
  onSideChange,
  onColorChange,
  onSizeChange,
  onAddToCart,
  onChangeProduct,
}: ZoneControlPanelProps) {
  const product = PRODUCT_TEMPLATES[productId]

  if (!product) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-80 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-6"
    >
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500">
          Click on zones to add designs
        </p>
      </div>

      {/* Product Side */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-3 block">
          Product Side
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => onSideChange('front')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentSide === 'front'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Front
          </button>
          <button
            onClick={() => onSideChange('back')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentSide === 'back'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Back
          </button>
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-3 block">
          Product Color
        </label>
        <div className="flex gap-2 flex-wrap">
          {product.colors.map((color) => {
            const colorHex = color.hex || '#000000'
            const isWhite = color.name.toLowerCase() === 'white'
            
            return (
              <button
                key={color.name}
                onClick={() => onColorChange(color.name)}
                className={`w-8 h-8 rounded-md transition-all ${
                  isWhite ? 'border border-gray-300' : ''
                } ${
                  selectedColor === color.name
                    ? 'ring-2 ring-blue-600 ring-offset-2'
                    : 'hover:scale-110'
                }`}
                style={{ backgroundColor: colorHex }}
                title={color.name}
                aria-label={`Select ${color.name} color`}
              />
            )
          })}
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-3 block">
          Size
        </label>
        <div className="flex gap-2 flex-wrap">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => onSizeChange(size)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedSize === size
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-4 border-t">
        <Button
          onClick={onAddToCart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>

        <Button
          onClick={onChangeProduct}
          variant="outline"
          className="w-full"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Change Product
        </Button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-xs text-blue-800 font-medium mb-1">
          💡 How it works:
        </p>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Click any zone to upload a design</li>
          <li>• Designs auto-fit to zone size</li>
          <li>• Click filled zones to replace/remove</li>
        </ul>
      </div>
    </motion.div>
  )
}
