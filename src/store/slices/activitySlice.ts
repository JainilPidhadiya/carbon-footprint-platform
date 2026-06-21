/**
 * @file store/slices/activitySlice.ts
 * @description Activity state slice managing the list of user logged carbon activities.
 */

import type { StateCreator } from 'zustand';
import type { AppState } from '../index';
import type { EmissionActivity, EmissionCategory } from '../../types';
import { CARBON_FACTORS } from '../../config/constants';
import { 
  calculateTransportEmission, 
  calculateElectricityEmission, 
  calculateFoodEmission 
} from '../../services/carbon.service';
import { generateMockActivities } from '../mockData';

/**
 * Interface representing the Activity slice of the application store.
 */
export interface ActivitySlice {
  /** The collection of logged emission activities. */
  activities: EmissionActivity[];
  /** Adds a new logged activity, calculates its emissions, and updates the XP/achievements. */
  addActivity: (activity: {
    category: EmissionCategory;
    description: string;
    value: number;
    unit: string;
  }) => void;
  /** Deletes a logged activity by its unique identifier. */
  deleteActivity: (id: string) => void;
}

/**
 * Slice creator function for the Activity state section.
 */
export const createActivitySlice: StateCreator<AppState, [], [], ActivitySlice> = (set, get) => ({
  activities: generateMockActivities(),

  addActivity: (activity) => {
    let calculatedCo2e: number;
    
    if (activity.category === 'transport') {
      const mode = activity.description.toLowerCase().includes('metro') || activity.description.toLowerCase().includes('bus')
        ? 'public_transit'
        : activity.description.toLowerCase().includes('ev')
        ? 'car_ev'
        : activity.description.toLowerCase().includes('bike')
        ? 'bicycle'
        : 'car_petrol';
      calculatedCo2e = calculateTransportEmission(activity.value, mode);
    } else if (activity.category === 'energy') {
      calculatedCo2e = calculateElectricityEmission(activity.value);
    } else if (activity.category === 'food') {
      const mode = activity.description.toLowerCase().includes('vegan')
        ? 'vegan'
        : activity.description.toLowerCase().includes('veg')
        ? 'vegetarian'
        : activity.description.toLowerCase().includes('steak') || activity.description.toLowerCase().includes('beef')
        ? 'high_meat'
        : 'low_meat';
      calculatedCo2e = calculateFoodEmission(activity.value, mode);
    } else {
      // waste category
      const factor = (CARBON_FACTORS.waste.monthlyBaseline - 15) / 30;
      calculatedCo2e = Math.round(activity.value * factor * 10) / 10;
    }

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
});
