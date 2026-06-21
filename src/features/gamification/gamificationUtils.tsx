/**
 * @file features/gamification/gamificationUtils.tsx
 * @description Helper functions for gamification and achievements icon resolving.
 */

import React from 'react';
import { Award, Leaf, Apple, Lightbulb } from 'lucide-react';

/**
 * Resolves and renders the React component representing an achievement badge icon
 * based on its name and unlock status.
 * 
 * @param iconName The name of the icon ('Leaf', 'Apple', 'Lightbulb', 'Award', etc.)
 * @param isUnlocked Whether the badge has been unlocked by the user.
 * @returns React node representing the badge icon.
 */
export const getBadgeIcon = (iconName: string, isUnlocked: boolean): React.ReactNode => {
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
