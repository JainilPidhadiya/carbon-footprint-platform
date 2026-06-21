import React from 'react';
import { CheckCircle, HelpCircle } from 'lucide-react';

import type { CalculatorAnswers } from '../../../types';

interface BaselineResultSummaryProps {
  annualTotalCo2e: number;
  transportYearly: number;
  electricityYearly: number;
  foodYearly: number;
  wasteYearly: number;
  values: CalculatorAnswers;
}

export const BaselineResultSummary: React.FC<BaselineResultSummaryProps> = ({
  annualTotalCo2e,
  transportYearly,
  electricityYearly,
  foodYearly,
  wasteYearly,
  values,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center py-2">
        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
        <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100">
          Review Summary Results
        </h2>
        <div className="my-5 inline-block bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-6 py-4">
          <span className="block text-4xl font-extrabold text-emerald-600 dark:text-emerald-450 font-display">
            {(annualTotalCo2e / 1000).toFixed(1)} <span className="text-lg font-bold">tonnes</span>
          </span>
          <span className="text-xs uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400 block mt-1">
            Annual CO2e Baseline
          </span>
        </div>
      </div>

      <div className="space-y-3 text-left">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Emissions Breakdown
        </h3>
        
        {/* Transport representation */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-600 dark:text-slate-300">Transport ({values.weeklyDistance} km/wk via {values.transportMode})</span>
            <span className="text-slate-900 dark:text-slate-100">{Math.round(transportYearly)} kg</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 animate-slide-in" style={{ width: `${Math.min(100, (transportYearly / Math.max(1, annualTotalCo2e)) * 100)}%` }} />
          </div>
        </div>

        {/* Electricity representation */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-600 dark:text-slate-300">Power & Heating ({values.electricityBill} kWh/mo)</span>
            <span className="text-slate-900 dark:text-slate-100">{Math.round(electricityYearly)} kg</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 animate-slide-in" style={{ width: `${Math.min(100, (electricityYearly / Math.max(1, annualTotalCo2e)) * 100)}%` }} />
          </div>
        </div>

        {/* Food representation */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-600 dark:text-slate-300">Dietary Profile ({values.dietType})</span>
            <span className="text-slate-900 dark:text-slate-100">{Math.round(foodYearly)} kg</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 animate-slide-in" style={{ width: `${Math.min(100, (foodYearly / Math.max(1, annualTotalCo2e)) * 100)}%` }} />
          </div>
        </div>

        {/* Waste representation */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-600 dark:text-slate-300">Recycling & Household Waste</span>
            <span className="text-slate-900 dark:text-slate-100">{Math.round(wasteYearly)} kg</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500 animate-slide-in" style={{ width: `${Math.min(100, (wasteYearly / Math.max(1, annualTotalCo2e)) * 100)}%` }} />
          </div>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs text-left text-slate-500 dark:text-slate-400 flex gap-2">
        <HelpCircle className="w-5 h-5 text-emerald-500 shrink-0" />
        <span>
          Setting this baseline targets a 30% footprint drop. Your monthly budget threshold will be set to <strong>{Math.round((annualTotalCo2e * 0.7) / 12)} kg CO2e</strong>.
        </span>
      </div>
    </div>
  );
};
export default BaselineResultSummary;
