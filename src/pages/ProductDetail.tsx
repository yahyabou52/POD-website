import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCartStore } from '@/store/cart'
import { useToast } from '@/components/ui/toast'
import { PRODUCT_TEMPLATES } from '@/config/productTemplates'
import { ArrowLeft, ShoppingCart, Palette } from 'lucide-react'
import type { ProductTemplate } from '@/types/customizer'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()

  const [product, setProduct] = useState<ProductTemplate | null>(null)
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [imageLoading, setImageLoading] = useState(true)

  useEffect(() => {
    if (id && PRODUCT_TEMPLATES[id]) {
      const foundProduct = PRODUCT_TEMPLATES[id]
      setProduct(foundProduct)
      setSelectedSize(foundProduct.sizes[2] || foundProduct.sizes[0]) // Default to M or first size
    }
  }, [id])

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-semibold text-onyx mb-4">Product Not Found</h2>
          <p className="text-carbon mb-6">The product you're looking for doesn't exist.</p>
          <Link to="/products">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  const selectedColor = product.colors[selectedColorIndex]
  const currentImage = selectedColor?.mockups?.front || selectedColor?.image || '/src/assets/tshirt-placeholder.svg'

  const handleCustomize = () => {
    navigate(`/customizer?product=${product.id}&color=${selectedColor.name}&size=${selectedSize}`)
  }

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: selectedColor?.image || '/src/assets/tshirt-placeholder.svg',
      color: selectedColor.name,
      size: selectedSize,
      price: product.basePrice,
    })
    
    toast.success('Added to cart!', `${product.name} (${selectedColor.name}, ${selectedSize})`)
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back Button */}
        <Link to="/products" className="inline-flex items-center text-carbon hover:text-onyx mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Product Image */}
            <div className="relative">
              <div className="sticky top-8">
                <div className="relative bg-white rounded-xl overflow-hidden shadow-sm border border-mist aspect-square flex items-center justify-center">
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-surface">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  )}
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="w-full h-full object-contain p-8"
                    onLoad={() => setImageLoading(false)}
                    onError={(e) => {
                      setImageLoading(false)
                      e.currentTarget.src = '/src/assets/tshirt-placeholder.svg'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Product Information */}
            <div className="space-y-8">
              {/* Product Name & Price */}
              <div>
                <h1 className="text-3xl md:text-4xl font-semibold text-onyx mb-3 tracking-tight">
                  {product.name}
                </h1>
                <p className="text-3xl font-semibold text-primary">
                  ${product.basePrice.toFixed(2)}
                </p>
              </div>

              {/* Product Description */}
              <div>
                <p className="text-carbon leading-relaxed">
                  High-quality {product.type} perfect for custom designs. Made from premium materials 
                  for maximum comfort and durability. Create your unique design or choose from our 
                  ready-made templates.
                </p>
              </div>

              {/* Color Selector */}
              <div>
                <h3 className="text-sm font-semibold text-onyx mb-3 uppercase tracking-wide">
                  Color: {selectedColor.name}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedColorIndex(index)
                        setImageLoading(true)
                      }}
                      className={`
                        w-12 h-12 rounded-lg border-2 transition-all duration-200 
                        hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                        ${selectedColorIndex === index 
                          ? 'border-primary ring-2 ring-primary ring-offset-2 scale-110' 
                          : 'border-mist hover:border-graphite'
                        }
                      `}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                      aria-label={`Select ${color.name} color`}
                    >
                      {/* Add checkmark for better accessibility */}
                      {selectedColorIndex === index && (
                        <span className="flex items-center justify-center">
                          <svg
                            className="w-6 h-6"
                            style={{ color: color.hex === '#FFFFFF' || color.hex === '#ffffff' ? '#000000' : '#FFFFFF' }}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <h3 className="text-sm font-semibold text-onyx mb-3 uppercase tracking-wide">
                  Size: {selectedSize}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`
                        px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                        ${selectedSize === size
                          ? 'bg-onyx text-white shadow-md'
                          : 'bg-white border-2 border-mist text-onyx hover:border-graphite hover:shadow-sm'
                        }
                      `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleCustomize}
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  <Palette className="h-5 w-5 mr-2" />
                  Customize This Product
                </Button>
                
                <Button
                  onClick={handleAddToCart}
                  variant="carbon"
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              </div>

              {/* Product Details */}
              <div className="border-t border-mist pt-6 mt-6">
                <h3 className="text-sm font-semibold text-onyx mb-4 uppercase tracking-wide">
                  Product Details
                </h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-carbon">Available Sides:</dt>
                    <dd className="text-onyx font-medium">
                      {product.availableSides.join(', ')}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-carbon">Colors Available:</dt>
                    <dd className="text-onyx font-medium">{product.colors.length}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-carbon">Sizes Available:</dt>
                    <dd className="text-onyx font-medium">{product.sizes.join(', ')}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
