import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { Card, CardBody, CardFooter, CardHeader, Button } from '../components/ui';
import { MOCK_TIPS } from '../config/constants';
import { TrendingDown, Plus, Lightbulb } from 'lucide-react';
import { generateRecommendations } from '../services/advisor.service';
import { generateForecast } from '../services/forecast.service';
import { calculateEcoScore } from '../services/ecoScore.service';
import { filterActivitiesByMonth, sumActivitiesCo2e, getEmissionsByCategory } from '../utils/activityUtils';

// Subcomponents
import { DashboardMetricsGrid } from '../features/dashboard/components/DashboardMetricsGrid';
import { EmissionBreakdownChart } from '../features/dashboard/components/EmissionBreakdownChart';
import { TrendProjectionChart } from '../features/dashboard/components/TrendProjectionChart';
import { QuickLogModal } from '../features/dashboard/components/QuickLogModal';

export const DashboardPage: React.FC = () => {
  const { user, activities, addActivity, xp, challenges } = useAppStore();
  const [showLogModal, setShowLogModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [trendTab, setTrendTab] = useState<'history' | 'forecast'>('forecast');
  const [showThreshold, setShowThreshold] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Calculate current month's emissions
  const currentMonthActivities = filterActivitiesByMonth(activities);

  const totalMonthlyEmissions = sumActivitiesCo2e(currentMonthActivities);
  const targetBudget = user?.monthlyTargetCo2e || 450;
  const budgetRemaining = Math.max(0, targetBudget - totalMonthlyEmissions);
  const budgetPercentUsed = Math.min(100, Math.round((totalMonthlyEmissions / targetBudget) * 100));

  // Category breakdown for chart
  const categorySums = getEmissionsByCategory(currentMonthActivities);

  const chartData = [
    { name: 'Transport', value: Math.round(categorySums.transport), color: '#6366f1' }, // indigo-500
    { name: 'Energy', value: Math.round(categorySums.energy), color: '#f59e0b' },       // amber-500
    { name: 'Food', value: Math.round(categorySums.food), color: '#10b981' },         // emerald-500
    { name: 'Waste', value: Math.round(categorySums.waste), color: '#f43f5e' },        // rose-500
  ].filter(item => item.value > 0);

  const budgetColor = 
    budgetPercentUsed < 70 
      ? 'text-emerald-500 dark:text-emerald-450 border-emerald-500/20' 
      : budgetPercentUsed < 90 
      ? 'text-amber-500 dark:text-amber-450 border-amber-500/20' 
      : 'text-rose-500 dark:text-rose-450 border-rose-500/20';

  // Get active tip
  const activeTip = MOCK_TIPS[Math.floor(xp / 100) % MOCK_TIPS.length] || MOCK_TIPS[0];

  // Calculate challenge completion percentage
  const completedChallenges = challenges.filter(c => c.isCompleted).length;
  const challengeCompletionPct = challenges.length > 0 
    ? (completedChallenges / challenges.length) * 100 
    : 0;

  // Calculate actual Eco Score using service layer
  const ecoScoreResult = calculateEcoScore(totalMonthlyEmissions, targetBudget, challengeCompletionPct);
  
  // Generate 30-day forecast projections
  const forecast = generateForecast(activities, targetBudget, challengeCompletionPct);

  // Generate AI advisor recommendations preview
  const recommendations = generateRecommendations(activities, targetBudget);

  // Weekly history emissions (last 7 days)
  const last7DaysData = Array.from({ length: 7 }).map((_, index) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - index));
    const dateStr = d.toISOString().split('T')[0];
    
    // Sum emissions on this day
    const dayEmissions = activities
      .filter((act) => act.loggedAt && act.loggedAt.split('T')[0] === dateStr)
      .reduce((sum, act) => sum + act.co2e, 0);

    return {
      name: d.toLocaleDateString(undefined, { weekday: 'short' }),
      date: dateStr,
      emissions: Math.round(dayEmissions * 10) / 10,
    };
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse" aria-hidden="true">
        {/* Welcome Banner Skeleton */}
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl w-full" />
        
        {/* Grid Metrics Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-3xl md:col-span-2" />
          <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        </div>

        {/* Analytics & Tips section Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl md:col-span-3" />
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl md:col-span-2" />
        </div>

        {/* Forecast & Advisor sections Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl md:col-span-2" />
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Executive Carbon Overview Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-500/15 dark:border-emerald-500/10 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-slate-900 dark:text-slate-50 mb-1 text-left">
              Carbon Footprint Overview
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 text-left">
              Real-time monitoring of your daily activities, carbon budget limits, and reduction targets.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowLogModal(true)}
            leftIcon={<Plus className="w-5 h-5" />}
            className="shadow-emerald-500/10 cursor-pointer font-semibold py-3 px-5 shrink-0"
          >
            Log Carbon Entry
          </Button>
        </div>

        {/* 5-Indicator Quick Carbon Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-emerald-500/10 text-left animate-fade-in">
          <div className="bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-emerald-500/5">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">
              Current Footprint
            </span>
            <strong className="text-lg sm:text-xl font-black font-display text-slate-900 dark:text-slate-50">
              {Math.round(totalMonthlyEmissions)} kg CO₂e
            </strong>
          </div>
          <div className="bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-emerald-500/5">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">
              Top Source
            </span>
            <strong className="text-lg sm:text-xl font-black font-display text-indigo-600 dark:text-indigo-400 capitalize">
              {recommendations.topCategory || 'None'}
            </strong>
          </div>
          <div className="bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-emerald-500/5">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">
              Reduction Potential
            </span>
            <strong className="text-lg sm:text-xl font-black font-display text-emerald-600 dark:text-emerald-450">
              -{recommendations.estimatedSavingsKg} kg CO₂
            </strong>
          </div>
          <div className="bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-emerald-500/5">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">
              30-Day Forecast
            </span>
            <strong className="text-lg sm:text-xl font-black font-display text-amber-600 dark:text-amber-450">
              {forecast.totalProjected30Days} kg CO₂
            </strong>
          </div>
          <div className="col-span-2 md:col-span-1 bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-emerald-500/5">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">
              Recommended Action
            </span>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 italic line-clamp-2 leading-tight">
              "{recommendations.quickWin}"
            </p>
          </div>
        </div>
      </div>

      {/* Grid Metrics */}
      <DashboardMetricsGrid 
        totalMonthlyEmissions={totalMonthlyEmissions}
        targetBudget={targetBudget}
        budgetRemaining={budgetRemaining}
        budgetPercentUsed={budgetPercentUsed}
        budgetColor={budgetColor}
        carbonScore={user?.carbonScore || 7800}
        ecoScoreValue={ecoScoreResult.score}
      />

      {/* Analytics & Tips section */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Donut Chart breakdown */}
        <EmissionBreakdownChart 
          chartData={chartData}
          totalMonthlyEmissions={totalMonthlyEmissions}
        />

        {/* Tip of the day Card */}
        <Card className="md:col-span-2 shadow-sm border-slate-200/60 dark:border-slate-800/80 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-emerald-950/20 border-emerald-500/10 dark:border-emerald-500/10 flex flex-col justify-between">
          <CardBody className="p-6 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Lightbulb className="w-5 h-5 fill-current" />
                <span>Tip of the Day</span>
              </div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                "{activeTip.text}"
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-500/10 flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Potential Daily Savings</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <TrendingDown className="w-4 h-4" />
                {activeTip.impactKg} kg CO2e
              </span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Forecast & Advisor Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 30-Day Trend & Projections */}
        <TrendProjectionChart 
          trendTab={trendTab}
          setTrendTab={setTrendTab}
          showThreshold={showThreshold}
          setShowThreshold={setShowThreshold}
          forecast={forecast}
          last7DaysData={last7DaysData}
        />

        {/* AI Recommendations Preview */}
        <Card className="shadow-sm border-slate-200/60 dark:border-slate-800/80 flex flex-col justify-between">
          <CardHeader className="p-5">
            <span className="text-[10px] uppercase tracking-wider font-black text-slate-400 block mb-1">
              AI Carbon Advisor
            </span>
            <h3 className="font-bold text-base font-display text-slate-900 dark:text-slate-50">
              Quick Wins & Insights
            </h3>
          </CardHeader>
          <CardBody className="p-5 pt-0 space-y-4 flex-1">
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-500/10">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <div className="text-xs">
                <span className="text-slate-500 dark:text-slate-400 block font-semibold">Top Emission Driver</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">{recommendations.topCategory} ({recommendations.topCategoryPercentage}%)</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-sans">
                <TrendingDown className="w-4 h-4 text-emerald-500" />
                Quick Action Win
              </span>
              <p className="text-slate-700 dark:text-slate-400 italic pl-5 line-clamp-3">
                "{recommendations.quickWin}"
              </p>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-sans">
                🤖 Long-Term Strategy
              </span>
              <p className="text-slate-700 dark:text-slate-400 italic pl-5 line-clamp-3">
                "{recommendations.longTermImprovement}"
              </p>
            </div>
          </CardBody>
          <CardFooter className="p-5 pt-3 border-t border-slate-100 dark:border-slate-800/30 bg-slate-50/50 dark:bg-slate-900/10 flex flex-col gap-3 text-xs text-left">
            <div className="flex justify-between items-center w-full">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">
                Projected Monthly Savings:
              </span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-black text-sm">
                -{recommendations.estimatedSavingsKg} kg CO₂
              </strong>
            </div>

            {recommendations.estimatedSavingsKg > 0 && (
              <div 
                className="grid grid-cols-3 gap-2.5 w-full pt-2.5 border-t border-slate-200/50 dark:border-slate-800/50 text-[10px] font-bold text-slate-500 dark:text-slate-400"
                aria-label="Environmental savings equivalencies"
              >
                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 hover:border-emerald-500/20 transition-all duration-200 text-center">
                  <span className="text-base mb-1" role="img" aria-label="tree">🌳</span>
                  <span className="text-emerald-600 dark:text-emerald-450 font-extrabold">≈ {Math.round(recommendations.estimatedSavingsKg / 20)} Trees</span>
                  <span className="text-[8px] font-medium text-slate-400 mt-0.5">Planted</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/10 hover:border-indigo-500/20 transition-all duration-200 text-center">
                  <span className="text-base mb-1" role="img" aria-label="car">🚗</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">≈ {Math.round(recommendations.estimatedSavingsKg * 4)} km</span>
                  <span className="text-[8px] font-medium text-slate-400 mt-0.5">Not Driven</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10 hover:border-amber-500/20 transition-all duration-200 text-center">
                  <span className="text-base mb-1" role="img" aria-label="coal">🔥</span>
                  <span className="text-amber-600 dark:text-amber-450 font-extrabold">≈ {Math.round(recommendations.estimatedSavingsKg * 0.45)} kg</span>
                  <span className="text-[8px] font-medium text-slate-400 mt-0.5">Coal Avoided</span>
                </div>
              </div>
            )}

            <div className="flex justify-end w-full pt-1">
              <Link 
                to="/coach" 
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                Full Plan →
              </Link>
            </div>
          </CardFooter>
        </Card>

      </div>

      {/* Log Activity Modal */}
      <QuickLogModal 
        showLogModal={showLogModal}
        setShowLogModal={setShowLogModal}
        addActivity={addActivity}
      />
    </div>
  );
};
