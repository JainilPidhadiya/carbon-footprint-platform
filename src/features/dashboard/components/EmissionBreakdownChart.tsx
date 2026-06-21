import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Leaf } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui';

interface ChartItem {
  name: string;
  value: number;
  color: string;
}

interface EmissionBreakdownChartProps {
  chartData: ChartItem[];
  totalMonthlyEmissions: number;
}

export const EmissionBreakdownChart: React.FC<EmissionBreakdownChartProps> = ({
  chartData,
  totalMonthlyEmissions,
}) => {
  return (
    <Card className="md:col-span-3 shadow-sm border-slate-200/60 dark:border-slate-800/80">
      <CardHeader className="p-5 flex justify-between items-center">
        <h3 className="font-bold text-base font-display text-slate-900 dark:text-slate-50">
          Emission Breakdown (This Month)
        </h3>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Sorted by Category
        </span>
      </CardHeader>
      <CardBody className="p-5 h-72 flex items-center justify-center relative">
        {chartData.length > 0 ? (
          <div className="w-full h-full flex flex-col sm:flex-row items-center justify-around">
            <div className="w-48 h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} kg CO2e`, 'Emissions']}
                    contentStyle={{ borderRadius: '12px', background: '#0f172a', border: 'none', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Absolute middle label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</span>
                <span className="text-xl font-black text-slate-800 dark:text-slate-200 font-display">
                  {Math.round(totalMonthlyEmissions)}kg
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4 sm:mt-0 text-xs font-semibold w-full sm:w-auto px-4">
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                  </div>
                  <span className="text-slate-900 dark:text-slate-100">{item.value} kg</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 flex flex-col items-center gap-2">
            <Leaf className="w-8 h-8 text-slate-300 dark:text-slate-700" />
            <span className="text-sm font-semibold text-slate-400">No emissions logged this month yet.</span>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
export default EmissionBreakdownChart;
