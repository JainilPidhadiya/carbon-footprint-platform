import React from 'react';
import { useAppStore } from '../../store';
import { Zap } from 'lucide-react';

// Subcomponents and utilities
import { GamifiedChallengesList } from './components/GamifiedChallengesList';
import { BadgeShowcaseGrid } from './components/BadgeShowcaseGrid';

export const GamificationHub: React.FC = () => {
  const { xp, challenges, badges, acceptChallenge, completeChallenge } = useAppStore();

  const currentLevel = Math.floor(xp / 100) + 1;
  const xpInCurrentLevel = xp % 100;

  return (
    <div className="space-y-8">
      {/* Header & Progress */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-transparent shadow-md">
        <div className="space-y-1 text-left">
          <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400">
            Player Dashboard
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight">
            Eco Level {currentLevel}
          </h1>
          <p className="text-xs text-slate-400">
            Keep logging carbon actions and completing quizzes to rank up.
          </p>
        </div>

        <div className="w-full sm:w-64 space-y-2 text-left">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-400">Level Progress</span>
            <span>{xpInCurrentLevel} / 100 XP</span>
          </div>
          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-750">
            <div 
              className="h-full bg-gradient-to-r from-emerald-450 to-teal-50 transition-all duration-300"
              style={{ width: `${xpInCurrentLevel}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span>Total XP Earned: {xp} XP</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Weekly Challenges (3 cols) */}
        <GamifiedChallengesList 
          challenges={challenges}
          onAccept={acceptChallenge}
          onComplete={completeChallenge}
        />

        {/* Badges Grid (2 cols) */}
        <BadgeShowcaseGrid badges={badges} />
      </div>
    </div>
  );
};
export default GamificationHub;
