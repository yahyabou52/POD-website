import { motion } from 'framer-motion'
import { Upload, Palette, Truck } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    title: 'Upload Your Design',
    description: 'Drag and drop your artwork or create something new with our design tools'
  },
  {
    icon: Palette,
    title: 'Customize Position',
    description: 'Adjust size, position, and choose your product color and size'
  },
  {
    icon: Truck,
    title: 'Order & Get Fast Delivery',
    description: 'Place your order and receive your custom product within 2-3 business days'
  }
]

export default function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-onyx mb-6 tracking-tight">
            How It Works
          </h2>
          <p className="text-lg text-carbon max-w-3xl mx-auto">
            Three simple steps to bring your creative vision to life
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {steps.map((step, index) => {
              const IconComponent = step.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative group"
                >
                  {/* Connector arrow */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-16 left-[calc(100%+1rem)] w-12 h-px bg-mist z-10">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-carbon rotate-45" />
                    </div>
                  )}
                  
                  <div className="text-center relative bg-white rounded-2xl p-6 border border-mist hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    {/* Step number */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#F79A19] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    
                    {/* Icon */}
                    <div className="w-16 h-16 bg-[#F79A19] rounded-xl flex items-center justify-center mx-auto mb-6 mt-4 group-hover:scale-105 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-lg font-semibold text-onyx mb-3 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-graphite leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}