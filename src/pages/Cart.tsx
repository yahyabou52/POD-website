import { motion } from 'framer-motion'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Eye, Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useToast } from '@/components/ui/toast'
import { useState } from 'react'

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore()
  const { toast } = useToast()
  const [previewItem, setPreviewItem] = useState<any>(null)
  const [showPreview, setShowPreview] = useState(false)

  const totalPrice = getTotalPrice()
  const shipping = totalPrice > 50 ? 0 : 9.99
  const tax = totalPrice * 0.08
  const finalTotal = totalPrice + shipping + tax

  const handleRemove = (id: string, name: string) => {
    removeItem(id)
    toast.success('Removed from cart', name)
  }

  const handleClearCart = () => {
    if (items.length > 0) {
      clearCart()
      toast.success('Cart cleared', 'All items removed')
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-surface rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-16 w-16 text-carbon/40" />
            </div>
            <h1 className="text-3xl font-semibold text-onyx mb-4">Your Cart is Empty</h1>
            <p className="text-lg text-carbon mb-8">
              Start shopping and add some amazing products to your cart!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="w-full sm:w-auto">
                  Browse Products
                </Button>
              </Link>
              <Link to="/customizer">
                <Button variant="carbon" size="lg" className="w-full sm:w-auto">
                  Create Custom Design
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-onyx mb-2 tracking-tight">
            Your Cart
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-carbon">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
            {items.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-sm text-carbon hover:text-onyx transition-colors"
              >
                Clear cart
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-surface rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <img
                        src={item.image || '/src/assets/tshirt-placeholder.svg'}
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          e.currentTarget.src = '/src/assets/tshirt-placeholder.svg'
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-onyx mb-1 tracking-tight">
                        {item.name}
                      </h3>
                      <p className="text-sm text-carbon mb-2">
                        {item.color} • {item.size}
                      </p>
                      <p className="text-lg font-semibold text-primary">
                        ${item.price.toFixed(2)}
                      </p>
                      {item.designUrl && (
                        <button
                          onClick={() => {
                            setPreviewItem(item)
                            setShowPreview(true)
                          }}
                          className="mt-2 text-sm text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View Design
                        </button>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => handleRemove(item.id, item.name)}
                        className="text-carbon hover:text-red-500 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg border-2 border-mist hover:border-graphite flex items-center justify-center transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium text-onyx">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg border-2 border-mist hover:border-graphite flex items-center justify-center transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-onyx mb-6 tracking-tight">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-carbon">
                    <span>Subtotal</span>
                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-carbon">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-accent-emerald">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-carbon">
                    <span>Tax (8%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  
                  {totalPrice < 50 && (
                    <div className="bg-surface rounded-lg p-3 mt-4">
                      <p className="text-xs text-carbon">
                        Add <span className="font-semibold text-primary">${(50 - totalPrice).toFixed(2)}</span> more for free shipping!
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t border-mist pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-onyx">Total</span>
                    <span className="text-2xl font-semibold text-primary">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Link to="/checkout">
                  <Button className="w-full h-12 text-base font-medium" size="lg">
                    Proceed to Checkout
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>

                <Link to="/products" className="block mt-3">
                  <Button variant="ghost" className="w-full" size="lg">
                    Continue Shopping
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && previewItem && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPreview(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-onyx">
                  Design Preview
                </h2>
                <p className="text-carbon">
                  {previewItem.name} • {previewItem.color} • {previewItem.size}
                </p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-carbon hover:text-onyx transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="bg-surface rounded-xl p-8 mb-6">
              <img
                src={previewItem.designUrl || previewItem.image}
                alt="Design preview"
                className="w-full h-auto max-h-[60vh] object-contain mx-auto"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = previewItem.designUrl || previewItem.image
                  link.download = `${previewItem.name}-${previewItem.color}-${previewItem.size}.png`
                  link.click()
                  toast.success('Downloaded', 'Design image downloaded')
                }}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Design
              </Button>
              <Button
                onClick={() => setShowPreview(false)}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
} 
