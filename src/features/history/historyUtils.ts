/**
 * @file features/history/historyUtils.ts
 * @description Helper functions for aggregating and formatting tracking logs for charts and visual logs.
 */

import type { EmissionActivity } from '../../types';
import { sumActivitiesCo2e } from '../../utils/activityUtils';

/**
 * Formats an ISO date string into a user-friendly relative date ('Today', 'Yesterday')
 * or a fully localized date string.
 * 
 * @param isoString The ISO 8601 representation of the activity date.
 * @returns Formatted friendly date label.
 */
export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
};

/**
 * Aggregates daily carbon emissions totals for each of the last 7 calendar days.
 * Used to populate the activity history trend chart.
 * 
 * @param activities The list of logged emission activities.
 * @returns Array of chart data points mapping date labels to emission numbers.
 */
export const getLast7DaysData = (activities: readonly EmissionActivity[]) => {
  const data = [];
  const baseDate = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() - i);
    const dateString = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const dayStart = new Date(d.setHours(0, 0, 0, 0));
    const dayEnd = new Date(d.setHours(23, 59, 59, 999));

    const daySum = sumActivitiesCo2e(
      activities.filter((act) => {
        const actDate = new Date(act.loggedAt);
        return actDate >= dayStart && actDate <= dayEnd;
      })
    );

    data.push({
      date: dateString,
      emissions: Math.round(daySum * 10) / 10,
    });
  }
  return data;
};
