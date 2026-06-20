import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { EmissionCategory } from '../types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Trash2, 
  Car, 
  Lightbulb, 
  Apple, 
  Trash,
  Calendar,
  Filter
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { activities, deleteActivity } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<'all' | EmissionCategory>('all');

  // Filter activities
  const filteredActivities = activities.filter((act) => {
    if (activeFilter === 'all') return true;
    return act.category === activeFilter;
  });

  // Calculate daily emission totals for the past 7 days (to populate graph)
  const getLast7DaysData = () => {
    const data = [];
    const baseDate = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() - i);
      const dateString = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const dayStart = new Date(d.setHours(0, 0, 0, 0));
      const dayEnd = new Date(d.setHours(23, 59, 59, 999));

      // Sum for this specific day
      const daySum = activities
        .filter((act) => {
          const actDate = new Date(act.loggedAt);
          return actDate >= dayStart && actDate <= dayEnd;
        })
        .reduce((sum, curr) => sum + curr.co2e, 0);

      data.push({
        date: dateString,
        emissions: Math.round(daySum * 10) / 10,
      });
    }
    return data;
  };

  const chartData = getLast7DaysData();

  // Helper for rendering category icons
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

  // Format activity date for groups
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-slate-900 dark:text-slate-50 mb-1">
          Activity Tracker Logs
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Review historical trends and manage logged carbon activities.
        </p>
      </div>

      {/* Chart: 7-Day Trend */}
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

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 text-slate-500">
          <Filter className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
        </div>
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {(['all', 'transport', 'energy', 'food', 'waste'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 ${
                activeFilter === filter
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* History Log List */}
      <Card className="shadow-sm border-slate-200/60 dark:border-slate-800/80">
        <CardBody className="p-0">
          {filteredActivities.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60" role="list">
              {filteredActivities.map((act, index) => {
                const showHeader = index === 0 || formatDate(act.loggedAt) !== formatDate(filteredActivities[index - 1].loggedAt);
                return (
                  <div key={act.id}>
                    {showHeader && (
                      <div className="bg-slate-50 dark:bg-slate-800/50 px-5 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/40">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(act.loggedAt)}</span>
                      </div>
                    )}
                    <div 
                      className="px-5 py-4 flex items-center justify-between gap-4 group hover:bg-slate-50/40 dark:hover:bg-slate-800/25 transition-colors"
                      role="listitem"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center shrink-0">
                          {getCategoryIcon(act.category)}
                        </div>
                        <div className="text-left">
                          <span className="block text-sm font-bold text-slate-900 dark:text-slate-100">
                            {act.description}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Input: {act.value} {act.unit}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 font-display text-right shrink-0">
                          +{act.co2e} kg CO2e
                        </span>
                        
                        <Button
                          variant="ghost"
                          onClick={() => deleteActivity(act.id)}
                          className="w-8 h-8 p-0 rounded-full cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-500 opacity-80 group-hover:opacity-100 transition-all"
                          aria-label={`Delete log: ${act.description}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 flex flex-col items-center gap-2 p-6">
              <Calendar className="w-8 h-8 text-slate-300 dark:text-slate-700" />
              <span className="text-sm font-semibold text-slate-400">No logs found matches your filter.</span>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
