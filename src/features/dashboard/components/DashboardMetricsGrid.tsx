import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { Card, CardBody } from '../../../components/ui';

interface DashboardMetricsGridProps {
  totalMonthlyEmissions: number;
  targetBudget: number;
  budgetRemaining: number;
  budgetPercentUsed: number;
  budgetColor: string;
  carbonScore: number;
  ecoScoreValue: number;
}

export const DashboardMetricsGrid: React.FC<DashboardMetricsGridProps> = ({
  totalMonthlyEmissions,
  targetBudget,
  budgetRemaining,
  budgetPercentUsed,
  budgetColor,
  carbonScore,
  ecoScoreValue,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Card 1: Budget remaining */}
      <Card className="md:col-span-2 shadow-sm border-slate-200/60 dark:border-slate-800/80">
        <CardBody className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 block mb-1">
                Monthly Carbon Budget Allowance
              </span>
              <h2 className="text-2xl font-black font-display text-slate-900 dark:text-slate-50">
                {Math.round(totalMonthlyEmissions)} / {targetBudget} kg CO2e
              </h2>
            </div>
            <div className={`border rounded-full px-3 py-1 text-xs font-bold ${budgetColor}`}>
              {budgetPercentUsed}% Used
            </div>
          </div>

          {/* Accessible Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden mb-5">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                budgetPercentUsed < 70 
                  ? 'bg-gradient-to-r from-emerald-450 to-emerald-500' 
                  : budgetPercentUsed < 90 
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500' 
                  : 'bg-gradient-to-r from-rose-500 to-red-655'
              }`}
              style={{ width: `${budgetPercentUsed}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-center sm:text-left pt-2 border-t border-slate-100 dark:border-slate-800/50">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Remaining Carbon Budget</span>
              <span className="text-xl font-bold font-display text-emerald-600 dark:text-emerald-400">
                {Math.round(budgetRemaining)} kg CO2e
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Target Limit</span>
              <span className="text-xl font-bold font-display text-slate-800 dark:text-slate-200">
                {carbonScore ? (carbonScore / 12).toFixed(0) : '650'} kg/mo
              </span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Card 2: Carbon Benchmark Card */}
      <Card className="shadow-sm border-slate-200/60 dark:border-slate-800/80 bg-gradient-to-br from-slate-900 to-slate-950 dark:from-slate-900 dark:to-slate-950 text-white border-transparent">
        <CardBody className="p-6 flex flex-col justify-between h-full space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
                Carbon Benchmark Index
              </span>
              <h3 className="text-2xl font-black font-display text-emerald-400">
                {ecoScoreValue}/100
              </h3>
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Leaf className="w-4 h-4 fill-current" />
            </div>
          </div>

          {/* Benchmark comparison data */}
          <div className="pt-1 text-[11px] text-slate-300 text-left space-y-1.5 leading-tight">
            <div className="flex justify-between border-b border-slate-800/40 pb-1">
              <span>Current Footprint:</span>
              <span className="font-bold text-white">{Math.round(totalMonthlyEmissions)} kg CO₂e</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/40 pb-1">
              <span>Average User:</span>
              <span className="font-bold text-white">500 kg CO₂e</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/40 pb-1">
              <span>Status:</span>
              <span className={`font-bold ${totalMonthlyEmissions < 500 ? 'text-emerald-400' : 'text-rose-455'}`}>
                {totalMonthlyEmissions < 500 ? 'Better than average' : 'Worse than average'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Variance:</span>
              <span className={`font-bold ${totalMonthlyEmissions < 500 ? 'text-emerald-400' : 'text-rose-455'}`}>
                {Math.abs(Math.round(((500 - totalMonthlyEmissions) / 500) * 100))}% {totalMonthlyEmissions < 500 ? 'Lower' : 'Higher'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
            <Link 
              to="/coach" 
              className="w-full text-center py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all"
            >
              🤖 Consult Carbon Advisor
            </Link>
            <Link 
              to="/challenges" 
              className="w-full text-center py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all"
            >
              🌱 View Carbon Action Plans
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
export default DashboardMetricsGrid;
