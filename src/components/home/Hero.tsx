import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.6, 0.01, 0.05, 0.95] as const }
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Subtle background shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-mist to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 opacity-60" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-mist to-transparent rounded-full translate-x-1/3 translate-y-1/3 opacity-50" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-6xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-onyx rounded-full text-sm font-medium text-white shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span>Premium Custom Apparel</span>
            </div>
          </motion.div>
          
          {/* Main headline */}
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-onyx leading-[1.1] tracking-tight mb-8"
          >
            Design Your
            <br />
            <span className="bg-gradient-to-r from-onyx via-carbon to-onyx bg-clip-text text-transparent">
              Perfect Style
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-carbon max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Create custom t-shirts, hoodies, caps, and mugs with our intuitive design studio.
            Premium quality, fast delivery, endless possibilities.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 justify-center mb-20">
            <Link to="/customizer">
              <Button 
                size="lg"
                className="bg-gold text-onyx hover:bg-gold/80 px-8 py-6 text-base font-semibold rounded-lg shadow-sm transition-all duration-300 group"
              >
                Start Designing
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/products">
              <Button 
                variant="outline"
                size="lg"
                className="border border-carbon text-carbon hover:bg-mist px-8 py-6 text-base font-medium rounded-lg transition-all duration-300"
              >
                Browse Products
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center items-center gap-12 text-sm text-graphite"
          >
            <div className="text-center">
              <div className="text-3xl font-semibold text-onyx mb-1">10,000+</div>
              <div className="text-carbon">Happy Customers</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-mist" />
            <div className="text-center">
              <div className="text-3xl font-semibold text-onyx mb-1">50,000+</div>
              <div className="text-carbon">Products Created</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-mist" />
            <div className="text-center">
              <div className="text-3xl font-semibold text-onyx mb-1">4.9/5</div>
              <div className="text-carbon">Customer Rating</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}