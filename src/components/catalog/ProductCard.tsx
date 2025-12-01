import React from 'react';
import { Product } from '@/types/Product';

type ProductCardProps = {
  product: Product;
  onClick: () => void;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div
      className="border rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer"
      onClick={onClick}
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{product.category}</p>
      <p className="text-sm text-gray-800 font-medium">${product.price.toFixed(2)}</p>
    </div>
  );
};

export default ProductCard;