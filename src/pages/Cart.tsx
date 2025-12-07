import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/toast'

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore()
  const [promoCode, setPromoCode] = useState('')
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [itemToRemove, setItemToRemove] = useState<string | null>(null)
  const { toast } = useToast()

  const totalPrice = getTotalPrice()
  const shipping = totalPrice > 50 ? 0 : 9.99
  const tax = totalPrice * 0.08
  const finalTotal = totalPrice + shipping + tax

  const handleRemoveClick = (itemId: string) => {
    setItemToRemove(itemId)
    setShowRemoveConfirm(true)
  }

  const confirmRemove = () => {
    if (itemToRemove) {
      removeItem(itemToRemove)
      toast.success('Item removed', 'Product removed from cart')
      setItemToRemove(null)
    }
  }

  const handleClearClick = () => {
    setShowClearConfirm(true)
  }

  const confirmClear = () => {
    clearCart()
    toast.success('Cart cleared', 'All items removed from cart')
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <ShoppingCart className="h-24 w-24 text-muted-foreground mx-auto mb-8" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Start shopping and add some amazing products to your cart!
          </p>
          <div className="space-x-4">
            <Link to="/products">
              <Button size="lg">Browse Products</Button>
            </Link>
            <Link to="/customizer">
              <Button variant="outline" size="lg">Create Custom Design</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen justify-center items-center py-20 px-4">
      <div className="flex justify-center mb-6">
        <img src="/src/assets/printelya logo.svg" alt="Printelya Logo" className="h-12" />
      </div>
      <div className="w-full max-w-4xl p-10 bg-white shadow-xl rounded-2xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Shopping Cart
          </h1>
          <p className="text-lg text-muted-foreground">
            Review your items and proceed to checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.designUrl ? (
                          <img 
                            src={item.designUrl} 
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-500">No Design</span>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{item.productName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Size: {item.size} | Color: 
                          <span 
                            className="inline-block w-4 h-4 rounded-full ml-2 border"
                            style={{ backgroundColor: item.color }}
                          />
                        </p>
                        <p className="text-lg font-bold text-primary mt-2">${item.price}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Remove Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveClick(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={handleClearClick}>
                Clear Cart
              </Button>
              <Link to="/products">
                <Button variant="ghost">Continue Shopping</Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Add ${(50 - totalPrice).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Promo Code */}
            <Card>
              <CardHeader>
                <CardTitle>Promo Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button variant="outline">Apply</Button>
                </div>
              </CardContent>
            </Card>

            {/* Checkout Button */}
            <Link to="/checkout" className="block">
              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </Link>

            {/* Security Badge */}
            <div className="text-center text-sm text-muted-foreground">
              🔒 Secure checkout with SSL encryption
            </div>
          </div>
        </div>
      </div>

      {/* Remove Item Confirmation Dialog */}
      <ConfirmDialog
        open={showRemoveConfirm}
        title="Remove Item"
        description="Are you sure you want to remove this item from your cart?"
        confirmLabel="Remove"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={confirmRemove}
        onCancel={() => setShowRemoveConfirm(false)}
      />

      {/* Clear Cart Confirmation Dialog */}
      <ConfirmDialog
        open={showClearConfirm}
        title="Clear Cart"
        description="Are you sure you want to remove all items from your cart? This action cannot be undone."
        confirmLabel="Clear All"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={confirmClear}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  )
}