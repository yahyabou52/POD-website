import { motion } from 'framer-motion'

export default function About() {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-8">
          About PODify
        </h1>
        
        <div className="prose prose-lg mx-auto text-muted-foreground">
          <p className="text-xl text-center mb-12">
            We're passionate about helping creators bring their ideas to life through high-quality print-on-demand products.
          </p>
          
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p>
                To democratize custom product creation by providing easy-to-use design tools and premium quality products. 
                We believe everyone should be able to create and sell their unique designs without barriers.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
              <p>
                To become the leading platform for custom print-on-demand products, empowering creators worldwide 
                to turn their artistic visions into profitable businesses.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">Why Choose Us?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
                <p>We use only the best materials and printing techniques to ensure your designs look amazing.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
                <p>Quick production times and reliable shipping to get your products to you as soon as possible.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
                <p>Our dedicated support team is always here to help you with any questions or concerns.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}