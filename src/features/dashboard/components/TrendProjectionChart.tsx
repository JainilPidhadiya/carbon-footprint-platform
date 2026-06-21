import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Line } from 'recharts';
import type { ForecastReport, ForecastDataPoint } from '../../../types';
import { Card, CardHeader, CardBody, CardFooter } from '../../../components/ui';

interface TrendProjectionChartProps {
  trendTab: 'history' | 'forecast';
  setTrendTab: (tab: 'history' | 'forecast') => void;
  showThreshold: boolean;
  setShowThreshold: (show: boolean) => void;
  forecast: ForecastReport;
  last7DaysData: { name: string; date: string; emissions: number }[];
}

export const TrendProjectionChart: React.FC<TrendProjectionChartProps> = ({
  trendTab,
  setTrendTab,
  showThreshold,
  setShowThreshold,
  forecast,
  last7DaysData,
}) => {
  return (
    <Card className="lg:col-span-2 shadow-sm border-slate-200/60 dark:border-slate-800/80">
      <CardHeader className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="font-bold text-base font-display text-slate-900 dark:text-slate-50">
            Future Projection & Trends
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Projected daily footprints based on current habit patterns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg flex border border-slate-200/50 dark:border-slate-700/50">
            <button
              type="button"
              onClick={() => setTrendTab('forecast')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 ${
                trendTab === 'forecast'
                  ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              aria-pressed={trendTab === 'forecast'}
            >
              30-Day Forecast
            </button>
            <button
              type="button"
              onClick={() => setTrendTab('history')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 ${
                trendTab === 'history'
                  ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              aria-pressed={trendTab === 'history'}
            >
              Weekly History
            </button>
          </div>
          
          {trendTab === 'forecast' && (
            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-400 select-none">
              <input
                type="checkbox"
                checked={showThreshold}
                onChange={(e) => setShowThreshold(e.target.checked)}
                className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500/30"
              />
              <span>Target Limit</span>
            </label>
          )}
        </div>
      </CardHeader>
      <CardBody className="p-5 h-80">
        <div className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            {trendTab === 'forecast' ? (
              <AreaChart data={forecast.dataPoints as ForecastDataPoint[]} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis 
                  dataKey="day" 
                  tickFormatter={(day) => `Day ${day}`} 
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  stroke="#cbd5e1"
                  className="dark:stroke-slate-800"
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  stroke="#cbd5e1"
                  className="dark:stroke-slate-800"
                />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', background: '#0f172a', border: 'none', color: '#fff' }}
                  labelFormatter={(day) => `Day ${day} Projection`}
                  formatter={(value) => [`${value} kg CO2e`, 'Emissions']}
                />
                <Area 
                  type="monotone" 
                  dataKey="projectedEmission" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorProjected)" 
                  name="Projected Daily"
                />
                {showThreshold && (
                  <Line
                    type="monotone"
                    dataKey="targetLine"
                    stroke="#ef4444"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                    name="Daily Budget Target"
                  />
                )}
              </AreaChart>
            ) : (
              <AreaChart data={last7DaysData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHistory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  stroke="#cbd5e1"
                  className="dark:stroke-slate-800"
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  stroke="#cbd5e1"
                  className="dark:stroke-slate-800"
                />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', background: '#0f172a', border: 'none', color: '#fff' }}
                  labelFormatter={(label, items) => `Date: ${items[0]?.payload?.date || label}`}
                  formatter={(value) => [`${value} kg CO2e`, 'Emissions']}
                />
                <Area 
                  type="monotone" 
                  dataKey="emissions" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorHistory)" 
                  name="Logged Emissions"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardBody>
      {trendTab === 'forecast' && (
        <CardFooter className="px-5 py-3 bg-slate-50 dark:bg-slate-800/20 border-t border-slate-200 dark:border-slate-800/30 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
          <span>
            Change direction: <strong className={`capitalize ${
              forecast.changeDirection === 'decreasing'
                ? 'text-emerald-500'
                : forecast.changeDirection === 'increasing'
                ? 'text-rose-500'
                : 'text-amber-500'
            }`}>{forecast.changeDirection}</strong>
          </span>
          <span>
            Projected next 30 days: <strong>{forecast.totalProjected30Days} kg CO2e</strong> ({forecast.percentChange >= 0 ? '+' : ''}{forecast.percentChange}%)
          </span>
        </CardFooter>
      )}
    </Card>
  );
};
export default TrendProjectionChart;
