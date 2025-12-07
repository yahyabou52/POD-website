import { motion } from 'framer-motion'
import { Award, Zap, Palette, MapPin } from 'lucide-react'

const features = [
  {
    icon: Award,
    title: 'High-Quality DTF Printing',
    description: 'Premium direct-to-film technology ensures vibrant colors and long-lasting designs that won\'t fade or crack.'
  },
  {
    icon: Zap,
    title: 'Fast Production',
    description: 'Your custom products are printed and shipped within 2-3 business days with our streamlined process.'
  },
  {
    icon: Palette,
    title: 'Full Customization Tool',
    description: 'Intuitive design studio with advanced features to create exactly what you envision.'
  },
  {
    icon: MapPin,
    title: 'Designed & Printed in Morocco',
    description: 'Proudly supporting local craftsmanship with international quality standards.'
  }
]

export default function WhyUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: [0.6, 0.01, 0.05, 0.95] as const }
    }
  }

  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-text-primary mb-6 tracking-tight">
            Why Choose Us
          </h2>
          <p className="text-lg text-text-primary/80 max-w-3xl mx-auto">
            Everything you need to create, customize, and deliver exceptional products
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group"
              >
                <div className="bg-surface rounded-2xl p-6 border border-border hover:shadow-luxury hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-text-on-primary group-hover:scale-105 transition-transform duration-300 shadow-gold-glow">
                        <IconComponent className="w-6 h-6" />
                      </div>
                    </div>
                    
                    <div className="flex-1 pt-1">
                      <h3 className="text-lg font-semibold text-text-primary mb-3 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="text-text-primary/70 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}