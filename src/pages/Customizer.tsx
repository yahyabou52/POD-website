import Canvas from '@/components/customizer/Canvas'
import ControlPanel from '@/components/customizer/ControlPanel'
import { motion } from 'framer-motion'

export default function Customizer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Design Studio
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create stunning custom designs with our powerful canvas editor
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Canvas - Left Side / Top on Mobile */}
          <div className="flex-1 lg:min-h-[700px]">
            <div className="bg-white rounded-lg shadow-lg p-6 h-full">
              <Canvas className="w-full h-full" />
            </div>
          </div>

          {/* Control Panel - Right Side / Bottom on Mobile */}
          <div className="lg:w-80">
            <ControlPanel />
          </div>
        </div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-sm text-gray-500"
        >
          <p>💡 Tip: Drag and drop images directly onto the canvas or use the upload button</p>
        </motion.div>
      </div>
    </div>
  )
}