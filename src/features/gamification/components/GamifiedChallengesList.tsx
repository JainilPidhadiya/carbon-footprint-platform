import React from 'react';
import { Play, CheckCircle, Zap } from 'lucide-react';
import type { Challenge } from '../../../types';
import { Card, CardBody, Button } from '../../../components/ui';

interface GamifiedChallengesListProps {
  challenges: readonly Challenge[];
  onAccept: (id: string) => void;
  onComplete: (id: string) => void;
}

export const GamifiedChallengesList: React.FC<GamifiedChallengesListProps> = ({
  challenges,
  onAccept,
  onComplete,
}) => {
  return (
    <section className="md:col-span-3 space-y-4 text-left">
      <h2 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
        <Play className="w-5 h-5 text-emerald-500 rotate-90 fill-current" />
        Active Weekly Challenges
      </h2>

      <div className="flex flex-col gap-4">
        {challenges.map((c) => (
          <Card 
            key={c.id} 
            className={`transition-all border-slate-200 dark:border-slate-800 ${
              c.isCompleted 
                ? 'bg-slate-50/50 dark:bg-slate-900/10 border-slate-100 dark:border-slate-800/40 opacity-75' 
                : c.isAccepted 
                ? 'border-emerald-500/30 dark:border-emerald-500/20' 
                : ''
            }`}
          >
            <CardBody className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 dark:text-slate-400">
                    {c.category}
                  </span>
                  {c.isCompleted && (
                    <span className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-650 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Done
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-50">{c.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{c.description}</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/40">
                <span className="text-xs font-bold text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                  <Zap className="w-3 h-3 fill-current" />
                  {c.xpReward} XP
                </span>

                {!c.isCompleted ? (
                  !c.isAccepted ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onAccept(c.id)}
                      className="cursor-pointer font-semibold py-2 px-3 text-xs"
                    >
                      Accept
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onComplete(c.id)}
                      className="cursor-pointer font-semibold py-2 px-3 text-xs bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      Complete
                    </Button>
                  )
                ) : (
                  <span className="text-xs font-bold text-slate-400 px-3">Completed</span>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
};
export default GamifiedChallengesList;
