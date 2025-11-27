import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Filter, Search, Grid, List } from 'lucide-react'

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Mock product data
  const products = [
    { id: 1, name: 'Classic White T-Shirt', price: 19.99, category: 'tshirt', image: '/src/assets/tshirt-placeholder.svg', colors: 5, sizes: 6 },
    { id: 2, name: 'Premium Black Hoodie', price: 39.99, category: 'hoodie', image: '/src/assets/hoodie-placeholder.svg', colors: 4, sizes: 5 },
    { id: 3, name: 'Baseball Cap', price: 24.99, category: 'cap', image: '/src/assets/cap-placeholder.svg', colors: 6, sizes: 3 },
    { id: 4, name: 'Coffee Mug', price: 14.99, category: 'mug', image: '/src/assets/mug-placeholder.svg', colors: 3, sizes: 2 },
    { id: 5, name: 'Vintage T-Shirt', price: 22.99, category: 'tshirt', image: '/src/assets/tshirt-placeholder.svg', colors: 4, sizes: 6 },
    { id: 6, name: 'Zip-Up Hoodie', price: 44.99, category: 'hoodie', image: '/src/assets/hoodie-placeholder.svg', colors: 3, sizes: 5 },
    { id: 7, name: 'Snapback Cap', price: 27.99, category: 'cap', image: '/src/assets/cap-placeholder.svg', colors: 5, sizes: 2 },
    { id: 8, name: 'Travel Mug', price: 18.99, category: 'mug', image: '/src/assets/mug-placeholder.svg', colors: 2, sizes: 1 },
  ]

  const categories = [
    { id: 'all', name: 'All Products', count: products.length },
    { id: 'tshirt', name: 'T-Shirts', count: products.filter(p => p.category === 'tshirt').length },
    { id: 'hoodie', name: 'Hoodies', count: products.filter(p => p.category === 'hoodie').length },
    { id: 'cap', name: 'Caps', count: products.filter(p => p.category === 'cap').length },
    { id: 'mug', name: 'Mugs', count: products.filter(p => p.category === 'mug').length },
  ]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Our Products
        </h1>
        <p className="text-lg text-muted-foreground">
          Browse our collection of high-quality products ready for your custom designs
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 space-y-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{category.name}</span>
                      <span className="text-xs opacity-70">{category.count}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-muted-foreground">
              {filteredProducts.length} products found
            </p>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-gray-50 rounded-t-lg overflow-hidden flex items-center justify-center">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground mb-2">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {product.colors} colors • {product.sizes} sizes
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="text-primary font-bold text-lg">${product.price}</p>
                          <Link to={`/product/${product.id}`}>
                            <Button size="sm">View Details</Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="group cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{product.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {product.colors} colors • {product.sizes} sizes
                          </p>
                          <p className="text-primary font-bold">${product.price}</p>
                        </div>
                        <div>
                          <Link to={`/product/${product.id}`}>
                            <Button>View Details</Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}