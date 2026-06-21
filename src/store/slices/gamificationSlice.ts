/**
 * @file store/slices/gamificationSlice.ts
 * @description Gamification state slice managing user XP, quiz status, weekly challenges, and badge milestones.
 */

import type { StateCreator } from 'zustand';
import type { AppState } from '../index';
import type { Challenge, Badge } from '../../types';
import { evaluateAchievements } from '../../services/achievement.service';
import { DEFAULT_CHALLENGES, DEFAULT_BADGES } from '../mockData';

/**
 * Interface representing the Gamification slice of the application store.
 */
export interface GamificationSlice {
  /** Total Experience Points (XP) earned by the user. */
  xp: number;
  /** Collection of quiz identifiers completed by the user. */
  quizzesCompleted: string[];
  /** Collection of weekly challenges available or accepted. */
  challenges: Challenge[];
  /** Collection of achievement badges. */
  badges: Badge[];
  /** Marks a quiz as completed, awards XP, and evaluates achievement unlocks. */
  completeQuiz: (quizId: string, xpReward: number) => void;
  /** Marks a challenge as accepted by the user. */
  acceptChallenge: (id: string) => void;
  /** Marks a challenge as completed and awards its XP reward. */
  completeChallenge: (id: string) => void;
  /** Checks all achievements and unlocks those that meet criteria. */
  checkBadgeUnlocks: () => void;
  /** Resets all store data back to clean initialization settings. */
  resetData: () => void;
}

/**
 * Slice creator function for the Gamification state section.
 */
export const createGamificationSlice: StateCreator<AppState, [], [], GamificationSlice> = (set, get) => ({
  xp: 150,
  quizzesCompleted: [],
  challenges: DEFAULT_CHALLENGES,
  badges: DEFAULT_BADGES,

  completeQuiz: (quizId, xpReward) => {
    set((state) => {
      if (state.quizzesCompleted.includes(quizId)) return {};
      return {
        quizzesCompleted: [...state.quizzesCompleted, quizId],
        xp: state.xp + xpReward,
      };
    });
    get().checkBadgeUnlocks();
  },

  acceptChallenge: (id) => set((state) => ({
    challenges: state.challenges.map((c) => 
      c.id === id ? { ...c, isAccepted: true } : c
    ),
  })),

  completeChallenge: (id) => {
    set((state) => {
      const targetChallenge = state.challenges.find((c) => c.id === id);
      if (!targetChallenge || targetChallenge.isCompleted) return {};
      
      return {
        challenges: state.challenges.map((c) => 
          c.id === id ? { ...c, isCompleted: true } : c
        ),
        xp: state.xp + targetChallenge.xpReward,
      };
    });
    get().checkBadgeUnlocks();
  },

  checkBadgeUnlocks: () => set((state) => {
    const { activities, xp, badges } = state;
    
    // Delegate unlocking logic to pure achievements service (xp passed as safeScore parameter)
    const nextBadges = evaluateAchievements(activities, 0, xp, 0, badges);

    let xpGain = 0;
    state.badges.forEach((b, idx) => {
      if (!b.isUnlocked && nextBadges[idx].isUnlocked) {
        xpGain += 50; // 50 XP per badge unlock
      }
    });

    return {
      badges: nextBadges,
      xp: state.xp + xpGain,
    };
  }),

  resetData: () => set({
    activities: [],
    xp: 0,
    quizzesCompleted: [],
    challenges: DEFAULT_CHALLENGES,
    badges: DEFAULT_BADGES,
    calculatorDraft: null,
  }),
});
