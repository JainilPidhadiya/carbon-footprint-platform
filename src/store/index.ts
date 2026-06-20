import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, EmissionActivity, EmissionCategory, Challenge, Badge, CalculatorAnswers } from '../types';
import { CARBON_FACTORS } from '../config/constants';

interface AppState {
  user: UserProfile | null;
  activities: EmissionActivity[];
  theme: 'light' | 'dark';
  xp: number;
  quizzesCompleted: string[];
  challenges: Challenge[];
  badges: Badge[];
  calculatorDraft: CalculatorAnswers | null;
  setUser: (profile: UserProfile | null) => void;
  toggleTheme: () => void;
  setBaseline: (carbonScore: number, breakdown: Record<EmissionCategory, number>) => void;
  addActivity: (activity: {
    category: EmissionCategory;
    description: string;
    value: number;
    unit: string;
  }) => void;
  deleteActivity: (id: string) => void;
  completeQuiz: (quizId: string, xpReward: number) => void;
  acceptChallenge: (id: string) => void;
  completeChallenge: (id: string) => void;
  setCalculatorDraft: (draft: CalculatorAnswers | null) => void;
  checkBadgeUnlocks: () => void;
  resetData: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'user_1',
  email: 'eco.warrior@hackathon.org',
  name: 'Eco Warrior',
  monthlyTargetCo2e: 450, // kg CO2e limit per month
  createdAt: new Date().toISOString(),
  carbonScore: 7800, // kg CO2e / year baseline
};

const DEFAULT_CHALLENGES: Challenge[] = [
  {
    id: 'c-1',
    title: 'Meatless Monday',
    category: 'food',
    description: 'Eat vegetarian or vegan meals all day today to save emissions.',
    xpReward: 30,
    co2ePotentialSaving: 8,
    isAccepted: false,
    isCompleted: false,
  },
  {
    id: 'c-2',
    title: 'Bicycle Commute',
    category: 'transport',
    description: 'Leave the car home and commute via bike or walking today.',
    xpReward: 50,
    co2ePotentialSaving: 15,
    isAccepted: false,
    isCompleted: false,
  },
  {
    id: 'c-3',
    title: 'Power Down',
    category: 'energy',
    description: 'Unplug stand-by electronics and chargers before bedtime.',
    xpReward: 20,
    co2ePotentialSaving: 3,
    isAccepted: false,
    isCompleted: false,
  },
  {
    id: 'c-4',
    title: 'Recycle Audit',
    category: 'waste',
    description: 'Rinse and sort paper, plastic, and glass waste properly.',
    xpReward: 30,
    co2ePotentialSaving: 5,
    isAccepted: false,
    isCompleted: false,
  },
];

const DEFAULT_BADGES: Badge[] = [
  {
    id: 'b-1',
    name: 'Green Rookie',
    description: 'Your environmental journey has begun.',
    iconName: 'Leaf',
    isUnlocked: false,
    unlockCriteria: 'Log your first carbon tracking entry.',
  },
  {
    id: 'b-2',
    name: 'Methane Slayer',
    description: 'Outstanding food choice consciousness.',
    iconName: 'Apple',
    isUnlocked: false,
    unlockCriteria: 'Log 3 plant-based (vegan/veg) activities.',
  },
  {
    id: 'b-3',
    name: 'Energy Miser',
    description: 'Conserving watts like a pro.',
    iconName: 'Lightbulb',
    isUnlocked: false,
    unlockCriteria: 'Log a home electricity activity under 10 kWh.',
  },
  {
    id: 'b-4',
    name: 'Climate Champion',
    description: 'Proven sustainability dedication.',
    iconName: 'Award',
    isUnlocked: false,
    unlockCriteria: 'Accumulate 300 or more Experience Points (XP).',
  },
];

const generateMockActivities = (): EmissionActivity[] => {
  const mockLogs: EmissionActivity[] = [];
  const baseDate = new Date();
  
  const descriptions: Record<EmissionCategory, { desc: string; val: number; unit: string; factor: number }[]> = {
    transport: [
      { desc: 'Commute to work (Petrol car)', val: 25, unit: 'km', factor: CARBON_FACTORS.transport.car_petrol },
      { desc: 'Metro train transit', val: 12, unit: 'km', factor: CARBON_FACTORS.transport.public_transit },
      { desc: 'Ride bike to grocer', val: 5, unit: 'km', factor: CARBON_FACTORS.transport.bicycle },
    ],
    food: [
      { desc: 'Lunch (Chicken Salad)', val: 1, unit: 'meal', factor: CARBON_FACTORS.food.low_meat },
      { desc: 'Vegan Breakfast', val: 1, unit: 'meal', factor: CARBON_FACTORS.food.vegan },
      { desc: 'Steak Dinner', val: 1, unit: 'meal', factor: CARBON_FACTORS.food.high_meat },
      { desc: 'Vegetarian Lunch', val: 1, unit: 'meal', factor: CARBON_FACTORS.food.vegetarian },
    ],
    energy: [
      { desc: 'Electricity use (daily avg)', val: 15, unit: 'kWh', factor: CARBON_FACTORS.energy.electricityKwh },
      { desc: 'Natural Gas Heating', val: 1, unit: 'day', factor: CARBON_FACTORS.energy.heating.gas / 30 },
    ],
    waste: [
      { desc: 'Standard residential trash bin', val: 1, unit: 'day', factor: (CARBON_FACTORS.waste.monthlyBaseline - 15) / 30 },
    ],
  };

  for (let i = 6; i >= 0; i--) {
    const logDate = new Date(baseDate);
    logDate.setDate(baseDate.getDate() - i);
    const dateStr = logDate.toISOString();

    if (i !== 3) {
      const option = descriptions.transport[i % descriptions.transport.length];
      mockLogs.push({
        id: `t-${i}`,
        userId: 'user_1',
        category: 'transport',
        description: option.desc,
        value: option.val,
        unit: option.unit,
        co2e: Math.round(option.val * option.factor * 10) / 10,
        loggedAt: dateStr,
      });
    }

    const foodOption = descriptions.food[i % descriptions.food.length];
    mockLogs.push({
      id: `f-${i}`,
      userId: 'user_1',
      category: 'food',
      description: foodOption.desc,
      value: foodOption.val,
      unit: foodOption.unit,
      co2e: Math.round(foodOption.val * foodOption.factor * 10) / 10,
      loggedAt: dateStr,
    });

    const energyOption = descriptions.energy[i % descriptions.energy.length];
    mockLogs.push({
      id: `e-${i}`,
      userId: 'user_1',
      category: 'energy',
      description: energyOption.desc,
      value: energyOption.val,
      unit: energyOption.unit,
      co2e: Math.round(energyOption.val * energyOption.factor * 10) / 10,
      loggedAt: dateStr,
    });
  }

  return mockLogs;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: DEFAULT_USER,
      activities: generateMockActivities(),
      theme: 'light',
      xp: 150,
      quizzesCompleted: [],
      challenges: DEFAULT_CHALLENGES,
      badges: DEFAULT_BADGES,
      calculatorDraft: null,

      setUser: (profile) => set({ user: profile }),

      toggleTheme: () => set((state) => {
        const nextTheme = state.theme === 'light' ? 'dark' : 'light';
        const bodyClass = document.body.classList;
        if (nextTheme === 'dark') {
          bodyClass.add('dark');
        } else {
          bodyClass.remove('dark');
        }
        return { theme: nextTheme };
      }),

      setBaseline: (carbonScore, _breakdown) => set((state) => {
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

      addActivity: (activity) => {
        let factor = 0;
        if (activity.category === 'transport') {
          const mode = activity.description.toLowerCase().includes('metro') || activity.description.toLowerCase().includes('bus')
            ? 'public_transit'
            : activity.description.toLowerCase().includes('ev')
            ? 'car_ev'
            : activity.description.toLowerCase().includes('bike')
            ? 'bicycle'
            : 'car_petrol';
          factor = CARBON_FACTORS.transport[mode];
        } else if (activity.category === 'energy') {
          factor = CARBON_FACTORS.energy.electricityKwh;
        } else if (activity.category === 'food') {
          const mode = activity.description.toLowerCase().includes('vegan')
            ? 'vegan'
            : activity.description.toLowerCase().includes('veg')
            ? 'vegetarian'
            : activity.description.toLowerCase().includes('steak') || activity.description.toLowerCase().includes('beef')
            ? 'high_meat'
            : 'low_meat';
          factor = CARBON_FACTORS.food[mode];
        } else {
          factor = (CARBON_FACTORS.waste.monthlyBaseline - 15) / 30;
        }

        const calculatedCo2e = Math.round(activity.value * factor * 10) / 10;

        const newActivity: EmissionActivity = {
          id: `${activity.category}-${Date.now()}`,
          userId: get().user?.id || 'guest',
          category: activity.category,
          description: activity.description,
          value: activity.value,
          unit: activity.unit,
          co2e: calculatedCo2e,
          loggedAt: new Date().toISOString(),
        };

        set((state) => {
          const nextActivities = [newActivity, ...state.activities];
          if (nextActivities.length > 200) {
            nextActivities.length = 200;
          }
          return {
            activities: nextActivities,
            xp: state.xp + 10, // Gain 10 XP per tracking log!
          };
        });

        get().checkBadgeUnlocks();
      },

      deleteActivity: (id) => {
        set((state) => ({
          activities: state.activities.filter((act) => act.id !== id),
        }));
        get().checkBadgeUnlocks();
      },

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
        const { activities, xp } = state;
        const nextBadges = state.badges.map((badge) => {
          if (badge.isUnlocked) return badge;
          
          let unlock = false;
          if (badge.id === 'b-1' && activities.length >= 1) unlock = true;
          if (badge.id === 'b-2') {
            const plantMealsCount = activities.filter(
              (act) => act.category === 'food' && 
              (act.description.toLowerCase().includes('vegan') || act.description.toLowerCase().includes('vegetarian'))
            ).length;
            if (plantMealsCount >= 3) unlock = true;
          }
          if (badge.id === 'b-3') {
            const lowElectricityCount = activities.filter(
              (act) => act.category === 'energy' && act.value < 10
            ).length;
            if (lowElectricityCount >= 1) unlock = true;
          }
          if (badge.id === 'b-4' && xp >= 300) unlock = true;
          
          return unlock ? { ...badge, isUnlocked: true } : badge;
        });

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

      setCalculatorDraft: (draft) => set({ calculatorDraft: draft }),

      resetData: () => set({
        activities: [],
        xp: 0,
        quizzesCompleted: [],
        challenges: DEFAULT_CHALLENGES,
        badges: DEFAULT_BADGES,
        calculatorDraft: null,
      }),
    }),
    {
      name: 'ecotrack-store',
      merge: (persistedState, currentState) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return currentState;
        }

        const typedPersisted = persistedState as Partial<AppState>;

        // 1. Sanitize user profile
        let user = currentState.user;
        if (typedPersisted.user && typeof typedPersisted.user === 'object') {
          const pUser = typedPersisted.user as any;
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
          activities = typedPersisted.activities
            .filter((act: any) => act && typeof act === 'object' && typeof act.id === 'string')
            .map((act: any) => ({
              id: act.id,
              userId: typeof act.userId === 'string' ? act.userId : (user?.id || 'guest'),
              category: ['transport', 'energy', 'food', 'waste'].includes(act.category) ? act.category : 'food',
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
          quizzesCompleted = typedPersisted.quizzesCompleted.filter((q: any) => typeof q === 'string');
        }

        // 6. Sanitize challenges list
        let challenges = currentState.challenges;
        if (Array.isArray(typedPersisted.challenges)) {
          challenges = currentState.challenges.map((currentChallenge) => {
            const persistedChallenge = typedPersisted.challenges?.find((c: any) => c && c.id === currentChallenge.id);
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
          badges = currentState.badges.map((currentBadge) => {
            const persistedBadge = typedPersisted.badges?.find((b: any) => b && b.id === currentBadge.id);
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
          const draft = typedPersisted.calculatorDraft as any;
          calculatorDraft = {
            transportMode: ['car_petrol', 'car_diesel', 'car_ev', 'public_transit', 'bicycle', 'walking'].includes(draft.transportMode) ? draft.transportMode : 'car_petrol',
            weeklyDistance: typeof draft.weeklyDistance === 'number' && !isNaN(draft.weeklyDistance) && draft.weeklyDistance >= 0 ? Math.min(draft.weeklyDistance, 5000) : 0,
            electricityBill: typeof draft.electricityBill === 'number' && !isNaN(draft.electricityBill) && draft.electricityBill >= 0 ? Math.min(draft.electricityBill, 10000) : 0,
            heatingFuel: ['gas', 'electric', 'oil', 'none'].includes(draft.heatingFuel) ? draft.heatingFuel : 'none',
            dietType: ['vegan', 'vegetarian', 'low_meat', 'high_meat'].includes(draft.dietType) ? draft.dietType : 'low_meat',
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
