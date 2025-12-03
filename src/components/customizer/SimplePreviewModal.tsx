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
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-mist">
            <div>
              <h2 className="text-2xl font-semibold text-onyx">Design Preview</h2>
              <p className="text-sm text-carbon mt-1">
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

          {/* Preview Image */}
          <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg max-h-[60vh] flex items-center justify-center">
              <img
                src={previewData.preview}
                alt="Design Preview"
                className="max-w-full max-h-[60vh] object-contain"
              />
            </div>
          </div>

          {/* Design Details */}
          <div className="p-6 border-t border-mist bg-mist/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-carbon mb-1">Placement</p>
                <p className="text-sm font-medium text-onyx capitalize">
                  {previewData.design.placement.replace('-', ' ')}
                </p>
              </div>
              <div>
                <p className="text-xs text-carbon mb-1">Scale</p>
                <p className="text-sm font-medium text-onyx">{previewData.design.scale.toFixed(1)}x</p>
              </div>
              <div>
                <p className="text-xs text-carbon mb-1">Side</p>
                <p className="text-sm font-medium text-onyx capitalize">{previewData.design.side}</p>
              </div>
              <div>
                <p className="text-xs text-carbon mb-1">Color</p>
                <p className="text-sm font-medium text-onyx">{previewData.design.color}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleDownload}
                className="flex-1 h-12 font-semibold"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Preview
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="px-6"
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
