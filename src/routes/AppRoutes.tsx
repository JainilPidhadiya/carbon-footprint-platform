import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { DashboardPage } from '../pages/Dashboard';
import { CalculatorPage } from '../pages/Calculator';
import { HistoryPage } from '../pages/History';
import { EducationPage } from '../pages/Education';
import { AiCoach } from '../features/coach/AiCoach';
import { GamificationHub } from '../features/gamification/GamificationHub';

export const AppRoutes: React.FC = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/tracker" element={<HistoryPage />} />
        <Route path="/education" element={<EducationPage />} />
        <Route path="/coach" element={<AiCoach />} />
        <Route path="/challenges" element={<GamificationHub />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
};
export default AppRoutes;
