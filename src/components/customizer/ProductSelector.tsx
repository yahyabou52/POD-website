import { motion } from 'framer-motion'

// This component is now replaced by ProductWizard
// Keeping for backward compatibility
export default function ProductSelector() {
  // const { productId } = useCustomizerStore()


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-mist shadow-md p-6"
    >
      <p className="text-sm text-graphite text-center">
        Product selection is now handled by the wizard
      </p>
    </motion.div>
  )
}
