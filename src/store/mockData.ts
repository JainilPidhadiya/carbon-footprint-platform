/**
 * @file store/mockData.ts
 * @description Provides initial configuration values and mock activity log generators for local development.
 */

import type { UserProfile, EmissionActivity, Challenge, Badge, EmissionCategory } from '../types';
import { CARBON_FACTORS } from '../config/constants';

/** Default profile configurations representing a default user account. */
export const DEFAULT_USER: UserProfile = {
  id: 'user_1',
  email: 'eco.warrior@hackathon.org',
  name: 'Eco Warrior',
  monthlyTargetCo2e: 450, // kg CO2e limit per month
  createdAt: new Date().toISOString(),
  carbonScore: 7800, // kg CO2e / year baseline
};

export const DEFAULT_CHALLENGES: Challenge[] = [
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

/** Default badges showcasing system tracking metrics achievements. */
export const DEFAULT_BADGES: Badge[] = [
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

/**
 * Simulates and generates a historical list of activity logs spanning the last 7 days.
 * 
 * @returns Array of synthesized emission activities.
 */
export const generateMockActivities = (): EmissionActivity[] => {
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
