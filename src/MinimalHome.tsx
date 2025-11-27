export default function MinimalHome() {
  return (
    <div className="min-h-screen bg-white">
      {/* Simple Hero Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold text-black mb-6">
            PODify
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create and sell custom products with our print-on-demand platform
          </p>
          <div className="space-x-4">
            <button className="bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors">
              Start Designing
            </button>
            <button className="border-2 border-black text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
              View Products
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose PODify?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Easy Design",
                description: "Intuitive design tools to create stunning products",
                icon: "🎨"
              },
              {
                title: "Quality Products",
                description: "Premium materials and printing for lasting quality",
                icon: "✨"
              },
              {
                title: "Fast Delivery",
                description: "Quick turnaround times for all orders",
                icon: "🚀"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Classic T-Shirt", price: 19.99, image: "/src/assets/tshirt-placeholder.svg" },
              { name: "Premium Hoodie", price: 39.99, image: "/src/assets/hoodie-placeholder.svg" },
              { name: "Baseball Cap", price: 24.99, image: "/src/assets/cap-placeholder.svg" },
              { name: "Coffee Mug", price: 14.99, image: "/src/assets/mug-placeholder.svg" }
            ].map((product, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-50 flex items-center justify-center">
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-green-600">${product.price}</p>
                  <button className="w-full mt-4 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    Customize
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}