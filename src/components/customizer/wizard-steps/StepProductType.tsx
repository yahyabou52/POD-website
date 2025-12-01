import React from 'react';
import { motion } from 'framer-motion';
import { ProductSelection } from '@/types/customizer';

interface StepProductTypeProps {
  selection: ProductSelection;
  setSelection: (selection: ProductSelection) => void;
}

const productTypes = [
  { id: 'tshirt', name: 'T-Shirt', icon: '👕', description: 'Classic tees' },
  { id: 'hoodie', name: 'Hoodie', icon: '🧥', description: 'Cozy hoodies' },
  { id: 'cap', name: 'Cap', icon: '🧢', description: 'Baseball caps' },
  { id: 'mug', name: 'Mug', icon: '☕', description: 'Ceramic mugs' },
];

const StepProductType: React.FC<StepProductTypeProps> = ({ selection, setSelection }) => {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Select Product Type</h3>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {productTypes.map((product) => (
          <button
            key={product.id}
            onClick={() => setSelection({ ...selection, productType: product.id })}
            className={`p-4 sm:p-6 rounded-xl border-2 transition-all text-left ${
              selection.productType === product.id
                ? 'border-gold bg-gold/5'
                : 'border-gray-200 hover:border-gold/50'
            }`}
          >
            <span className="text-4xl mb-2">{product.icon}</span>
            <h4 className="text-base sm:text-xl font-semibold mb-1">{product.name}</h4>
            <p className="text-xs sm:text-sm text-gray-600">{product.description}</p>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default StepProductType;