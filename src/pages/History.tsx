import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Card, CardBody } from '../components/ui';
import type { EmissionCategory } from '../types';
import { Calendar, Filter } from 'lucide-react';

// Subcomponents and utilities
import { formatDate, getLast7DaysData } from '../features/history/historyUtils';
import { HistoryTrendChart } from '../features/history/components/HistoryTrendChart';
import { HistoryLogItem } from '../features/history/components/HistoryLogItem';

export const HistoryPage: React.FC = () => {
  const { activities, deleteActivity } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<'all' | EmissionCategory>('all');

  const filteredActivities = activities.filter((act) => {
    if (activeFilter === 'all') return true;
    return act.category === activeFilter;
  });

  const chartData = getLast7DaysData(activities);

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
      <HistoryTrendChart chartData={chartData} />

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
                    <HistoryLogItem 
                      activity={act}
                      onDelete={deleteActivity}
                    />
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
export default HistoryPage;
