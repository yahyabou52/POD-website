import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, Shirt, Coffee } from 'lucide-react'
import { PiHoodie, PiBaseballCap } from 'react-icons/pi'
import type { ProductSelection } from '@/types/customizer'
import { getProductTemplate } from '@/config/productTemplates'

interface ProductWizardProps {
  onComplete: (selection: ProductSelection) => void
  onCancel?: () => void
}

export default function ProductWizard({ onComplete, onCancel }: ProductWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selection, setSelection] = useState<ProductSelection>({})

  const totalSteps = selection.productType === 'tshirt' ? 4 : 
                     selection.productType === 'hoodie' ? 3 : 
                     ['cap', 'mug'].includes(selection.productType!) ? 3 : 2

  // Step 1: Product Type
  const productTypes = [
    { id: 'tshirt', name: 'T-Shirt', icon: Shirt, description: 'Classic tees' },
    { id: 'hoodie', name: 'Hoodie', icon: PiHoodie, description: 'Cozy hoodies' },
    { id: 'cap', name: 'Cap', icon: PiBaseballCap, description: 'Baseball caps' },
    { id: 'mug', name: 'Mug', icon: Coffee, description: 'Ceramic mugs' },
  ]

  // Step 2: Fit Type (T-shirt & Hoodie)
  const fitTypes = [
    { id: 'regular', name: 'Regular Fit', description: 'Classic comfortable fit' },
    { id: 'oversize', name: 'Oversize Fit', description: 'Relaxed oversized style' },
  ]

  // Step 3: Sleeve Type (T-shirt only)
  const sleeveTypes = [
    { id: 'short', name: 'Short Sleeve', description: 'Classic short sleeves' },
    { id: 'full', name: 'Full Sleeve', description: 'Long sleeve style' },
  ]

  // Step 2: Cap Type (Cap only)
  const capTypes = [
    { id: 'baseball', name: 'Baseball Cap', description: 'Classic 6-panel cap' },
    { id: 'trucker', name: 'Trucker Cap', description: 'Mesh back cap' },
  ]

  // Step 2: Mug Type (Mug only)
  const mugTypes = [
    { id: 'ceramic', name: 'Ceramic Mug', description: 'Classic coffee mug' },
    { id: 'travel', name: 'Travel Mug', description: 'Insulated travel tumbler' },
  ]

  const handleNext = () => {
    // Step 1: Product Type -> next
    if (currentStep === 1 && selection.productType) {
      setCurrentStep(2)
    } 
    // Step 2: Fit Type (tshirt/hoodie) or Product Type (cap/mug) -> next
    else if (currentStep === 2) {
      if (selection.productType === 'tshirt' && selection.fitType) {
        setCurrentStep(3) // Go to sleeve selection
      } else if (selection.productType === 'hoodie' && selection.fitType) {
        setCurrentStep(3) // Go to color/size
      } else if (selection.productType === 'cap' && selection.capType) {
        setCurrentStep(3) // Go to color/size
      } else if (selection.productType === 'mug' && selection.mugType) {
        setCurrentStep(3) // Go to color/size
      }
    }
    // Step 3: Sleeve (tshirt) or Color/Size (hoodie/cap/mug) -> next or complete
    else if (currentStep === 3) {
      if (selection.productType === 'tshirt' && selection.sleeveType) {
        setCurrentStep(4) // Go to color/size
      } else if (selection.color && selection.size) {
        // Complete for hoodie/cap/mug
        onComplete({ ...selection, printArea: 'front' })
      }
    }
    // Step 4: Color/Size (tshirt only) -> complete
    else if (currentStep === 4 && selection.color && selection.size) {
      onComplete({ ...selection, printArea: 'front' })
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else if (onCancel) {
      onCancel()
    }
  }

  const canProceed = () => {
    if (currentStep === 1) return !!selection.productType
    if (currentStep === 2) {
      if (selection.productType === 'tshirt' || selection.productType === 'hoodie') {
        return !!selection.fitType
      }
      if (selection.productType === 'cap') return !!selection.capType
      if (selection.productType === 'mug') return !!selection.mugType
    }
    if (currentStep === 3) {
      if (selection.productType === 'tshirt') return !!selection.sleeveType
      // For hoodie/cap/mug, step 3 is color/size
      return !!selection.color && !!selection.size
    }
    if (currentStep === 4) return !!selection.color && !!selection.size
    return false
  }

  // Get current template
  const template = getProductTemplate(
    selection.productType || '',
    selection.fitType,
    selection.sleeveType,
    selection.capType,
    selection.mugType
  )

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-onyx to-carbon text-white px-4 sm:px-8 py-4 sm:py-6">
          <h2 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">Design Your Product</h2>
          <p className="text-sm sm:text-base text-mist/80">Choose your perfect combination</p>
          
          {/* Progress */}
          <div className="flex items-center gap-1 sm:gap-2 mt-4 sm:mt-6">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all ${
                  i + 1 <= currentStep ? 'bg-gold' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Product Type */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Select Product Type</h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {productTypes.map((product) => {
                    const IconComponent = product.icon
                    return (
                      <button
                        key={product.id}
                        onClick={() => setSelection({ productType: product.id as any })}
                        className={`p-4 sm:p-6 rounded-xl border-2 transition-all text-left ${
                          selection.productType === product.id
                            ? 'border-gold bg-gold/5'
                            : 'border-gray-200 hover:border-gold/50'
                        }`}
                      >
                        <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3 text-onyx" strokeWidth={1.5} />
                        <h4 className="text-base sm:text-xl font-semibold mb-1">{product.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">{product.description}</p>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 2: Fit Type */}
            {currentStep === 2 && ['tshirt', 'hoodie'].includes(selection.productType!) && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Choose Fit Type</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {fitTypes.map((fit) => (
                    <button
                      key={fit.id}
                      onClick={() => setSelection({ ...selection, fitType: fit.id as any })}
                      className={`p-6 sm:p-8 rounded-xl border-2 transition-all text-left ${
                        selection.fitType === fit.id
                          ? 'border-gold bg-gold/5'
                          : 'border-gray-200 hover:border-gold/50'
                      }`}
                    >
                      <h4 className="text-lg sm:text-xl font-semibold mb-2">{fit.name}</h4>
                      <p className="text-sm sm:text-base text-gray-600">{fit.description}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Cap Type */}
            {currentStep === 2 && selection.productType === 'cap' && (
              <motion.div
                key="step2-cap"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Choose Cap Type</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {capTypes.map((cap) => (
                    <button
                      key={cap.id}
                      onClick={() => setSelection({ ...selection, capType: cap.id as any })}
                      className={`p-6 sm:p-8 rounded-xl border-2 transition-all text-left ${
                        selection.capType === cap.id
                          ? 'border-gold bg-gold/5'
                          : 'border-gray-200 hover:border-gold/50'
                      }`}
                    >
                      <h4 className="text-lg sm:text-xl font-semibold mb-2">{cap.name}</h4>
                      <p className="text-sm sm:text-base text-gray-600">{cap.description}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Mug Type */}
            {currentStep === 2 && selection.productType === 'mug' && (
              <motion.div
                key="step2-mug"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Choose Mug Type</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {mugTypes.map((mug) => (
                    <button
                      key={mug.id}
                      onClick={() => setSelection({ ...selection, mugType: mug.id as any })}
                      className={`p-6 sm:p-8 rounded-xl border-2 transition-all text-left ${
                        selection.mugType === mug.id
                          ? 'border-gold bg-gold/5'
                          : 'border-gray-200 hover:border-gold/50'
                      }`}
                    >
                      <h4 className="text-lg sm:text-xl font-semibold mb-2">{mug.name}</h4>
                      <p className="text-sm sm:text-base text-gray-600">{mug.description}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Sleeve Type (T-shirt only) */}
            {currentStep === 3 && selection.productType === 'tshirt' && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Choose Sleeve Type</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {sleeveTypes.map((sleeve) => (
                    <button
                      key={sleeve.id}
                      onClick={() => setSelection({ ...selection, sleeveType: sleeve.id as any })}
                      className={`p-6 sm:p-8 rounded-xl border-2 transition-all text-left ${
                        selection.sleeveType === sleeve.id
                          ? 'border-gold bg-gold/5'
                          : 'border-gray-200 hover:border-gold/50'
                      }`}
                    >
                      <h4 className="text-lg sm:text-xl font-semibold mb-2">{sleeve.name}</h4>
                      <p className="text-sm sm:text-base text-gray-600">{sleeve.description}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Color & Size - Final Step */}
            {((currentStep === 4 && selection.productType === 'tshirt') ||
              (currentStep === 3 && ['hoodie', 'cap', 'mug'].includes(selection.productType!))) && template && (
              <motion.div
                key="step-final"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Color & Size</h3>
                
                <div className="mb-6 sm:mb-8">
                  <h4 className="font-semibold mb-3">Select Color</h4>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {template.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelection({ ...selection, color: color.name })}
                        className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                          selection.color === color.name
                            ? 'border-gold'
                            : 'border-gray-200 hover:border-gold/50'
                        }`}
                      >
                        <div
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mb-2"
                          style={{ backgroundColor: color.hex }}
                        />
                        <p className="text-xs font-medium">{color.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Select Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {template.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelection({ ...selection, size })}
                        className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg border-2 font-medium transition-all text-sm sm:text-base ${
                          selection.size === size
                            ? 'border-gold bg-gold/5'
                            : 'border-gray-200 hover:border-gold/50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} className="sm:block hidden" />
            <ChevronLeft size={16} className="sm:hidden" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="text-xs sm:text-sm text-gray-600">
            Step {currentStep} of {totalSteps}
          </div>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg font-semibold transition-all ${
              canProceed()
                ? 'bg-gold text-white hover:bg-gold/90'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentStep === totalSteps ? (
              <>
                <Check size={16} className="sm:hidden" />
                <Check size={20} className="hidden sm:block" />
                <span className="hidden sm:inline">Start Designing</span>
                <span className="sm:hidden">Start</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={16} className="sm:hidden" />
                <ChevronRight size={20} className="hidden sm:block" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
