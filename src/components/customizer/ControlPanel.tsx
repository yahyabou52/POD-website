import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useCustomizerStore } from '@/store/customizerStore'
import { useCartStore } from '@/store/cart'
// Use global fabric from CDN
import {
  Upload,
  FlipHorizontal,
  FlipVertical,
  Layers,
  Trash2,
  Download,
  ShoppingCart,
  ZoomIn,
  ZoomOut,
  Type
} from 'lucide-react'

const productTypes = [
  { id: 'tshirt', name: 'T-Shirt', price: 19.99, image: '/src/assets/tshirt-placeholder.svg' },
  { id: 'hoodie', name: 'Hoodie', price: 39.99, image: '/src/assets/hoodie-placeholder.svg' },
  { id: 'cap', name: 'Cap', price: 24.99, image: '/src/assets/cap-placeholder.svg' },
  { id: 'mug', name: 'Mug', price: 14.99, image: '/src/assets/mug-placeholder.svg' }
]

export default function ControlPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [scale, setScale] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [selectedColor, setSelectedColor] = useState('#ffffff')
  const [selectedSize, setSelectedSize] = useState('M')
  
  const { addItem } = useCartStore()
  const {
    canvas,
    selectedProduct,
    setSelectedProduct,
    layers,
    activeLayerId,
    addLayer,
    removeLayer,
    clearLayers,
    exportDesign
    // resetDesign functionality can be added later
  } = useCustomizerStore()

  const activeLayer = layers.find(l => l.id === activeLayerId)
  const currentProduct = productTypes.find(p => p.id === selectedProduct)

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || !canvas) return

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string
          
          fabric.Image.fromURL(imageUrl, (img: any) => {
            const maxWidth = canvas.width! * 0.4
            const maxHeight = canvas.height! * 0.4
            const scale = Math.min(maxWidth / img.width!, maxHeight / img.height!)
            
            img.set({
              left: canvas.width! / 2,
              top: canvas.height! / 2,
              originX: 'center',
              originY: 'center',
              scaleX: scale,
              scaleY: scale,
              cornerSize: 10,
              transparentCorners: false,
              cornerColor: '#2563eb',
              cornerStrokeColor: '#1d4ed8',
              borderColor: '#3b82f6',
              rotatingPointOffset: 30
            })

            canvas.add(img)
            canvas.setActiveObject(img)
            canvas.renderAll()

            const layerId = `layer-${Date.now()}`
            addLayer({
              id: layerId,
              type: 'image',
              object: img,
              name: `Image ${layers.length + 1}`
            })
          })
        }
        reader.readAsDataURL(file)
      }
    })
    
    // Clear input
    event.target.value = ''
  }

  // Add text
  const addText = () => {
    if (!canvas) return

    const text = new fabric.IText('Your Text Here', {
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      originX: 'center',
      originY: 'center',
      fontFamily: 'Arial',
      fontSize: 40,
      fill: '#000000',
      cornerSize: 10,
      transparentCorners: false,
      cornerColor: '#2563eb',
      cornerStrokeColor: '#1d4ed8',
      borderColor: '#3b82f6'
    })

    canvas.add(text)
    canvas.setActiveObject(text)
    canvas.renderAll()

    const layerId = `layer-${Date.now()}`
    addLayer({
      id: layerId,
      type: 'text',
      object: text,
      name: `Text ${layers.filter(l => l.type === 'text').length + 1}`
    })
  }

  // Transform functions
  const handleScale = (newScale: number) => {
    setScale(newScale)
    if (activeLayer && canvas) {
      const scaleValue = newScale / 100
      activeLayer.object.set({
        scaleX: scaleValue,
        scaleY: scaleValue
      })
      canvas.renderAll()
    }
  }

  const handleRotation = (newRotation: number) => {
    setRotation(newRotation)
    if (activeLayer && canvas) {
      activeLayer.object.set({ angle: newRotation })
      canvas.renderAll()
    }
  }

  const flipHorizontal = () => {
    if (activeLayer && canvas) {
      activeLayer.object.set({ flipX: !activeLayer.object.flipX })
      canvas.renderAll()
    }
  }

  const flipVertical = () => {
    if (activeLayer && canvas) {
      activeLayer.object.set({ flipY: !activeLayer.object.flipY })
      canvas.renderAll()
    }
  }

  const bringForward = () => {
    if (activeLayer && canvas) {
      activeLayer.object.bringForward()
      canvas.renderAll()
    }
  }

  const sendBackward = () => {
    if (activeLayer && canvas) {
      activeLayer.object.sendBackwards()
      canvas.renderAll()
    }
  }

  const deleteActive = () => {
    if (activeLayerId) {
      removeLayer(activeLayerId)
    }
  }

  const exportAsImage = () => {
    const dataURL = exportDesign()
    if (dataURL) {
      const link = document.createElement('a')
      link.download = `design-${Date.now()}.png`
      link.href = dataURL
      link.click()
    }
  }

  const addToCart = () => {
    if (!currentProduct) return

    const designUrl = exportDesign()
    
    addItem({
      productId: selectedProduct,
      productName: currentProduct.name,
      productType: selectedProduct,
      size: selectedSize,
      color: selectedColor,
      price: currentProduct.price,
      designUrl: designUrl || undefined,
      quantity: 1
    })

    alert('Added to cart successfully!')
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full lg:w-80 bg-white rounded-2xl shadow-lg border border-gray-200 h-fit"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Customize Design</h2>
        <p className="text-sm text-gray-500">Upload and position your design</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Product Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Select Product</label>
          <div className="grid grid-cols-2 gap-3">
            {productTypes.map((product) => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product.id)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  selectedProduct === product.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img src={product.image} alt={product.name} className="w-8 h-8 mx-auto mb-2 object-contain" />
                <div className="text-xs font-medium text-gray-900">{product.name}</div>
                <div className="text-xs text-gray-500">${product.price}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Upload Design</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="space-y-2">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
            <Button
              onClick={addText}
              variant="outline"
              className="w-full"
            >
              <Type className="w-4 h-4 mr-2" />
              Add Text
            </Button>
          </div>
        </div>

        {/* Layers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Layers ({layers.length})
          </label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {layers.map((layer) => (
              <div
                key={layer.id}
                className={`flex items-center justify-between p-2 rounded-lg border ${
                  layer.id === activeLayerId ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{layer.name}</span>
                </div>
                <button
                  onClick={() => removeLayer(layer.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          {layers.length > 0 && (
            <Button
              onClick={clearLayers}
              variant="outline"
              size="sm"
              className="w-full mt-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Transform Controls */}
        {activeLayer && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Transform</label>
            
            {/* Scale */}
            <div>
              <label className="block text-xs text-gray-500 mb-2">Scale: {scale}%</label>
              <input
                type="range"
                min="10"
                max="200"
                value={scale}
                onChange={(e) => handleScale(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Rotation */}
            <div>
              <label className="block text-xs text-gray-500 mb-2">Rotation: {rotation}°</label>
              <input
                type="range"
                min="0"
                max="360"
                value={rotation}
                onChange={(e) => handleRotation(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={flipHorizontal} variant="outline" size="sm">
                <FlipHorizontal className="w-4 h-4" />
              </Button>
              <Button onClick={flipVertical} variant="outline" size="sm">
                <FlipVertical className="w-4 h-4" />
              </Button>
              <Button onClick={bringForward} variant="outline" size="sm">
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button onClick={sendBackward} variant="outline" size="sm">
                <ZoomOut className="w-4 h-4" />
              </Button>
            </div>

            <Button
              onClick={deleteActive}
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        )}

        {/* Product Options */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Product Options</label>
          
          {/* Color */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">Color</label>
            <div className="flex space-x-2">
              {['#ffffff', '#000000', '#ef4444', '#3b82f6', '#10b981', '#f59e0b'].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">Size</label>
            <div className="flex space-x-2">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 text-sm rounded-lg border ${
                    selectedSize === size
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Export & Cart */}
        <div className="space-y-2 pt-4 border-t border-gray-200">
          <Button
            onClick={exportAsImage}
            variant="outline"
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Design
          </Button>
          
          <Button
            onClick={addToCart}
            className="w-full bg-gray-900 hover:bg-gray-800"
            disabled={layers.length === 0}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart - ${currentProduct?.price}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}