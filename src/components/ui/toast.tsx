import { useState, useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/utils/cn'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastProps extends Toast {
  onClose: (id: string) => void
}

// Toast store (simple implementation)
class ToastStore {
  private listeners: ((toasts: Toast[]) => void)[] = []
  private toasts: Toast[] = []

  subscribe(listener: (toasts: Toast[]) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.toasts))
  }

  add(toast: Omit<Toast, 'id'>) {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    this.toasts.push(newToast)
    this.notify()

    // Auto remove after duration
    const duration = toast.duration ?? 5000
    if (duration > 0) {
      setTimeout(() => {
        this.remove(id)
      }, duration)
    }

    return id
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id)
    this.notify()
  }

  clear() {
    this.toasts = []
    this.notify()
  }
}

const toastStore = new ToastStore()

// Toast hook
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const unsubscribe = toastStore.subscribe(setToasts)
    return unsubscribe
  }, [])

  const toast = {
    success: (title: string, message?: string, options?: Partial<Toast>) =>
      toastStore.add({ type: 'success', title, message, ...options }),
    error: (title: string, message?: string, options?: Partial<Toast>) =>
      toastStore.add({ type: 'error', title, message, ...options }),
    info: (title: string, message?: string, options?: Partial<Toast>) =>
      toastStore.add({ type: 'info', title, message, ...options }),
    warning: (title: string, message?: string, options?: Partial<Toast>) =>
      toastStore.add({ type: 'warning', title, message, ...options }),
    remove: (id: string) => toastStore.remove(id),
    clear: () => toastStore.clear()
  }

  return { toast, toasts }
}

// Toast component
function ToastComponent({ id, type, title, message, action, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose(id), 150)
  }

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle
  }

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900'
  }

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    info: 'text-blue-500',
    warning: 'text-yellow-500'
  }

  const Icon = icons[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : 50, 
        scale: isVisible ? 1 : 0.3 
      }}
      exit={{ opacity: 0, y: 50, scale: 0.3 }}
      transition={{ 
        type: "spring",
        damping: 25,
        stiffness: 300
      }}
      className={cn(
        'relative w-full max-w-sm p-4 rounded-xl border shadow-lg backdrop-blur-sm',
        colors[type]
      )}
    >
      <div className="flex items-start space-x-3">
        <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', iconColors[type])} />
        
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{title}</p>
          {message && (
            <p className="mt-1 text-sm opacity-90">{message}</p>
          )}
          
          {action && (
            <div className="mt-3">
              <Button
                size="sm"
                variant="ghost"
                className="text-xs font-medium p-1 h-auto hover:bg-white/20"
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="h-6 w-6 p-0 hover:bg-white/20 rounded-full opacity-70 hover:opacity-100"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  )
}

// Toast container
export function ToastContainer() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastComponent
              {...toast}
              onClose={(id) => toastStore.remove(id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Toast provider component (add to your app root)
export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  )
}