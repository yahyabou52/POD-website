import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Palette, Users, Award, Zap, Heart, TrendingUp, CheckCircle, Star, Shield } from 'lucide-react'
import Hero from '@/components/Hero'

export default function Home() {
  const featuredProducts = [
    { 
      id: '1', 
      name: 'Classic Cotton T-Shirt', 
      price: 19.99, 
      originalPrice: 24.99,
      image: '/src/assets/tshirt-placeholder.svg', 
      category: 'T-Shirts',
      rating: 4.8,
      reviewCount: 127,
      colors: ['#000000', '#FFFFFF', '#FF6B6B', '#4ECDC4'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      badge: 'Best Seller'
    },
    { 
      id: '2', 
      name: 'Premium Pullover Hoodie', 
      price: 39.99, 
      originalPrice: 49.99,
      image: '/src/assets/hoodie-placeholder.svg', 
      category: 'Hoodies',
      rating: 4.9,
      reviewCount: 89,
      colors: ['#000000', '#FFFFFF', '#6C5CE7', '#00B894'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      badge: 'Premium'
    },
    { 
      id: '3', 
      name: 'Vintage Baseball Cap', 
      price: 24.99, 
      image: '/src/assets/cap-placeholder.svg',
      category: 'Caps',
      rating: 4.7,
      reviewCount: 156,
      colors: ['#000000', '#FFFFFF', '#FF7675', '#74B9FF'],
      sizes: ['One Size'],
      badge: 'Trending'
    },
    { 
      id: '4', 
      name: 'Ceramic Coffee Mug', 
      price: 14.99, 
      originalPrice: 18.99,
      image: '/src/assets/mug-placeholder.svg',
      category: 'Mugs',
      rating: 4.6,
      reviewCount: 203,
      colors: ['#FFFFFF', '#000000', '#FF6B6B'],
      sizes: ['11oz', '15oz'],
      badge: 'Popular'
    },
  ]

  const features = [
    {
      icon: Palette,
      title: 'Professional Design Tools',
      description: 'Advanced canvas editor with layers, effects, and precision controls for stunning designs',
      color: 'text-purple-500'
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Eco-friendly materials, vibrant colors, and durable prints that last wash after wash',
      color: 'text-blue-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Quick production and same-day shipping to get your products in hands faster',
      color: 'text-yellow-500'
    },
    {
      icon: Shield,
      title: '100% Guarantee',
      description: 'Love it or your money back - we stand behind every product we make',
      color: 'text-green-500'
    }
  ]

  const stats = [
    { value: '50K+', label: 'Happy Creators', icon: Users },
    { value: '1M+', label: 'Products Sold', icon: TrendingUp },
    { value: '99.5%', label: 'Satisfaction Rate', icon: Heart },
    { value: '24/7', label: 'Support Team', icon: CheckCircle }
  ]

  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              <span>Most Popular</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-6">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most popular products, carefully selected and loved by thousands of creators worldwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover-lift border-0 shadow-lg">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-xl overflow-hidden relative">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.badge && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                            {product.badge}
                          </span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex space-x-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-gray-900">
                            ${product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-gray-500 line-through text-sm">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {product.reviewCount} reviews
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link to="/products">
              <Button size="lg" variant="ghost" className="border-2 border-gray-300 hover:border-primary hover:text-primary font-semibold px-8 py-4 rounded-xl">
                View All Products
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-6">
              Why Creators Choose PODify
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've built the most advanced and user-friendly platform for bringing your creative visions to life with professional quality and lightning-fast delivery.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group hover-lift"
              >
                <div className={`w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm ${feature.color}`}>
                  <feature.icon className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-heading">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
              Ready to Create Something Amazing?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Join over 50,000 creators who trust PODify to bring their designs to life. Start your creative journey today with our free design tools and premium products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/customizer">
                <Button variant="ghost" size="lg" className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl">
                  Try Design Tool
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}