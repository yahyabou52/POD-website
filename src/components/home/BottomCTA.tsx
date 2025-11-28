import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function BottomCTA() {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto bg-white rounded-2xl border border-mist p-12 md:p-16 text-center shadow-sm"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-onyx rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-5xl font-semibold text-onyx mb-6 leading-tight tracking-tight"
          >
            Ready to Create
            <br />
            Something Amazing?
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-carbon mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Join thousands of creators who trust us to bring their designs to life with premium quality and lightning-fast delivery.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-8"
          >
            <Link to="/customizer">
              <Button 
                size="lg" 
                className="px-8 py-4 text-base font-semibold bg-gold text-onyx hover:bg-gold/80 rounded-lg shadow-sm transition-all duration-300 group"
              >
                Start Designing Now
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-sm text-graphite/80"
          >
            No credit card required • Free design tools • Cancel anytime
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}