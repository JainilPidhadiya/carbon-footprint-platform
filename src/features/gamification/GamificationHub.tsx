import React from 'react';
import { useAppStore } from '../../store';
import { Zap, ShieldCheck } from 'lucide-react';
import { Card, CardBody } from '../../components/ui';

// Subcomponents and utilities
import { GamifiedChallengesList } from './components/GamifiedChallengesList';
import { BadgeShowcaseGrid } from './components/BadgeShowcaseGrid';

export const GamificationHub: React.FC = () => {
  const { xp, challenges, badges, acceptChallenge, completeChallenge } = useAppStore();

  const currentLevel = Math.floor(xp / 100) + 1;
  const xpInCurrentLevel = xp % 100;

  return (
    <div className="space-y-6">
      {/* Main Hub Text Header */}
      <div className="text-left animate-fade-in">
        <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-slate-900 dark:text-slate-50 mb-1">
          Carbon Action Center
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Pledge to localized carbon reduction initiatives and verify your active habits to lower daily emissions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Weekly Action Plans (3 cols) */}
        <GamifiedChallengesList 
          challenges={challenges}
          onAccept={acceptChallenge}
          onComplete={completeChallenge}
        />

        {/* Sidebar Stack (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          {/* Stewardship Progress Card */}
          <section className="space-y-4 text-left">
            <h2 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Stewardship Progress
            </h2>
            <Card className="shadow-sm border-slate-200/60 dark:border-slate-800/80 bg-slate-900 text-white rounded-3xl">
              <CardBody className="p-5 space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-black tracking-widest text-emerald-400">
                    Stewardship Level
                  </span>
                  <h3 className="font-display font-black text-xl tracking-tight">
                    Tier {currentLevel}
                  </h3>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">Milestone Progress</span>
                    <span>{xpInCurrentLevel} / 100 PTS</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-750">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-450 to-teal-400 transition-all duration-300"
                      style={{ width: `${xpInCurrentLevel}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-450 font-semibold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" />
                    <span>Total Eco Points: {xp} PTS</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </section>

          {/* Badges Grid */}
          <BadgeShowcaseGrid badges={badges} />
        </div>
      </div>
    </div>
  );
};
export default GamificationHub;
