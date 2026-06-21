/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import type { EmissionCategory } from '../types';
import { MOCK_TIPS } from '../config/constants';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Line
} from 'recharts';
import { 
  TrendingDown, 
  Plus, 
  Leaf, 
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { generateRecommendations } from '../services/advisor.service';
import { generateForecast } from '../services/forecast.service';

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

  // Form states for quick log
  const [category, setCategory] = useState<EmissionCategory>('transport');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState(10);
  const [unit, setUnit] = useState('km');

  const handleCategoryChange = (cat: EmissionCategory) => {
    setCategory(cat);
    // Set default units
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
    // Reset and close
    setShowLogModal(false);
    setDescription('');
    setValue(10);
  };

  // Calculate current month's emissions
  const now = new Date();
  const currentMonthActivities = activities.filter((act) => {
    const actDate = new Date(act.loggedAt);
    return (
      actDate.getMonth() === now.getMonth() &&
      actDate.getFullYear() === now.getFullYear()
    );
  });

  const totalMonthlyEmissions = currentMonthActivities.reduce((acc, curr) => acc + curr.co2e, 0);
  const targetBudget = user?.monthlyTargetCo2e || 450;
  const budgetRemaining = Math.max(0, targetBudget - totalMonthlyEmissions);
  const budgetPercentUsed = Math.min(100, Math.round((totalMonthlyEmissions / targetBudget) * 100));

  // Category breakdown for chart
  const categorySums = currentMonthActivities.reduce(
    (acc, curr) => {
      acc[curr.category] += curr.co2e;
      return acc;
    },
    { transport: 0, energy: 0, food: 0, waste: 0 } as Record<EmissionCategory, number>
  );

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
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-500/15 dark:border-emerald-500/10 rounded-3xl p-6 sm:p-8">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-slate-900 dark:text-slate-50 mb-1">
            How is your footprint today?
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Let's maintain your green routines. Tracking builds consciousness!
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            handleCategoryChange('transport');
            setShowLogModal(true);
          }}
          leftIcon={<Plus className="w-5 h-5" />}
          className="shadow-emerald-500/10 cursor-pointer font-semibold py-3 px-5"
        >
          Log Activity
        </Button>
      </div>

      {/* Grid Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Budget remaining */}
        <Card className="md:col-span-2 shadow-sm border-slate-200/60 dark:border-slate-800/80">
          <CardBody className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Monthly Budget Status
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
                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' 
                    : budgetPercentUsed < 90 
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500' 
                    : 'bg-gradient-to-r from-rose-500 to-red-650'
                }`}
                style={{ width: `${budgetPercentUsed}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-center sm:text-left pt-2 border-t border-slate-100 dark:border-slate-800/50">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Remaining Balance</span>
                <span className="text-xl font-bold font-display text-emerald-600 dark:text-emerald-400">
                  {Math.round(budgetRemaining)} kg CO2e
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Baseline Target</span>
                <span className="text-xl font-bold font-display text-slate-800 dark:text-slate-200">
                  {user?.carbonScore ? (user.carbonScore / 12).toFixed(0) : '650'} kg/mo
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Card 2: Eco Score & Quick Actions */}
        <Card className="shadow-sm border-slate-200/60 dark:border-slate-800/80 bg-gradient-to-br from-slate-900 to-slate-950 dark:from-slate-900 dark:to-slate-950 text-white border-transparent">
          <CardBody className="p-6 flex flex-col justify-between h-full space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
                  Platform Eco Score
                </span>
                <h3 className="text-3xl font-black font-display text-emerald-400">
                  {Math.round(budgetPercentUsed <= 70 ? 100 : Math.max(0, 100 - (budgetPercentUsed - 70) * 3.3))}/100
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Leaf className="w-5 h-5 fill-current" />
              </div>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed text-left">
              {budgetPercentUsed <= 70 
                ? 'Excellent! You are well within your carbon limit threshold.' 
                : 'Warning: You are approaching or exceeding your safety limit threshold.'}
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
              <Link 
                to="/coach" 
                className="w-full text-center py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all"
              >
                🤖 Consult AI Coach
              </Link>
              <Link 
                to="/challenges" 
                className="w-full text-center py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all"
              >
                🏆 View Weekly Challenges
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Analytics & Tips section */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Donut Chart breakdown */}
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
                  <AreaChart data={forecast.dataPoints as any} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
                      formatter={(value: any) => [`${value} kg CO2e`, 'Emissions']}
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
                      formatter={(value: any) => [`${value} kg CO2e`, 'Emissions']}
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

        {/* AI Recommendations Preview */}
        <Card className="shadow-sm border-slate-200/60 dark:border-slate-800/80 flex flex-col justify-between">
          <CardHeader className="p-5">
            <span className="text-[10px] uppercase tracking-wider font-black text-slate-400 block mb-1">
              AI Sustainability Advisor
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
      {showLogModal && (
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
      )}
    </div>
  );
};
