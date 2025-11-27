export default function SimpleHome() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold text-black mb-8">PODify</h1>
        <p className="text-2xl text-gray-600 mb-8">
          This is a test to see if TailwindCSS is working
        </p>
        
        <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
          <h2 className="text-3xl font-semibold mb-4">Test Card</h2>
          <p className="text-gray-700 mb-4">This card should have a white background, shadow, and rounded corners.</p>
          <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
            Test Button
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Product {item}</h3>
              <p className="text-gray-600 mb-4">Test product description</p>
              <div className="text-2xl font-bold text-green-600">${item * 10}.99</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}