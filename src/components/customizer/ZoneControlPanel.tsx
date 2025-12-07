import { motion } from 'framer-motion'
import { ShoppingCart, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PRODUCT_TEMPLATES } from '@/config/productTemplates'
import { useToast } from '@/components/ui/toast'
import { useEffect, useRef } from 'react'

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
  const { toast } = useToast()
  const prevSideRef = useRef(currentSide)

  useEffect(() => {
    if (prevSideRef.current !== currentSide) {
      const sideName = currentSide === 'front' ? 'Front' : 'Back'
      toast.info(`Switched to ${sideName} view`, 'Add designs to this side or switch back to Front')
      prevSideRef.current = currentSide
    }
  }, [currentSide, toast])

  if (!product) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-80 bg-surface rounded-2xl shadow-luxury border border-border p-6 space-y-6"
    >
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          {product.name}
        </h3>
        <p className="text-sm text-text-primary/60">
          Click on zones to add designs
        </p>
      </div>

      {/* Product Side */}
      <div>
        <label className="text-sm font-medium text-text-primary mb-3 block">
          Product Side
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => onSideChange('front')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentSide === 'front'
                ? 'bg-primary text-text-on-primary shadow-gold-glow'
                : 'bg-background text-text-primary hover:bg-primary/10'
            }`}
          >
            Front
          </button>
          <button
            onClick={() => onSideChange('back')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentSide === 'back'
                ? 'bg-primary text-text-on-primary shadow-gold-glow'
                : 'bg-background text-text-primary hover:bg-primary/10'
            }`}
          >
            Back
          </button>
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <label className="text-sm font-medium text-text-primary mb-3 block">
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
                  isWhite ? 'border border-border' : ''
                } ${
                  selectedColor === color.name
                    ? 'ring-2 ring-primary ring-offset-2'
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
        <label className="text-sm font-medium text-text-primary mb-3 block">
          Size
        </label>
        <div className="flex gap-2 flex-wrap">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => onSizeChange(size)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedSize === size
                  ? 'bg-primary text-text-on-primary shadow-gold-glow'
                  : 'bg-background text-text-primary hover:bg-primary/10'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-4 border-t border-border">
        <Button
          onClick={onAddToCart}
          className="w-full bg-primary hover:bg-primary-dark text-text-on-primary shadow-gold-glow"
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
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <p className="text-xs text-primary-dark font-medium mb-1">
          💡 How it works:
        </p>
        <ul className="text-xs text-text-primary/70 space-y-1">
          <li>• Click any zone to upload a design</li>
          <li>• Designs auto-fit to zone size</li>
          <li>• Click filled zones to replace/remove</li>
        </ul>
      </div>
    </motion.div>
  )
}
