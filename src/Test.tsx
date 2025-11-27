import React from 'react'

export default function Test() {
  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">TailwindCSS Test</h1>
        <p className="text-gray-600">If you see this styled, TailwindCSS is working!</p>
        <button className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
          Test Button
        </button>
      </div>
    </div>
  )
}