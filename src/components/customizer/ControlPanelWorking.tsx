import React, { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
import { useCustomizerStore } from '@/store/customizerStore'
import { useCartStore } from '@/store/cart'
import {
  Upload,
  Type,
  Square,
  Circle,
  Download,
  ShoppingCart
} from 'lucide-react'
import { motion } from 'framer-motion'

const productTypes = [
  { id: 'tshirt', name: 'T-Shirt', price: 19.99, image: '/src/assets/tshirt-placeholder.svg' },
  { id: 'hoodie', name: 'Hoodie', price: 39.99, image: '/src/assets/hoodie-placeholder.svg' },
  { id: 'cap', name: 'Cap', price: 24.99, image: '/src/assets/cap-placeholder.svg' },
  { id: 'mug', name: 'Mug', price: 14.99, image: '/src/assets/mug-placeholder.svg' }
]

const productColors = [
  { name: 'White', value: '#ffffff' },
  { name: 'Black', value: '#000000' },
  { name: 'Navy', value: '#1f2937' },
  { name: 'Gray', value: '#6b7280' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Blue', value: '#3b82f6' }
]

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export default function ControlPanelWorking() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addItem } = useCartStore()
  
  const {
    selectedProduct,
    setSelectedProduct,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    layers
  } = useCustomizerStore()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      // Use the global function exposed by canvas
      if ((window as any).addImageToCanvas) {
        (window as any).addImageToCanvas(file)
      } else {
        console.log('Canvas not ready yet')
      }
    }
  }

  const addText = () => {
    if ((window as any).fabricCanvas) {
      const canvas = (window as any).fabricCanvas
      import('fabric').then(fabricModule => {
        const fabric = fabricModule.fabric
        const text = new fabric.Text('Edit this text', {
          left: 100,
          top: 100,
          fontFamily: 'Arial',
          fontSize: 24,
          fill: '#000000'
        })
        
        canvas.add(text)
        canvas.setActiveObject(text)
        canvas.renderAll()
      })
    }
  }

  const addShape = (shape: string) => {
    if ((window as any).fabricCanvas) {
      const canvas = (window as any).fabricCanvas
      import('fabric').then(fabricModule => {
        const fabric = fabricModule.fabric
        let shapeObject: any
        
        if (shape === 'rectangle') {
          shapeObject = new fabric.Rect({
            left: 150,
            top: 150,
            width: 100,
            height: 60,
            fill: '#ff6b6b',
            stroke: '#333',
            strokeWidth: 2
          })
        } else if (shape === 'circle') {
          shapeObject = new fabric.Circle({
            left: 150,
            top: 150,
            radius: 50,
            fill: '#4ecdc4',
            stroke: '#333',
            strokeWidth: 2
          })
        }
        
        if (shapeObject) {
          canvas.add(shapeObject)
          canvas.setActiveObject(shapeObject)
          canvas.renderAll()
        }
      })
    }
  }

  const exportDesign = () => {
    console.log('Export design')
    // TODO: Implement design export
  }

  const addToCart = () => {
    const currentProduct = productTypes.find(p => p.id === selectedProduct)
    if (!currentProduct) return

    addItem({
      productId: selectedProduct,
      productName: currentProduct.name,
      productType: selectedProduct,
      size: selectedSize,
      color: selectedColor,
      price: currentProduct.price,
      designUrl: '/src/assets/hoodie-placeholder.svg', // Placeholder
      quantity: 1
    })

    alert('Added to cart!')
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Product Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {productTypes.map((product) => (
              <Button
                key={product.id}
                variant={selectedProduct === product.id ? "default" : "outline"}
                onClick={() => setSelectedProduct(product.id)}
                className="h-20 flex flex-col items-center justify-center space-y-1"
              >
                <img src={product.image} alt={product.name} className="w-6 h-6" />
                <span className="text-xs">{product.name}</span>
                <span className="text-xs font-bold">${product.price}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Color Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Product Color</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {productColors.map((color) => (
              <Button
                key={color.value}
                variant={selectedColor === color.value ? "default" : "outline"}
                onClick={() => setSelectedColor(color.value)}
                className="h-12 flex items-center justify-center space-x-2"
              >
                <div 
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.value }}
                />
                <span className="text-xs">{color.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Size Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Size</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                onClick={() => setSelectedSize(size)}
                className="h-10"
              >
                {size}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Design Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Design Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <Button 
            onClick={() => fileInputRef.current?.click()}
            variant="outline" 
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Image
          </Button>

          <Button onClick={addText} variant="outline" className="w-full">
            <Type className="w-4 h-4 mr-2" />
            Add Text
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={() => addShape('rectangle')} 
              variant="outline"
              size="sm"
            >
              <Square className="w-4 h-4 mr-1" />
              Rectangle
            </Button>
            <Button 
              onClick={() => addShape('circle')} 
              variant="outline"
              size="sm"
            >
              <Circle className="w-4 h-4 mr-1" />
              Circle
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export & Cart */}
      <div className="space-y-3">
        <Button onClick={exportDesign} variant="outline" className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Export Design
        </Button>
        
        <Button 
          onClick={addToCart}
          className="w-full bg-black hover:bg-gray-800 text-white"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart - ${productTypes.find(p => p.id === selectedProduct)?.price}
        </Button>
      </div>

      {/* Debug Info */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm">Debug Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs space-y-1">
            <p>Product: {selectedProduct}</p>
            <p>Color: {selectedColor}</p>
            <p>Size: {selectedSize}</p>
            <p>Layers: {layers.length}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}