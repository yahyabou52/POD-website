import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Image as ImageIcon, File } from 'lucide-react'
import { cn } from '@/utils/cn'

interface FileUploadProps {
  onFileSelect: (files: FileList) => void
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  className?: string
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = 'image/*',
  multiple = false,
  maxSize = 10,
  className
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelection(files)
    }
  }

  const handleFileSelection = (files: FileList) => {
    const validFiles = Array.from(files).filter(file => {
      const sizeInMB = file.size / (1024 * 1024)
      return sizeInMB <= maxSize
    })

    if (validFiles.length > 0) {
      setUploadedFiles(validFiles)
      onFileSelect(files)
    }
  }

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
  }

  return (
    <div className={cn('w-full', className)}>
      <motion.div
        className={cn(
          'relative border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer',
          isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50 hover:bg-primary/5'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: isDragOver ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <Upload className={cn(
              'h-12 w-12 mb-4 transition-colors',
              isDragOver ? 'text-primary' : 'text-muted-foreground'
            )} />
          </motion.div>
          
          <h3 className="text-lg font-semibold text-primary mb-2">
            Drop your files here
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            or click to browse from your computer
          </p>
          <p className="text-xs text-muted-foreground">
            Supports images • Max {maxSize}MB
          </p>
        </div>
      </motion.div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => e.target.files && handleFileSelection(e.target.files)}
        className="hidden"
      />

      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {uploadedFiles.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {file.type.startsWith('image/') ? (
                    <ImageIcon className="h-5 w-5 text-primary" />
                  ) : (
                    <File className="h-5 w-5 text-primary" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-primary truncate max-w-[200px]">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                  className="p-1 hover:bg-destructive/10 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-destructive" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}