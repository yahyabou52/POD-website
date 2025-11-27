import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, PricingTag } from '@/components/ui/enhanced-components'
import { cn } from '@/utils/cn'

interface ProductCardProps {
  product: {
    id: string | number
    name: string
    price: number
    originalPrice?: number
    image: string
    category: string
    colors?: number
    sizes?: number
    rating?: number
    reviews?: number
    isNew?: boolean
    isSale?: boolean
  }
  className?: string
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={cn('group', className)}
    >
      <Card className="h-full overflow-hidden border-0 shadow-soft hover:shadow-soft-lg transition-all duration-300">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {/* Product Image */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge variant="default" size="sm">NEW</Badge>
            )}
            {product.isSale && (
              <Badge variant="destructive" size="sm">SALE</Badge>
            )}
          </div>

          {/* Hover Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-soft hover:bg-white transition-colors"
            >
              <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-soft hover:bg-white transition-colors"
            >
              <Eye className="h-4 w-4 text-gray-600" />
            </motion.button>
          </div>

          {/* Quick Add to Cart */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Product Name & Category */}
          <div className="mb-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              {product.category}
            </p>
            <h3 className="font-semibold text-primary text-lg leading-tight hover:text-primary/80 transition-colors">
              <Link to={`/product/${product.id}`}>
                {product.name}
              </Link>
            </h3>
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-3 w-3',
                      i < Math.floor(product.rating!)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviews})
              </span>
            </div>
          )}

          {/* Product Info */}
          <div className="flex justify-between items-center mb-4">
            {(product.colors || product.sizes) && (
              <p className="text-xs text-muted-foreground">
                {product.colors && `${product.colors} colors`}
                {product.colors && product.sizes && ' • '}
                {product.sizes && `${product.sizes} sizes`}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <PricingTag 
              price={product.price} 
              originalPrice={product.originalPrice}
              size="md"
            />
            <Link to={`/customizer?product=${product.id}`}>
              <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground">
                Customize
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface ProductGridProps {
  products: any[]
  columns?: 2 | 3 | 4
  className?: string
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  columns = 4,
  className 
}) => {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }

  return (
    <div className={cn(
      'grid gap-6',
      gridCols[columns],
      className
    )}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

