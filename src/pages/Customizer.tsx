import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useCartStore } from '@/store/cart'
import { 
  Upload, 
  Download,
  ShoppingCart,
  Palette,
  Type,
  Square,
  Circle
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function Customizer() {
  const [selectedProduct, setSelectedProduct] = useState('tshirt')
  const [selectedColor, setSelectedColor] = useState('#ffffff')
  const [selectedSize, setSelectedSize] = useState('M')
  const { addItem } = useCartStore()

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Image uploaded:', event.target.files?.[0])
    // Canvas functionality will be implemented later
  }

  const addText = () => {
    console.log('Add text clicked')
    // Canvas functionality will be implemented later
  }

  const addShape = (shapeType: 'rectangle' | 'circle') => {
    console.log('Add shape:', shapeType)
    // Canvas functionality will be implemented later
  }

  const downloadDesign = () => {
    console.log('Download design')
    // Canvas functionality will be implemented later
  }

  const addToCart = () => {
    const currentProduct = productTypes.find(p => p.id === selectedProduct)
    if (!currentProduct) return

    addItem({
      productId: selectedProduct,
      productName: currentProduct.name,
      size: selectedSize,
      color: selectedColor,
      price: currentProduct.price,
      designUrl: '/api/placeholder/400/400', // Placeholder image
      quantity: 1
    })

    alert('Added to cart!')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Design Studio</h1>
        <p className="text-xl text-gray-600">Create custom designs for your products</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Canvas Area */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div 
                className="w-full h-96 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative"
                style={{ backgroundColor: selectedColor }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src={productTypes.find(p => p.id === selectedProduct)?.image} 
                    alt={productTypes.find(p => p.id === selectedProduct)?.name}
                    className="w-64 h-64 object-contain opacity-30"
                  />
                </div>
                <div className="text-center relative z-10">
                  <Palette className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Design Canvas</p>
                  <p className="text-xs text-gray-400">Upload images or add text above</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Product Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Product</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {productTypes.map((product) => (
                  <Button
                    key={product.id}
                    variant={selectedProduct === product.id ? "default" : "outline"}
                    onClick={() => setSelectedProduct(product.id)}
                    className="p-2 text-sm h-auto flex flex-col items-center space-y-1"
                  >
                    <img src={product.image} alt={product.name} className="w-8 h-8 object-contain" />
                    <span>{product.name}</span>
                    <span className="text-xs">${product.price}</span>
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
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-full h-12 rounded-lg border-2 ${
                      selectedColor === color.value ? 'border-primary' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
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
                    size="sm"
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
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={addText} size="sm">
                  <Type className="w-4 h-4 mr-2" />
                  Add Text
                </Button>
                <Button variant="outline" onClick={() => addShape('rectangle')} size="sm">
                  <Square className="w-4 h-4 mr-2" />
                  Rectangle
                </Button>
                <Button variant="outline" onClick={() => addShape('circle')} size="sm">
                  <Circle className="w-4 h-4 mr-2" />
                  Circle
                </Button>
                <label className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 text-sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <Button variant="outline" onClick={downloadDesign} className="w-full" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Design
              </Button>
            </CardContent>
          </Card>

          {/* Add to Cart */}
          <Card>
            <CardContent className="p-6">
              <Button onClick={addToCart} className="w-full" size="lg">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart - ${productTypes.find(p => p.id === selectedProduct)?.price}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}