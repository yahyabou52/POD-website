import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Phone, MapPin, ArrowRight, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters')
})

type ContactForm = z.infer<typeof contactSchema>

export default function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema)
  })

  const onSubmit = async (data: ContactForm) => {
    console.log('Contact form data:', data)
    alert('Thank you for your message! We\'ll get back to you within 24 hours.')
    reset()
  }

  const faqs = [
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 5-7 business days within the US. Express shipping (2-3 days) is available at checkout.'
    },
    {
      question: 'Do you offer bulk pricing?',
      answer: 'Yes! We offer discounts for bulk orders. Contact us at support@printelya.com for custom pricing on orders of 50+ items.'
    },
    {
      question: 'Can I customize my own design?',
      answer: 'Absolutely! Our design studio lets you upload images, add text, adjust colors, and position elements exactly how you want.'
    },
    {
      question: 'Is DTF printing washable?',
      answer: 'Yes! Our DTF prints are extremely durable and can withstand regular washing. We recommend washing inside-out in cold water for best longevity.'
    }
  ]

  return (
    <div className="bg-background">
      {/* Header Section */}
      <section className="relative py-32 bg-gradient-to-b from-background to-surface overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 to-transparent rounded-full translate-x-1/3 -translate-y-1/3 opacity-60" />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-semibold text-text-primary mb-8 leading-tight tracking-tight">
              Contact Us
            </h1>
            <p className="text-lg text-text-primary/80 leading-relaxed">
              We're here to help you with orders, customization, or any questions you might have
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-32 bg-surface">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -4 }}
              className="bg-surface rounded-2xl p-6 border border-border hover:shadow-luxury transition-all duration-300 text-center"
            >
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-gold-glow">
                <Mail className="w-7 h-7 text-text-on-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-3 tracking-tight">Email Support</h3>
              <a href="mailto:support@printelya.com" className="text-base text-text-primary/70 hover:text-primary transition-colors block mb-2">
                support@printelya.com
              </a>
              <p className="text-sm text-text-primary/60">Response within 24 hours</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-surface rounded-2xl p-6 border border-border hover:shadow-luxury transition-all duration-300 text-center"
            >
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-gold-glow">
                <Phone className="w-7 h-7 text-text-on-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-3 tracking-tight">Phone / WhatsApp</h3>
              <a href="tel:+212600000000" className="text-base text-text-primary/70 hover:text-primary transition-colors block mb-2">
                +212 600 000 000
              </a>
              <p className="text-sm text-text-primary/60">Available 9:00 AM – 6:00 PM</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="bg-surface rounded-2xl p-6 border border-border hover:shadow-luxury transition-all duration-300 text-center"
            >
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-gold-glow">
                <MapPin className="w-7 h-7 text-text-on-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-3 tracking-tight">Location</h3>
              <p className="text-base text-text-primary/70 mb-2">Errachidia, Morocco</p>
              <p className="text-sm text-text-primary/60">Production & shipping center</p>
            </motion.div>
          </div>

          {/* Contact Form Section */}
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-surface rounded-2xl p-8 border border-border shadow-luxury">
                <h2 className="text-3xl font-semibold text-text-primary mb-3 text-center tracking-tight">Send Us a Message</h2>
                <p className="text-text-primary/70 text-center mb-10">We'll get back to you as soon as possible</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Your Name</label>
                    <Input
                      placeholder="John Doe"
                      {...register('name')}
                      className={`h-12 rounded-lg border ${errors.name ? 'border-red-500' : 'border-border'} focus:border-primary transition-colors`}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 font-light">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Email Address</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      {...register('email')}
                      className={`h-12 rounded-lg border ${errors.email ? 'border-red-500' : 'border-border'} focus:border-primary transition-colors`}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 font-light">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Your Message</label>
                    <textarea
                      className={`flex min-h-[160px] w-full rounded-lg border ${errors.message ? 'border-red-500' : 'border-border'} bg-surface px-4 py-3 ring-offset-background placeholder:text-text-primary/40 focus:border-primary focus-visible:outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 resize-none`}
                      placeholder="Tell us how we can help you..."
                      {...register('message')}
                    />
                    {errors.message && (
                      <p className="text-sm text-red-500 font-light">{errors.message.message}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 rounded-lg bg-primary hover:bg-primary-dark text-text-on-primary font-semibold shadow-gold-glow transition-all duration-300"
                  >
                    Send Message
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-text-primary mb-6 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-text-primary/80">
              Quick answers to common questions
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-surface rounded-lg border border-border overflow-hidden hover:shadow-sm transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-primary/5 transition-colors"
                >
                  <h3 className="text-base font-semibold text-text-primary pr-8 tracking-tight">{faq.question}</h3>
                  <ChevronDown 
                    className={`w-5 h-5 text-text-primary/70 flex-shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-text-primary/70 leading-relaxed text-sm">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-surface">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center bg-surface rounded-2xl p-12 border border-border shadow-luxury"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-text-primary mb-8 leading-tight tracking-tight">
              We're Excited to Help
              <br />
              Bring Your Ideas to Life
            </h2>
            <p className="text-lg text-text-primary/80 mb-12 leading-relaxed">
              Start creating custom products today with our easy-to-use design studio
            </p>
            <Link to="/customizer">
              <Button 
                size="lg"
                className="px-8 py-4 text-base font-semibold bg-primary hover:bg-primary-dark text-text-on-primary rounded-lg shadow-gold-glow transition-all duration-300 group"
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