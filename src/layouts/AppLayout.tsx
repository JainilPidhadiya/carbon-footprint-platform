import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../store';
import { 
  LayoutDashboard, 
  Calculator, 
  History, 
  GraduationCap, 
  Sun, 
  Moon, 
  Zap,
  Leaf,
  Bot,
  Trophy
} from 'lucide-react';
import { Button } from '../components/ui';

export interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { theme, toggleTheme, xp, user } = useAppStore();
  const location = useLocation();

  React.useEffect(() => {
    const bodyClass = document.body.classList;
    const htmlClass = document.documentElement.classList;
    if (theme === 'dark') {
      bodyClass.add('dark');
      htmlClass.add('dark');
    } else {
      bodyClass.remove('dark');
      htmlClass.remove('dark');
    }
  }, [theme]);

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Baseline', path: '/calculator', icon: Calculator },
    { label: 'Log Tracker', path: '/tracker', icon: History },
    { label: 'Learn & Quiz', path: '/education', icon: GraduationCap },
    { label: 'AI Coach', path: '/coach', icon: Bot },
    { label: 'Challenges', path: '/challenges', icon: Trophy },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-200">
      {/* Skip to Content for Screen Readers */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group" aria-label="EcoTrack Home">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              EcoTrack
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {/* XP Points Tracker Widget */}
            <div 
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 font-semibold text-sm shadow-sm"
              aria-label={`You have ${xp} Experience Points`}
              title="Your Eco XP Points"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{xp} XP</span>
            </div>

            {/* User Profile Badge (Desktop) */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Welcome,</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{user?.name || 'Guest'}</span>
            </div>

            {/* Dark Mode Toggle Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="w-10 h-10 p-0 rounded-full cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700"
              aria-label={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-slate-600" />
              ) : (
                <Sun className="w-5 h-5 text-amber-450" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content & Side Bar Layout wrapper */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-0 sm:px-6 lg:px-8 pb-20 sm:pb-8">
        {/* Sidebar Nav (Desktop only) */}
        <aside className="hidden md:block w-64 pr-8 py-8 shrink-0">
          <nav className="sticky top-24 flex flex-col gap-1.5" aria-label="Desktop Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-l-4 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content Viewport */}
        <main id="main-content" className="flex-1 px-4 sm:px-0 py-6 sm:py-8 outline-none" tabIndex={-1}>
          {children}
        </main>
      </div>

      {/* Bottom Nav Bar (Mobile only) */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around h-16 shadow-lg px-2"
        aria-label="Mobile Navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-450 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
