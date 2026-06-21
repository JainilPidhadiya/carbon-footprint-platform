/**
 * @file store/slices/userSlice.ts
 * @description User state slice managing the user profile, carbon target limits, and calculator answers.
 */

import type { StateCreator } from 'zustand';
import type { AppState } from '../index';
import type { UserProfile, CalculatorAnswers, EmissionCategory } from '../../types';
import { DEFAULT_USER } from '../mockData';

/**
 * Interface representing the User slice of the application store.
 */
export interface UserSlice {
  /** The logged-in user profile, or null if anonymous. */
  user: UserProfile | null;
  /** Draft answers for the carbon baseline wizard questionnaire. */
  calculatorDraft: CalculatorAnswers | null;
  /** Sets the logged-in user profile. */
  setUser: (profile: UserProfile | null) => void;
  /** Computes and stores the annual carbon score and category breakdown baseline targets. */
  setBaseline: (carbonScore: number, breakdown: Record<EmissionCategory, number>) => void;
  /** Sets or cleans the calculator baseline answers draft state. */
  setCalculatorDraft: (draft: CalculatorAnswers | null) => void;
}

/**
 * Slice creator function for the User state section.
 */
export const createUserSlice: StateCreator<AppState, [], [], UserSlice> = (set) => ({
  user: DEFAULT_USER,
  calculatorDraft: null,

  setUser: (profile) => set({ user: profile }),

  setBaseline: (carbonScore, breakdown) => set((state) => {
    void breakdown;
    if (!state.user) return {};
    const targetMonthly = Math.round((carbonScore * 0.7) / 12);
    return {
      user: {
        ...state.user,
        carbonScore,
        monthlyTargetCo2e: targetMonthly,
      },
    };
  }),

  setCalculatorDraft: (draft) => set({ calculatorDraft: draft }),
});
