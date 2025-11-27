import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'

export default function Footer() {
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
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <footer className="relative bg-primary text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48" />
      </div>

      <div className="relative container mx-auto px-4">
        {/* Newsletter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-16 text-center border-b border-white/10"
        >
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <h3 className="text-3xl font-bold font-heading">Stay Creative</h3>
            </div>
            <p className="text-white/80 text-lg">
              Get the latest design trends, exclusive offers, and creative inspiration delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
              />
              <Button className="bg-white text-primary hover:bg-gray-100 font-medium">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {/* Company Info */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-bold font-heading">PODify</span>
            </div>
            <p className="text-white/80 leading-relaxed">
              Transform your creativity into premium products. We bring your designs to life with exceptional quality and fast delivery.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="text-xl font-semibold font-heading">Explore</h4>
            <nav className="space-y-4">
              {[
                { name: 'All Products', path: '/products' },
                { name: 'Design Studio', path: '/customizer' },
                { name: 'Collections', path: '/products?category=collections' },
                { name: 'Best Sellers', path: '/products?sort=popular' }
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block text-white/80 hover:text-white transition-colors group"
                >
                  <div className="flex items-center space-x-2">
                    <span>{item.name}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Customer Care */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="text-xl font-semibold font-heading">Support</h4>
            <nav className="space-y-4">
              {[
                'Help Center',
                'Size Guide',
                'Shipping Info',
                'Returns & Exchanges',
                'Quality Promise',
                'Contact Support'
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-white/80 hover:text-white transition-colors group"
                >
                  <div className="flex items-center space-x-2">
                    <span>{item}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </a>
              ))}
            </nav>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="text-xl font-semibold font-heading">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-white/80">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <p>123 Creative Street</p>
                  <p>Design District, NY 10001</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-white/80">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a href="mailto:hello@podify.com" className="hover:text-white transition-colors">
                  hello@podify.com
                </a>
              </div>
              <div className="flex items-center space-x-3 text-white/80">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a href="tel:+15551234567" className="hover:text-white transition-colors">
                  +1 (555) 123-4567
                </a>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white/5 rounded-lg p-4">
              <h5 className="font-medium mb-2">Business Hours</h5>
              <div className="text-sm text-white/80 space-y-1">
                <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-8 border-t border-white/10"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-white/60">
              <p>© 2024 PODify. All rights reserved.</p>
              <div className="flex items-center space-x-1">
                <span>Made with</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  ❤️
                </motion.div>
                <span>for creators</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {['Privacy Policy', 'Terms of Service', 'Cookies Policy'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}