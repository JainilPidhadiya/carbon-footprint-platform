import React from 'react';
import { useAppStore } from '../../store';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Award, 
  Zap, 
  CheckCircle, 
  Lock, 
  Play, 
  Leaf, 
  Apple, 
  Lightbulb 
} from 'lucide-react';

export const GamificationHub: React.FC = () => {
  const { xp, challenges, badges, acceptChallenge, completeChallenge } = useAppStore();

  const currentLevel = Math.floor(xp / 100) + 1;
  const xpInCurrentLevel = xp % 100;

  // Icon map for achievements
  const getBadgeIcon = (iconName: string, isUnlocked: boolean) => {
    const sizeClass = "w-7 h-7";
    const baseColor = isUnlocked ? "text-amber-500 fill-amber-100 dark:fill-amber-950/20" : "text-slate-400 dark:text-slate-600";
    
    switch (iconName) {
      case 'Leaf':
        return <Leaf className={`${sizeClass} ${isUnlocked ? 'text-emerald-500 fill-emerald-100 dark:fill-emerald-950/20' : 'text-slate-400'}`} />;
      case 'Apple':
        return <Apple className={`${sizeClass} ${isUnlocked ? 'text-red-500 fill-red-100 dark:fill-red-950/20' : 'text-slate-400'}`} />;
      case 'Lightbulb':
        return <Lightbulb className={`${sizeClass} ${isUnlocked ? 'text-amber-500 fill-amber-100 dark:fill-amber-950/20' : 'text-slate-400'}`} />;
      case 'Award':
      default:
        return <Award className={`${sizeClass} ${baseColor}`} />;
    }
  };

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
              className="h-full bg-gradient-to-r from-emerald-450 to-teal-500 transition-all duration-300"
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

                    {!c.isAccepted && !c.isCompleted ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => acceptChallenge(c.id)}
                        className="cursor-pointer font-semibold py-2 px-3 text-xs"
                      >
                        Accept
                      </Button>
                    ) : c.isAccepted && !c.isCompleted ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => completeChallenge(c.id)}
                        className="cursor-pointer font-semibold py-2 px-3 text-xs bg-emerald-500 hover:bg-emerald-600 text-white"
                      >
                        Complete
                      </Button>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 px-3">Completed</span>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>

        {/* Badges Grid (2 cols) */}
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
      </div>
    </div>
  );
};
