import React from 'react';
import { Car, Lightbulb, Apple, Trash, Trash2 } from 'lucide-react';
import type { EmissionActivity, EmissionCategory } from '../../../types';
import { Button } from '../../../components/ui';

interface HistoryLogItemProps {
  activity: EmissionActivity;
  onDelete: (id: string) => void;
}

const getCategoryIcon = (category: EmissionCategory) => {
  switch (category) {
    case 'transport':
      return <Car className="w-4 h-4 text-indigo-500" />;
    case 'energy':
      return <Lightbulb className="w-4 h-4 text-amber-500" />;
    case 'food':
      return <Apple className="w-4 h-4 text-emerald-500" />;
    case 'waste':
      return <Trash className="w-4 h-4 text-rose-500" />;
  }
};

export const HistoryLogItem: React.FC<HistoryLogItemProps> = ({ activity, onDelete }) => {
  return (
    <div 
      className="px-5 py-4 flex items-center justify-between gap-4 group hover:bg-slate-50/40 dark:hover:bg-slate-800/25 transition-colors"
      role="listitem"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center shrink-0">
          {getCategoryIcon(activity.category)}
        </div>
        <div className="text-left">
          <span className="block text-sm font-bold text-slate-900 dark:text-slate-100">
            {activity.description}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Input: {activity.value} {activity.unit}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 font-display text-right shrink-0">
          +{activity.co2e} kg CO2e
        </span>
        
        <Button
          variant="ghost"
          onClick={() => onDelete(activity.id)}
          className="w-8 h-8 p-0 rounded-full cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-500 opacity-80 group-hover:opacity-100 transition-all"
          aria-label={`Delete log: ${activity.description}`}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
export default HistoryLogItem;
