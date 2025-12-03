import { useRef, useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FileUploadEnhancedProps {
  onFileSelect: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
}

export default function FileUploadEnhanced({
  onFileSelect,
  accept = 'image/*',
  multiple = true,
  maxSize = 10,
}: FileUploadEnhancedProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([])
  const [error, setError] = useState<string>('')

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload image files only (PNG, JPG, SVG)')
      return false
    }

    // Check file size
    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > maxSize) {
      setError(`File size must be less than ${maxSize}MB`)
      return false
    }

    return true
  }

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return

    setError('')
    const validFiles: File[] = []
    const newPreviews: { file: File; url: string }[] = []

    Array.from(files).forEach((file) => {
      if (validateFile(file)) {
        validFiles.push(file)
        newPreviews.push({
          file,
          url: URL.createObjectURL(file),
        })
      }
    })

    if (validFiles.length > 0) {
      setPreviews((prev) => (multiple ? [...prev, ...newPreviews] : newPreviews))
      onFileSelect(validFiles)
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    handleFiles(files)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  const removePreview = (index: number) => {
    setPreviews((prev) => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].url)
      updated.splice(index, 1)
      return updated
    })
  }

  const clearAll = () => {
    previews.forEach((preview) => URL.revokeObjectURL(preview.url))
    setPreviews([])
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
          isDragging
            ? 'border-gold bg-gold/10 shadow-lg shadow-gold/20 scale-[1.02]'
            : 'border-carbon/30 hover:border-gold hover:bg-gold/5'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="p-12 flex flex-col items-center justify-center text-center">
          <motion.div
            animate={isDragging ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            className={`mb-4 p-4 rounded-2xl ${
              isDragging ? 'bg-gold/20' : 'bg-gradient-to-br from-mist to-slate-100'
            }`}
          >
            <Upload
              className={`w-12 h-12 ${isDragging ? 'text-gold' : 'text-carbon'}`}
            />
          </motion.div>

          <h3 className="text-lg font-semibold text-onyx mb-2">
            {isDragging ? 'Drop your files here' : 'Upload Your Design'}
          </h3>
          <p className="text-sm text-graphite mb-4">
            Drag & drop files here, or click to browse
          </p>
          <div className="flex items-center gap-2 text-xs text-graphite/70">
            <ImageIcon className="w-4 h-4" />
            <span>PNG, JPG, SVG supported • Max {maxSize}MB</span>
          </div>
        </div>

        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gold/5 backdrop-blur-sm pointer-events-none"
          />
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
          >
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <X className="w-3 h-3 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Grid */}
      <AnimatePresence>
        {previews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-onyx">
                Uploaded Files ({previews.length})
              </h4>
              <button
                onClick={clearAll}
                className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {previews.map((preview, index) => (
                <motion.div
                  key={preview.url}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-mist border-2 border-transparent hover:border-gold transition-all shadow-sm hover:shadow-md"
                >
                  <img
                    src={preview.url}
                    alt={preview.file.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removePreview(index)
                    }}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-white font-medium truncate">
                      {preview.file.name}
                    </p>
                    <p className="text-[10px] text-white/70">
                      {(preview.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
