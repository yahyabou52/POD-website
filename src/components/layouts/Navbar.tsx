import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800">Brand</Link>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-gray-800">Login</Link>
          <Link to="/register" className="text-gray-600 hover:text-gray-800">Register</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;