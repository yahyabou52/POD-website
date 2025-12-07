import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const featuredProducts = [
  {
    id: '1',
    name: 'Classic Cotton T-Shirt',
    price: 19.99,
    originalPrice: 24.99,
    image: '/src/assets/tshirt-placeholder.svg',
    badge: 'Best Seller'
  },
  {
    id: '2',
    name: 'Premium Pullover Hoodie',
    price: 39.99,
    originalPrice: 49.99,
    image: '/src/assets/hoodie-placeholder.svg',
    badge: 'Premium'
  },
  {
    id: '3',
    name: 'Vintage Baseball Cap',
    price: 24.99,
    image: '/src/assets/cap-placeholder.svg',
    badge: 'Trending'
  },
  {
    id: '4',
    name: 'Ceramic Coffee Mug',
    price: 14.99,
    originalPrice: 18.99,
    image: '/src/assets/mug-placeholder.svg',
    badge: 'Popular'
  }
]

export default function FeaturedProducts() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.6, 0.01, 0.05, 0.95] as const }
    }
  }

  return (
    <section className="py-32 bg-mist">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-onyx mb-6 tracking-tight">
            Featured Products
          </h2>
          <p className="text-lg text-carbon max-w-3xl mx-auto mb-10">
            Our most popular items, ready for your custom designs
          </p>
          
          <Link to="/products">
            <Button 
              variant="outline" 
              size="lg"
              className="px-6 py-3 rounded-xl border-2 border-brand-gold text-carbon hover:bg-brand-gold/10 transition-all duration-300 group font-medium"
            >
              View All Products
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
        >
          {featuredProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-2xl overflow-hidden border border-mist hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                {/* Product image */}
                <div className="aspect-square bg-gradient-to-br from-mist to-white p-10 flex items-center justify-center relative overflow-hidden">
                  {product.badge && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-brand-gold to-brand-gold-dark text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-gold-glow">
                      {product.badge}
                    </div>
                  )}
                  
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-36 h-36 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                  />
                </div>
                
                {/* Product info */}
                <div className="p-6">
                  <h3 className="font-semibold text-base text-onyx mb-3 tracking-tight">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-semibold text-onyx">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-graphite/60 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Link to={`/customizer?product=${product.id}`}>
                    <Button 
                      size="sm" 
                      className="w-full rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark hover:shadow-gold-glow transition-all duration-300 py-3 font-medium text-sm text-white"
                    >
                      Customize Now
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}