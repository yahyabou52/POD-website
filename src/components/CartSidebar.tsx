import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/toast'

export default function CartSidebar() {
  const { isOpen, toggleCart, items, removeItem, updateQuantity, getTotalPrice } = useCartStore()
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const [itemToRemove, setItemToRemove] = useState<string | null>(null)
  const { toast } = useToast()

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/20 z-40"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-surface border-l border-border shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h2 className="text-lg font-semibold text-text-primary">Shopping Cart</h2>
              <Button variant="ghost" size="sm" onClick={toggleCart}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                  <Button 
                    className="mt-4" 
                    onClick={toggleCart}
                    asChild
                  >
                    <Link to="/products">Start Shopping</Link>
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                          {item.designUrl && (
                            <img 
                              src={item.designUrl} 
                              alt={item.productName}
                              className="w-full h-full object-cover rounded"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm">{item.productName}</h4>
                          <p className="text-xs text-muted-foreground">
                            {item.size} | {item.color}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-6 w-6 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-xs w-6 text-center">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-6 w-6 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveClick(item.id)}
                                className="text-red-500 hover:text-red-700 h-4 px-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-border space-y-4 bg-surface">
                <div className="flex justify-between items-center text-lg font-semibold text-text-primary">
                  <span>Total:</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="space-y-2">
                  <Link to="/cart" onClick={toggleCart}>
                    <Button variant="outline" className="w-full">
                      View Cart
                    </Button>
                  </Link>
                  <Link to="/checkout" onClick={toggleCart}>
                    <Button className="w-full">
                      Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}

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
    </AnimatePresence>
  )
}