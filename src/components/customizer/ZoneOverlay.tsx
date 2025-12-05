import { Upload, X, Pencil } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRef } from 'react'

export interface PrintZone {
  id: string
  label: string
  x: number
  y: number
  width: number
  height: number
  side: 'front' | 'back'
}

interface ZoneOverlayProps {
  zone: PrintZone
  hasImage: boolean
  imageUrl?: string
  onUpload: (file: File, imageUrl: string) => void
  onRemove: () => void
}

export default function ZoneOverlay({
  zone,
  hasImage,
  imageUrl,
  onUpload,
  onRemove,
}: ZoneOverlayProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string
      onUpload(file, imageUrl)
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
    onRemove()
  }

  return (
    <>
      {/* Zone Rectangle - NO CLICK HANDLER */}
      <div
        className={`absolute border-2 border-dashed transition-all pointer-events-none ${
          hasImage
            ? 'border-blue-400 bg-blue-400/10'
            : 'border-gray-400 bg-gray-400/5'
        }`}
        style={{
          left: `${zone.x}px`,
          top: `${zone.y}px`,
          width: `${zone.width}px`,
          height: `${zone.height}px`,
        }}
      >
        {/* Zone Label */}
        <div className="absolute -top-6 left-0 text-xs font-semibold text-gray-700 bg-white px-2 py-0.5 rounded shadow-sm">
          {zone.label}
        </div>

        {/* Empty State - Centered Upload Button */}
        {!hasImage && (
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
    </>
  )
}
