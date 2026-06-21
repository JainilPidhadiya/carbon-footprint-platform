/**
 * @file store/index.ts
 * @description Central Zustand State Store configuration for the EcoTrack platform.
 * Integrates theme, user, activity tracker, and gamification state slices with client-side persistence.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EmissionCategory } from '../types';
import { createThemeSlice, type ThemeSlice } from './slices/themeSlice';
import { createUserSlice, type UserSlice } from './slices/userSlice';
import { createActivitySlice, type ActivitySlice } from './slices/activitySlice';
import { createGamificationSlice, type GamificationSlice } from './slices/gamificationSlice';

/**
 * Combined application state representing all slices (Theme, User, Activity, Gamification).
 */
export type AppState = ThemeSlice & UserSlice & ActivitySlice & GamificationSlice;

/**
 * Main Zustand hook to access global application state with local storage persistence.
 */
export const useAppStore = create<AppState>()(
  persist(
    (set, get, store) => ({
      ...createThemeSlice(set, get, store),
      ...createUserSlice(set, get, store),
      ...createActivitySlice(set, get, store),
      ...createGamificationSlice(set, get, store),
    }),
    {
      name: 'ecotrack-store',
      /**
       * Custom merge logic that runs during state hydration to sanitize and validate
       * the persisted state from local storage.
       * 
       * @param persistedState The state retrieved from storage.
       * @param currentState The default/current state.
       * @returns Hydrated and sanitized state.
       */
      merge: (persistedState, currentState) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return currentState;
        }

        const typedPersisted = persistedState as Record<string, unknown>;

        // 1. Sanitize user profile
        let user = currentState.user;
        if (typedPersisted.user && typeof typedPersisted.user === 'object') {
          const pUser = typedPersisted.user as Record<string, unknown>;
          user = {
            id: typeof pUser.id === 'string' ? pUser.id : (currentState.user?.id || 'user_1'),
            email: typeof pUser.email === 'string' ? pUser.email : (currentState.user?.email || 'eco.warrior@hackathon.org'),
            name: typeof pUser.name === 'string' ? pUser.name : (currentState.user?.name || 'Eco Warrior'),
            monthlyTargetCo2e: typeof pUser.monthlyTargetCo2e === 'number' && !isNaN(pUser.monthlyTargetCo2e) && pUser.monthlyTargetCo2e > 0
              ? Math.min(pUser.monthlyTargetCo2e, 10000)
              : (currentState.user?.monthlyTargetCo2e || 450),
            createdAt: typeof pUser.createdAt === 'string' ? pUser.createdAt : new Date().toISOString(),
            carbonScore: typeof pUser.carbonScore === 'number' && !isNaN(pUser.carbonScore) && pUser.carbonScore > 0
              ? Math.min(pUser.carbonScore, 1000000)
              : (currentState.user?.carbonScore || 7800),
          };
        }

        // 2. Sanitize activities array
        let activities = currentState.activities;
        if (Array.isArray(typedPersisted.activities)) {
          const rawActivities = typedPersisted.activities as Record<string, unknown>[];
          activities = rawActivities
            .filter((act) => act && typeof act === 'object' && typeof act.id === 'string')
            .map((act) => ({
              id: act.id as string,
              userId: typeof act.userId === 'string' ? act.userId : (user?.id || 'guest'),
              category: ['transport', 'energy', 'food', 'waste'].includes(act.category as string) ? (act.category as EmissionCategory) : 'food',
              description: typeof act.description === 'string' ? act.description.substring(0, 100) : 'Activity Log',
              value: typeof act.value === 'number' && !isNaN(act.value) && act.value >= 0 ? Math.min(act.value, 50000) : 0,
              unit: typeof act.unit === 'string' ? act.unit.substring(0, 10) : 'units',
              co2e: typeof act.co2e === 'number' && !isNaN(act.co2e) && act.co2e >= 0 ? Math.min(act.co2e, 50000) : 0,
              loggedAt: typeof act.loggedAt === 'string' ? act.loggedAt : new Date().toISOString(),
            }));
          
          if (activities.length > 200) {
            activities = activities.slice(0, 200);
          }
        }

        // 3. Sanitize XP
        let xp = currentState.xp;
        if (typeof typedPersisted.xp === 'number' && !isNaN(typedPersisted.xp) && typedPersisted.xp >= 0) {
          xp = Math.min(typedPersisted.xp, 1000000);
        }

        // 4. Sanitize theme
        const theme = typedPersisted.theme === 'dark' ? 'dark' : 'light';

        // 5. Sanitize quizzesCompleted
        let quizzesCompleted = currentState.quizzesCompleted;
        if (Array.isArray(typedPersisted.quizzesCompleted)) {
          quizzesCompleted = typedPersisted.quizzesCompleted.filter((q): q is string => typeof q === 'string');
        }

        // 6. Sanitize challenges list
        let challenges = currentState.challenges;
        if (Array.isArray(typedPersisted.challenges)) {
          const rawChallenges = typedPersisted.challenges as Record<string, unknown>[];
          challenges = currentState.challenges.map((currentChallenge) => {
            const persistedChallenge = rawChallenges.find((c) => c && c.id === currentChallenge.id);
            if (persistedChallenge) {
              return {
                ...currentChallenge,
                isAccepted: !!persistedChallenge.isAccepted,
                isCompleted: !!persistedChallenge.isCompleted,
              };
            }
            return currentChallenge;
          });
        }

        // 7. Sanitize badges
        let badges = currentState.badges;
        if (Array.isArray(typedPersisted.badges)) {
          const rawBadges = typedPersisted.badges as Record<string, unknown>[];
          badges = currentState.badges.map((currentBadge) => {
            const persistedBadge = rawBadges.find((b) => b && b.id === currentBadge.id);
            if (persistedBadge) {
              return {
                ...currentBadge,
                isUnlocked: !!persistedBadge.isUnlocked,
                unlockedAt: typeof persistedBadge.unlockedAt === 'string' ? persistedBadge.unlockedAt : undefined,
              };
            }
            return currentBadge;
          });
        }

        // 8. Sanitize calculatorDraft
        let calculatorDraft = currentState.calculatorDraft;
        if (typedPersisted.calculatorDraft && typeof typedPersisted.calculatorDraft === 'object') {
          const draft = typedPersisted.calculatorDraft as Record<string, unknown>;
          calculatorDraft = {
            transportMode: ['car_petrol', 'car_diesel', 'car_ev', 'public_transit', 'bicycle', 'walking'].includes(draft.transportMode as string) 
              ? (draft.transportMode as 'car_petrol' | 'car_diesel' | 'car_ev' | 'public_transit' | 'bicycle' | 'walking') 
              : 'car_petrol',
            weeklyDistance: typeof draft.weeklyDistance === 'number' && !isNaN(draft.weeklyDistance) && draft.weeklyDistance >= 0 ? Math.min(draft.weeklyDistance, 5000) : 0,
            electricityBill: typeof draft.electricityBill === 'number' && !isNaN(draft.electricityBill) && draft.electricityBill >= 0 ? Math.min(draft.electricityBill, 10000) : 0,
            heatingFuel: ['gas', 'electric', 'oil', 'none'].includes(draft.heatingFuel as string) ? (draft.heatingFuel as 'gas' | 'electric' | 'oil' | 'none') : 'none',
            dietType: ['vegan', 'vegetarian', 'low_meat', 'high_meat'].includes(draft.dietType as string) ? (draft.dietType as 'vegan' | 'vegetarian' | 'low_meat' | 'high_meat') : 'low_meat',
            recyclePaper: !!draft.recyclePaper,
            recyclePlastic: !!draft.recyclePlastic,
            recycleGlass: !!draft.recycleGlass,
          };
        }

        return {
          ...currentState,
          user,
          activities,
          theme,
          xp,
          quizzesCompleted,
          challenges,
          badges,
          calculatorDraft,
        };
      }
    }
  )
);
