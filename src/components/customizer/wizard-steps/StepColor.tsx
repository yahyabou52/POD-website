import React from 'react';
import { motion } from 'framer-motion';
import type { ProductSelection } from '@/types/customizer';
import { getProductTemplate } from '@/config/productTemplates';

interface StepColorProps {
  selection: ProductSelection;
  setSelection: (selection: ProductSelection) => void;
}

const StepColor: React.FC<StepColorProps> = ({ selection, setSelection }) => {
  const template = getProductTemplate(
    selection.productType || '',
    selection.fitType,
    selection.sleeveType,
    selection.capType,
    selection.mugType
  );

  if (!template) return null;

  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Select Color</h3>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {template.colors.map((color) => (
          <button
            key={color.name}
            onClick={() => setSelection({ ...selection, color: color.name })}
            className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
              selection.color === color.name
                ? 'border-gold'
                : 'border-gray-200 hover:border-gold/50'
            }`}
          >
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mb-2"
              style={{ backgroundColor: color.hex }}
            />
            <p className="text-xs font-medium">{color.name}</p>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default StepColor;