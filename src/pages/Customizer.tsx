import { useEffect, useState } from 'react'
import ProductWizard from '@/components/customizer/ProductWizard'
import ProductCanvas from '@/components/customizer/ProductCanvas'
import CustomizerPanel from '@/components/customizer/CustomizerPanel'
import { useCustomizerStore } from '@/store/customizer'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Settings } from 'lucide-react'
import type { ProductSelection } from '@/types/customizer'

export default function Customizer() {
  const [showWizard, setShowWizard] = useState(true)
  const [showChangeProduct, setShowChangeProduct] = useState(false)
  const { productId, setProductFromSelection, undo, redo, canUndo, canRedo } = useCustomizerStore()

  const handleWizardComplete = (selection: ProductSelection) => {
    setProductFromSelection(selection)
    setShowWizard(false)
    setShowChangeProduct(false)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        if (canUndo()) {
          undo()
        }
      }
      
      // Redo: Ctrl+Y or Ctrl+Shift+Z or Cmd+Shift+Z
      if (
        ((e.ctrlKey || e.metaKey) && e.key === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')
      ) {
        e.preventDefault()
        if (canRedo()) {
          redo()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, canUndo, canRedo])

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
            <span>Premium Design Studio</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold text-onyx mb-4 tracking-tight">
            Create Your Design
          </h1>
          <p className="text-lg text-carbon max-w-2xl mx-auto leading-relaxed">
            Professional customization tools with drag & drop, resize, and advanced layer control
          </p>
        </motion.div>

        {/* Main Content */}
        {!showWizard && productId ? (
          <>
            {/* Change Product Button */}
            <div className="mb-6 flex justify-center">
              <button
                onClick={() => setShowChangeProduct(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-gold transition-colors"
              >
                <Settings size={18} />
                Change Product
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
              {/* Canvas */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex-1"
              >
                <ProductCanvas />
              </motion.div>

              {/* Control Panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:w-96"
              >
                <CustomizerPanel />
              </motion.div>
            </div>

            {/* Help Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-8 space-y-2"
            >
              <p className="text-sm text-graphite/70">
                💡 <span className="font-medium">Pro tip:</span> Drag to move, use corner handles to resize
              </p>
              <p className="text-xs text-graphite/50">
                All designs are saved automatically • Keyboard: Ctrl+Z (Undo), Ctrl+Y (Redo), Del (Delete)
              </p>
            </motion.div>
          </>
        ) : null}
      </div>

      {/* Product Wizard */}
      <AnimatePresence>
        {(showWizard || showChangeProduct) && (
          <ProductWizard
            onComplete={handleWizardComplete}
            onCancel={() => {
              if (!productId) return
              setShowChangeProduct(false)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}