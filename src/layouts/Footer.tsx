import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Sparkles, ArrowRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative bg-onyx border-t border-graphite">
      <div className="container mx-auto px-6 md:px-12">
        {/* Main Footer Content */}
        <div className="py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gold to-amber rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-onyx" />
              </div>
              <span className="text-3xl font-bold text-white">Printelya</span>
            </div>
            <p className="text-mist/70 leading-relaxed font-light text-base">
              Transform your creativity into premium products. High-quality printing with exceptional service.
            </p>
            <div className="flex space-x-3">
              {[
                { Icon: Facebook, href: '#' },
                { Icon: Twitter, href: '#' },
                { Icon: Instagram, href: '#' }
              ].map(({ Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  className="w-11 h-11 bg-carbon hover:bg-gold rounded-xl flex items-center justify-center transition-all duration-300 group"
                >
                  <Icon className="w-5 h-5 text-mist group-hover:text-onyx transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white">Shop</h4>
            <nav className="space-y-4">
              {[
                { name: 'All Products', path: '/products' },
                { name: 'T-Shirts', path: '/products?category=tshirt' },
                { name: 'Hoodies', path: '/products?category=hoodie' },
                { name: 'Caps', path: '/products?category=cap' },
                { name: 'Mugs', path: '/products?category=mug' }
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block text-mist/70 hover:text-gold transition-colors group font-light"
                >
                  <div className="flex items-center gap-2">
                    <span>{item.name}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          {/* Support Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white">Support</h4>
            <nav className="space-y-4">
              {[
                { name: 'Help Center', path: '/help' },
                { name: 'Size Guide', path: '/size-guide' },
                { name: 'Shipping Info', path: '/shipping' },
                { name: 'Returns', path: '/returns' },
                { name: 'Contact Us', path: '/contact' }
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block text-mist/70 hover:text-gold transition-colors group font-light"
                >
                  <div className="flex items-center gap-2">
                    <span>{item.name}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white">Get in Touch</h4>
            <div className="space-y-4">
              <a href="mailto:hello@printelya.com" className="flex items-start gap-3 text-mist/70 hover:text-gold transition-colors group font-light">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>hello@printelya.com</span>
              </a>
              <a href="tel:+15551234567" className="flex items-start gap-3 text-mist/70 hover:text-gold transition-colors group font-light">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </a>
              <div className="flex items-start gap-3 text-mist/70 font-light">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p>123 Creative Street</p>
                  <p>Design District, NY 10001</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-graphite">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-sm text-mist/60 font-light">
              <p>© 2024 Printelya. All rights reserved.</p>
              <div className="flex items-center gap-1">
                <span>Made with</span>
                <span className="text-red-500">❤️</span>
                <span>for creators</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              {['Privacy Policy', 'Terms of Service', 'Cookies'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-mist/60 hover:text-gold transition-colors font-light"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}