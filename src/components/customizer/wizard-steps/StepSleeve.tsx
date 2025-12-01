import React from 'react';
import { motion } from 'framer-motion';
import { ProductSelection } from '@/types/customizer';

interface StepSleeveProps {
  selection: ProductSelection;
  setSelection: (selection: ProductSelection) => void;
}

const sleeveTypes = [
  { id: 'short', name: 'Short Sleeve', description: 'Classic short sleeves' },
  { id: 'full', name: 'Full Sleeve', description: 'Long sleeve style' },
];

const StepSleeve: React.FC<StepSleeveProps> = ({ selection, setSelection }) => {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Choose Sleeve Type</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {sleeveTypes.map((sleeve) => (
          <button
            key={sleeve.id}
            onClick={() => setSelection({ ...selection, sleeveType: sleeve.id })}
            className={`p-6 sm:p-8 rounded-xl border-2 transition-all text-left ${
              selection.sleeveType === sleeve.id
                ? 'border-gold bg-gold/5'
                : 'border-gray-200 hover:border-gold/50'
            }`}
          >
            <h4 className="text-lg sm:text-xl font-semibold mb-2">{sleeve.name}</h4>
            <p className="text-sm sm:text-base text-gray-600">{sleeve.description}</p>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default StepSleeve;