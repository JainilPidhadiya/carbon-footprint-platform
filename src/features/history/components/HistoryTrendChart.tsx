import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardHeader, CardBody } from '../../../components/ui';

interface HistoryTrendChartProps {
  chartData: { date: string; emissions: number }[];
}

export const HistoryTrendChart: React.FC<HistoryTrendChartProps> = ({ chartData }) => {
  return (
    <Card className="shadow-sm border-slate-200/60 dark:border-slate-800/80">
      <CardHeader className="p-5">
        <h3 className="font-bold text-base font-display text-slate-900 dark:text-slate-50">
          Carbon Trend (Past 7 Days)
        </h3>
      </CardHeader>
      <CardBody className="p-5 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
            <XAxis 
              dataKey="date" 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
            />
            <Tooltip 
              formatter={(value) => [`${value} kg CO2e`, 'Emissions']}
              contentStyle={{ borderRadius: '12px', background: '#0f172a', border: 'none', color: '#fff' }}
            />
            <Area 
              type="monotone" 
              dataKey="emissions" 
              stroke="#10b981" 
              strokeWidth={2.5} 
              fillOpacity={1} 
              fill="url(#colorEmissions)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};
export default HistoryTrendChart;
