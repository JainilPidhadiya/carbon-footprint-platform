import React from 'react';
import { Award, Lock } from 'lucide-react';
import type { Badge } from '../../../types';
import { Card, CardBody } from '../../../components/ui';
import { getBadgeIcon } from '../gamificationUtils';

interface BadgeShowcaseGridProps {
  badges: readonly Badge[];
}

export const BadgeShowcaseGrid: React.FC<BadgeShowcaseGridProps> = ({ badges }) => {
  return (
    <section className="md:col-span-2 space-y-4 text-left">
      <h2 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
        <Award className="w-5 h-5 text-emerald-500" />
        Badge Showcase
      </h2>

      <Card className="shadow-sm border-slate-200/60 dark:border-slate-800/80">
        <CardBody className="p-4 grid grid-cols-1 gap-4 divide-y divide-slate-100 dark:divide-slate-800/60">
          {badges.map((b) => (
            <div 
              key={b.id} 
              className={`pt-4 first:pt-0 flex gap-4 items-start ${!b.isUnlocked ? 'opacity-60' : ''}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm ${
                b.isUnlocked 
                  ? 'bg-slate-50 dark:bg-slate-900 border-emerald-500/20' 
                  : 'bg-slate-100/50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
              }`}>
                {b.isUnlocked ? (
                  getBadgeIcon(b.iconName, true)
                ) : (
                  <Lock className="w-5 h-5 text-slate-400" />
                )}
              </div>

              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{b.name}</h4>
                  {b.isUnlocked ? (
                    <span className="text-[8px] uppercase font-bold tracking-widest text-emerald-650 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/10">
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-[8px] uppercase font-bold tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                      Locked
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{b.description}</p>
                {!b.isUnlocked && (
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-450 font-semibold mt-1">
                    Criteria: {b.unlockCriteria}
                  </p>
                )}
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </section>
  );
};
export default BadgeShowcaseGrid;
