import { motion } from 'framer-motion'
import { Award, Zap, Heart, Users, Printer, CheckCircle, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function About() {
  return (
    <div className="bg-white">
      {/* Premium Hero Header */}
      <section className="relative py-32 bg-gradient-to-b from-mist to-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-gold/10 to-transparent rounded-full translate-x-1/3 -translate-y-1/3 opacity-60" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-mist to-transparent rounded-full -translate-x-1/3 translate-y-1/3 opacity-50" />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-semibold text-onyx mb-8 leading-tight tracking-tight">
              Our Story
            </h1>
            <p className="text-lg text-carbon leading-relaxed">
              We're on a mission to empower creators worldwide with premium custom apparel. 
              Quality craftsmanship meets creative freedom.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission + Vision Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl p-8 border border-mist hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-onyx rounded-xl flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-onyx mb-4 tracking-tight">Our Mission</h2>
              <p className="text-base text-graphite leading-relaxed">
                To democratize custom product creation by providing intuitive design tools and premium quality printing. 
                We believe everyone deserves to express their creativity without barriers or compromises.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl p-8 border border-mist hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-onyx rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-onyx mb-4 tracking-tight">Our Vision</h2>
              <p className="text-base text-graphite leading-relaxed">
                To become the world's most trusted platform for custom print-on-demand products, 
                empowering millions of creators to turn their artistic visions into thriving businesses.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why We Created Printelya */}
      <section className="py-32 bg-gradient-to-b from-mist to-white">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-mist/50 rounded-[2.5rem] p-12 md:p-16 border border-mist">
              <div className="flex items-center justify-center mb-8">
                <div className="w-20 h-20 bg-onyx rounded-2xl flex items-center justify-center">
                  <Heart className="w-10 h-10 text-white" />
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-semibold text-onyx mb-8 text-center tracking-tight">
                Why We Created Printelya
              </h2>

              <div className="space-y-6 text-base text-graphite leading-relaxed">
                <p>
                  Printelya was born from a simple frustration: creating custom products shouldn't be complicated, 
                  expensive, or limited to large orders.
                </p>
                <p>
                  We saw talented designers and creators struggling with outdated tools, poor quality printing, 
                  and slow turnaround times. So we built something better.
                </p>
                <p>
                  Today, we combine cutting-edge DTF printing technology with an intuitive design studio, 
                  all backed by our commitment to quality and customer satisfaction. Every product is crafted 
                  with care in Morocco, where traditional craftsmanship meets modern innovation.
                </p>
                <p className="text-onyx font-medium">
                  Your creativity deserves the best canvas. That's why we're here.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
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
              What We Stand For
            </h2>
            <p className="text-lg text-carbon max-w-3xl mx-auto">
              The values that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: Award,
                title: 'Premium Quality',
                description: 'High-quality DTF printing that ensures vibrant colors and lasting durability'
              },
              {
                icon: Zap,
                title: 'Fast Production',
                description: 'Your products printed and shipped within 2-3 business days, guaranteed'
              },
              {
                icon: Users,
                title: 'Creative Freedom',
                description: 'Intuitive design tools that empower you to create exactly what you envision'
              },
              {
                icon: Heart,
                title: 'Made with Care',
                description: 'Every product crafted with attention to detail in Morocco with pride'
              }
            ].map((value, index) => {
              const IconComponent = value.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="bg-white rounded-2xl p-6 border border-mist hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full">
                    <div className="w-14 h-14 bg-onyx rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-onyx mb-3 tracking-tight">
                      {value.title}
                    </h3>
                    <p className="text-graphite leading-relaxed text-sm">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Production Process */}
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
              How We Create Your Products
            </h2>
            <p className="text-lg text-carbon max-w-3xl mx-auto">
              From design to delivery, every step is optimized for quality
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Printer, title: 'Print', description: 'DTF printing with premium inks' },
              { icon: Zap, title: 'Press', description: 'Heat transfer at perfect temperature' },
              { icon: CheckCircle, title: 'Inspect', description: 'Quality check every product' },
              { icon: Truck, title: 'Ship', description: 'Fast delivery to your door' }
            ].map((step, index) => {
              const IconComponent = step.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="text-center"
                >
                  <div className="relative">
                    {index < 3 && (
                      <div className="hidden md:block absolute top-12 left-[calc(100%+1rem)] w-8 h-px bg-mist z-0">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-graphite rotate-45" />
                      </div>
                    )}
                    
                    <div className="w-24 h-24 bg-onyx rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <IconComponent className="w-12 h-12 text-white" />
                    </div>
                    
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-gold text-onyx rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-onyx mb-3">
                    {step.title}
                  </h3>
                  <p className="text-graphite font-light">
                    {step.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center bg-white rounded-2xl p-12 border border-mist shadow-sm"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-onyx mb-8 leading-tight tracking-tight">
              Ready to Create
              <br />
              Something Amazing?
            </h2>
            <p className="text-lg text-carbon mb-12 leading-relaxed">
              Join thousands of creators who trust Printelya to bring their designs to life
            </p>
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
        </div>
      </section>
    </div>
  )
}