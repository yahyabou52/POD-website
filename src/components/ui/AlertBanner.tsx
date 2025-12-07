import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import type { ReactNode } from 'react'

type AlertType = 'success' | 'error' | 'warning' | 'info'

interface AlertBannerProps {
  show: boolean
  type: AlertType
  message: string
  onClose?: () => void
  autoClose?: boolean
  duration?: number
}

const alertStyles: Record<AlertType, { bg: string; border: string; text: string; icon: ReactNode }> = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: <XCircle className="w-5 h-5 text-red-600" />,
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: <Info className="w-5 h-5 text-blue-600" />,
  },
}

export default function AlertBanner({
  show,
  type,
  message,
  onClose,
  autoClose = true,
  duration = 5000,
}: AlertBannerProps) {
  const styles = alertStyles[type]

  // Auto close
  if (show && autoClose && duration > 0) {
    setTimeout(() => {
      onClose?.()
    }, duration)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className={`${styles.bg} ${styles.border} border-l-4 rounded-r-lg shadow-md`}
        >
          <div className="flex items-center gap-3 p-4">
            <div className="flex-shrink-0">{styles.icon}</div>
            <p className={`flex-1 text-sm font-medium ${styles.text}`}>
              {message}
            </p>
            {onClose && (
              <button
                onClick={onClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
