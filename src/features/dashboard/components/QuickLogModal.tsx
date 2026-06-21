import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { EmissionCategory } from '../../../types';
import { CardHeader, CardBody, CardFooter, Button, Input } from '../../../components/ui';

interface QuickLogModalProps {
  showLogModal: boolean;
  setShowLogModal: (show: boolean) => void;
  addActivity: (activity: {
    category: EmissionCategory;
    description: string;
    value: number;
    unit: string;
  }) => void;
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({
  showLogModal,
  setShowLogModal,
  addActivity,
}) => {
  const [category, setCategory] = useState<EmissionCategory>('transport');
  const [description, setDescription] = useState('Commute to work');
  const [value, setValue] = useState(10);
  const [unit, setUnit] = useState('km');

  const handleCategoryChange = (cat: EmissionCategory) => {
    setCategory(cat);
    if (cat === 'transport') {
      setUnit('km');
      setDescription('Commute to work');
    } else if (cat === 'energy') {
      setUnit('kWh');
      setDescription('Daily electricity usage');
    } else if (cat === 'food') {
      setUnit('meal');
      setDescription('Vegetarian Lunch');
    } else {
      setUnit('day');
      setDescription('Residential waste log');
    }
  };

  const handleQuickLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedDesc = description.trim().substring(0, 100);
    if (!sanitizedDesc || value <= 0 || isNaN(value)) return;

    const safeValue = Math.min(value, 50000);

    addActivity({
      category,
      description: sanitizedDesc,
      value: safeValue,
      unit,
    });
    
    // Close & reset
    setShowLogModal(false);
    setDescription('Commute to work');
    setValue(10);
  };

  if (!showLogModal) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transform transition-all">
        <CardHeader className="p-5 flex justify-between items-center">
          <h3 id="modal-title" className="text-lg font-bold font-display text-slate-900 dark:text-slate-50">
            Log New Emission Activity
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLogModal(false)}
            className="w-8 h-8 p-0 rounded-full cursor-pointer text-slate-400"
            aria-label="Close modal"
          >
            ×
          </Button>
        </CardHeader>
        <form onSubmit={handleQuickLogSubmit}>
          <CardBody className="p-5 space-y-4">
            
            {/* Category selector grid */}
            <div>
              <span className="block text-sm font-semibold text-slate-700 dark:text-slate-400 mb-2">Category</span>
              <div className="grid grid-cols-4 gap-2">
                {(['transport', 'energy', 'food', 'waste'] as EmissionCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryChange(cat)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 ${
                      category === cat
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Description / Context"
              required
              maxLength={100}
              value={description}
              onChange={(e) => setDescription(e.target.value.substring(0, 100))}
              placeholder="e.g. Commute to work"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Value"
                type="number"
                min="0.1"
                max="50000"
                step="any"
                required
                value={value || ''}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setValue(isNaN(val) ? 0 : Math.min(val, 50000));
                }}
              />
              <Input
                label="Unit"
                disabled
                value={unit}
                className="opacity-60"
              />
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-3 border border-slate-100 dark:border-slate-800 flex gap-2 text-xs text-slate-500 dark:text-slate-400 items-center">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Emissions will be calculated automatically using default factors.</span>
            </div>

          </CardBody>
          <CardFooter className="p-5 flex gap-3 justify-end bg-slate-50/50 dark:bg-slate-900/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowLogModal(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="cursor-pointer"
            >
              Save Entry
            </Button>
          </CardFooter>
        </form>
      </div>
    </div>
  );
};
export default QuickLogModal;
