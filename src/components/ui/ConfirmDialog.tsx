import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, X } from 'lucide-react'
import { Button } from './button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'danger'
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-luxury-lg max-w-md w-full overflow-hidden border border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start gap-4 p-6 border-b border-gray-100">
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                variant === 'danger'
                  ? 'bg-red-100'
                  : 'bg-brand-gold/10'
              }`}
            >
              <AlertCircle
                className={`w-5 h-5 ${
                  variant === 'danger' ? 'text-red-600' : 'text-brand-gold'
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-carbon mb-1">
                {title}
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {description}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 p-6 bg-gradient-to-r from-brand-gold/5 to-brand-gold-dark/5">
            <Button
              onClick={onCancel}
              variant="outline"
              className="px-6"
            >
              {cancelLabel}
            </Button>
            <Button
              onClick={() => {
                onConfirm()
                onCancel()
              }}
              className={
                variant === 'danger'
                  ? 'bg-red-600 hover:bg-red-700 text-white px-6'
                  : 'bg-gradient-to-r from-brand-gold to-brand-gold-dark hover:shadow-gold-glow text-white px-6'
              }
            >
              {confirmLabel}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
