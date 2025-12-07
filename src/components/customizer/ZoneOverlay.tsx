import { Upload, X, Pencil } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import type { PrintZone } from '@/config/printAreas'
import { useToast } from '@/components/ui/toast'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface ZoneOverlayProps {
  zone: PrintZone
  hasImage: boolean
  imageUrl?: string
  onUpload: (file: File, imageUrl: string) => void
  onRemove: () => void
  showPrintAreas?: boolean
}

export default function ZoneOverlay({
  zone,
  hasImage,
  imageUrl,
  onUpload,
  onRemove,
  showPrintAreas = true,
}: ZoneOverlayProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', 'Please upload an image file (JPG, PNG, SVG, etc.)')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large', 'Please upload an image smaller than 10MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string
      onUpload(file, imageUrl)
      toast.success('Design added successfully')
      // Reset input so the same file can be uploaded again
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
    reader.onerror = () => {
      toast.error('Upload failed', 'Could not read the file. Please try again.')
    }
    reader.readAsDataURL(file)
  }

  const handleUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    fileInputRef.current?.click()
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    fileInputRef.current?.click()
  }

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    onRemove()
    toast.success('Design removed')
    // Reset input after deletion
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      {/* Zone Rectangle - NO CLICK HANDLER */}
      <div
        className={`absolute transition-all pointer-events-none ${
          showPrintAreas 
            ? `border-2 border-dashed ${hasImage ? 'border-blue-400 bg-blue-400/10' : 'border-gray-400 bg-gray-400/5'}`
            : ''
        }`}
        style={{
          left: `${zone.x}px`,
          top: `${zone.y}px`,
          width: `${zone.width}px`,
          height: `${zone.height}px`,
        }}
      >
        {/* Zone Label */}
        {showPrintAreas && (
          <div className="absolute -top-6 left-0 text-xs font-semibold text-gray-700 bg-white px-2 py-0.5 rounded shadow-sm">
            {zone.label}
          </div>
        )}

        {/* Empty State - Centered Upload Button */}
        {!hasImage && showPrintAreas && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUploadClick}
              className="w-16 h-16 bg-white rounded-full shadow-md hover:shadow-lg transition-all text-blue-600 hover:bg-blue-50 flex items-center justify-center pointer-events-auto"
              title="Upload Design"
            >
              <Upload className="w-6 h-6" />
            </motion.button>
          </div>
        )}

        {/* Filled State - Floating Controls */}
        {hasImage && (
          <>
            {/* Preview thumbnail */}
            {imageUrl && (
              <div className="absolute inset-0 flex items-center justify-center p-2">
                <img
                  src={imageUrl}
                  alt="Design preview"
                  className="max-w-full max-h-full object-contain opacity-30"
                />
              </div>
            )}

            {/* Floating Controls - Top Right */}
            {showPrintAreas && (
              <div className="absolute top-2 right-2 flex gap-2 pointer-events-none">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditClick}
                  className="w-8 h-8 rounded-full bg-white shadow-md hover:shadow-lg transition-all flex items-center justify-center text-blue-600 hover:bg-blue-50 pointer-events-auto"
                  title="Edit design"
                >
                  <Pencil className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRemoveClick}
                  className="w-8 h-8 rounded-full bg-white shadow-md hover:shadow-lg transition-all flex items-center justify-center text-red-600 hover:bg-red-50 pointer-events-auto"
                  title="Delete design"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Design"
        description="Are you sure you want to remove this design from the print area? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  )
}
