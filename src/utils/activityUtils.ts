/**
 * @file utils/activityUtils.ts
 * @description Helper functions for filtering, grouping, and calculating aggregates on arrays of user logged activities.
 */

import type { EmissionActivity, EmissionCategory } from '../types';

/**
 * Filters a list of activities to return only those logged in the same calendar month and year as the reference date.
 * 
 * @param activities The input array of activities.
 * @param referenceDate The target date to match the calendar month and year (defaults to today).
 * @returns Filtered array of activities.
 */
export const filterActivitiesByMonth = (
  activities: readonly EmissionActivity[],
  referenceDate: Date = new Date()
): EmissionActivity[] => {
  return activities.filter((act) => {
    if (!act || typeof act.loggedAt !== 'string') return false;
    const actDate = new Date(act.loggedAt);
    return (
      actDate.getMonth() === referenceDate.getMonth() &&
      actDate.getFullYear() === referenceDate.getFullYear()
    );
  });
};

/**
 * Calculates the aggregate sum of CO2 emissions across a list of activities.
 * 
 * @param activities The input array of objects containing co2e values.
 * @returns Total sum of CO2 emissions.
 */
export const sumActivitiesCo2e = (activities: readonly { readonly co2e: number }[]): number => {
  return activities.reduce((sum, curr) => {
    if (curr && typeof curr.co2e === 'number' && !isNaN(curr.co2e) && curr.co2e > 0) {
      return sum + curr.co2e;
    }
    return sum;
  }, 0);
};

/**
 * Sums and groups emissions by their respective categories.
 * 
 * @param activities The collection of logged emission activities.
 * @returns A mapping of each EmissionCategory to its total co2e emissions.
 */
export const getEmissionsByCategory = (
  activities: readonly EmissionActivity[]
): Record<EmissionCategory, number> => {
  return activities.reduce<Record<EmissionCategory, number>>(
    (acc, curr) => {
      if (curr && curr.category && typeof curr.co2e === 'number' && !isNaN(curr.co2e)) {
        acc[curr.category] += curr.co2e;
      }
      return acc;
    },
    { transport: 0, energy: 0, food: 0, waste: 0 }
  );
};
