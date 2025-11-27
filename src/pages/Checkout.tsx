import { motion } from 'framer-motion'

export default function Checkout() {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Checkout
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Complete your order securely
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">🚧 Under Development</h2>
          <p className="text-muted-foreground">
            The checkout process is currently being built. This will include:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-left max-w-md mx-auto">
            <li>Secure payment processing</li>
            <li>Shipping address management</li>
            <li>Order confirmation</li>
            <li>Email notifications</li>
          </ul>
        </div>
      </motion.div>
    </div>
  )
}