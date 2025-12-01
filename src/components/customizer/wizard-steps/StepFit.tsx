import React from 'react';
import { motion } from 'framer-motion';
import { ProductSelection } from '@/types/customizer';

interface StepFitProps {
  selection: ProductSelection;
  setSelection: (selection: ProductSelection) => void;
}

const fitTypes = [
  { id: 'regular', name: 'Regular Fit', description: 'Classic comfortable fit' },
  { id: 'oversize', name: 'Oversize Fit', description: 'Relaxed oversized style' },
];

const StepFit: React.FC<StepFitProps> = ({ selection, setSelection }) => {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Choose Fit Type</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {fitTypes.map((fit) => (
          <button
            key={fit.id}
            onClick={() => setSelection({ ...selection, fitType: fit.id })}
            className={`p-6 sm:p-8 rounded-xl border-2 transition-all text-left ${
              selection.fitType === fit.id
                ? 'border-gold bg-gold/5'
                : 'border-gray-200 hover:border-gold/50'
            }`}
          >
            <h4 className="text-lg sm:text-xl font-semibold mb-2">{fit.name}</h4>
            <p className="text-sm sm:text-base text-gray-600">{fit.description}</p>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default StepFit;