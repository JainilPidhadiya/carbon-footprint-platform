/**
 * Carbon Emission Forecasting Service
 * Algorithmic 30-day future emission trends modeling.
 */

import type { CarbonActivity, ForecastDataPoint, ForecastReport } from '../types';

/**
 * Generates a 30-day projection of daily carbon emissions.
 *
 * @param activities Logged activities to establish baseline daily average.
 * @param monthlyTarget User's monthly goal budget (in kg CO2e).
 * @param challengeCompletionPct User's challenge completion rate (0-1 or 0-100).
 * @returns A structured ForecastReport containing 30 data points and aggregated statistics.
 */
export function generateForecast(
  activities: readonly CarbonActivity[],
  monthlyTarget: number,
  challengeCompletionPct: number
): ForecastReport {
  const safeTarget = typeof monthlyTarget === 'number' && monthlyTarget > 0 ? monthlyTarget : 450;
  const targetDailyLine = Math.round((safeTarget / 30) * 10) / 10;

  // 1. Calculate baseline daily average from activities
  let totalCo2e = 0;
  const uniqueDays = new Set<string>();

  if (Array.isArray(activities)) {
    activities.forEach((act) => {
      if (typeof act.co2e === 'number' && !isNaN(act.co2e) && act.co2e > 0) {
        totalCo2e += act.co2e;
        if (act.loggedAt) {
          const dateStr = act.loggedAt.split('T')[0];
          uniqueDays.add(dateStr);
        }
      }
    });
  }

  const daysCount = uniqueDays.size;
  const currentDailyAverage = daysCount > 0 ? totalCo2e / daysCount : targetDailyLine;

  // 2. Normalize and compute multipliers
  const pct = typeof challengeCompletionPct === 'number' && !isNaN(challengeCompletionPct) 
    ? challengeCompletionPct 
    : 0;
  const challengePct = pct > 1 ? pct / 100 : pct;
  const challengeReduction = Math.min(Math.max(challengePct, 0), 1) * 0.20; // max 20% saving

  const goalRatio = safeTarget > 0 ? totalCo2e / safeTarget : 1.0;
  // If user is well under budget (goalRatio < 1), we offset positively (reduces emissions).
  // If user is over budget (goalRatio > 1), we offset negatively (increases emissions).
  const goalProgressOffset = Math.max(-0.3, Math.min(0.3, (1.0 - goalRatio) * 0.15));

  const multiplier = Math.max(0.1, Math.min(2.0, 1.0 - challengeReduction - goalProgressOffset));
  const targetDailyAverage = currentDailyAverage * multiplier;

  // 3. Generate 30 data points starting from today
  const dataPoints: ForecastDataPoint[] = [];
  const baseDate = new Date();
  let accumulatedProjected = 0;

  for (let t = 1; t <= 30; t++) {
    // Linear trend from current average to the projected target average
    const progress = t / 30;
    const baseVal = currentDailyAverage + progress * (targetDailyAverage - currentDailyAverage);

    // 7-day cyclical variance to simulate real activity patterns (sine wave)
    const variance = Math.sin((t * 2 * Math.PI) / 7) * (currentDailyAverage * 0.08);

    const projectedEmission = Math.max(0.1, Math.round((baseVal + variance) * 10) / 10);
    accumulatedProjected += projectedEmission;

    const pointDate = new Date(baseDate);
    pointDate.setDate(baseDate.getDate() + t);

    dataPoints.push({
      day: t,
      date: pointDate.toISOString().split('T')[0],
      projectedEmission,
      targetLine: targetDailyLine,
    });
  }

  const totalProjected30Days = Math.round(accumulatedProjected * 10) / 10;
  const rawPercentChange = currentDailyAverage > 0
    ? ((targetDailyAverage - currentDailyAverage) / currentDailyAverage) * 100
    : 0;
  const percentChange = Math.round(rawPercentChange * 10) / 10;

  let changeDirection: 'decreasing' | 'stable' | 'increasing' = 'stable';
  if (percentChange < -1.5) {
    changeDirection = 'decreasing';
  } else if (percentChange > 1.5) {
    changeDirection = 'increasing';
  }

  return {
    dataPoints,
    totalProjected30Days,
    changeDirection,
    percentChange,
  };
}
