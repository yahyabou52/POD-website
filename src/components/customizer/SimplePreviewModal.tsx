import { motion, AnimatePresence } from 'framer-motion'
import { X, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PreviewData } from '@/config/placements'

interface SimplePreviewModalProps {
  isOpen: boolean
  previewData: PreviewData | null
  onClose: () => void
}

export default function SimplePreviewModal({
  isOpen,
  previewData,
  onClose,
}: SimplePreviewModalProps) {
  const handleDownload = () => {
    if (!previewData) return

    const link = document.createElement('a')
    link.href = previewData.preview
    link.download = `design-${previewData.design.productId}-${previewData.design.side}-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!isOpen || !previewData) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-mist flex-shrink-0">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-onyx">Design Preview</h2>
              <p className="text-xs md:text-sm text-carbon mt-1">
                {previewData.design.side.charAt(0).toUpperCase() + previewData.design.side.slice(1)} • 
                {' '}{previewData.design.color} • 
                {' '}{previewData.design.size}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-mist transition-colors flex items-center justify-center"
            >
              <X className="w-5 h-5 text-graphite" />
            </button>
          </div>

          {/* Preview Image - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
              <img
                src={previewData.preview}
                alt="Design Preview"
                className="max-w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Design Details - Sticky Footer */}
          <div className="p-4 md:p-6 border-t border-mist bg-mist/30 flex-shrink-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4">
              <div>
                <p className="text-xs text-carbon mb-1">Placement</p>
                <p className="text-xs md:text-sm font-medium text-onyx capitalize">
                  {previewData.design.placement.replace('-', ' ')}
                </p>
              </div>
              <div>
                <p className="text-xs text-carbon mb-1">Scale</p>
                <p className="text-xs md:text-sm font-medium text-onyx">{previewData.design.scale.toFixed(1)}x</p>
              </div>
              <div>
                <p className="text-xs text-carbon mb-1">Side</p>
                <p className="text-xs md:text-sm font-medium text-onyx capitalize">{previewData.design.side}</p>
              </div>
              <div>
                <p className="text-xs text-carbon mb-1">Color</p>
                <p className="text-xs md:text-sm font-medium text-onyx">{previewData.design.color}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                onClick={handleDownload}
                className="flex-1 h-11 md:h-12 font-semibold text-sm md:text-base"
              >
                <Download className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Download Preview
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="h-11 md:h-12 px-6 text-sm md:text-base"
              >
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
