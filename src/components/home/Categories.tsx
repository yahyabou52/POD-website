import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const categories = [
  {
    id: 'tshirt',
    name: 'T-Shirts',
    image: '/src/assets/tshirt-placeholder.svg',
    description: 'Classic & comfortable'
  },
  {
    id: 'hoodie',
    name: 'Hoodies',
    image: '/src/assets/hoodie-placeholder.svg',
    description: 'Warm & stylish'
  },
  {
    id: 'cap',
    name: 'Caps',
    image: '/src/assets/cap-placeholder.svg',
    description: 'Perfect for any outfit'
  },
  {
    id: 'mug',
    name: 'Mugs',
    image: '/src/assets/mug-placeholder.svg',
    description: 'Start your day right'
  }
]

export default function Categories() {
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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.6, 0.01, 0.05, 0.95] as const }
    }
  }

  return (
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
            Choose Your Canvas
          </h2>
          <p className="text-lg text-carbon max-w-2xl mx-auto">
            Select from our premium product range to bring your designs to life
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
              className="group cursor-pointer"
            >
              <Link to={`/products?category=${category.id}`}>
                <div className="bg-white rounded-2xl p-6 border border-mist hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="aspect-square bg-gradient-to-br from-mist to-white rounded-xl flex items-center justify-center mb-6 group-hover:from-onyx group-hover:to-carbon transition-all duration-300">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-28 h-28 object-contain opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 group-hover:brightness-0 group-hover:invert"
                    />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-onyx mb-2 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-graphite/80 text-sm">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}