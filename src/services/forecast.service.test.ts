import { describe, it, expect } from 'vitest';
import { generateForecast } from './forecast.service';
import type { CarbonActivity } from '../types';

describe('Forecast Service', () => {
  const mockActivity = (co2e: number, dateStr: string): CarbonActivity => ({
    id: `act-${co2e}-${dateStr}`,
    userId: 'user-123',
    category: 'energy',
    description: 'Mock',
    value: 10,
    unit: 'kWh',
    co2e,
    loggedAt: `${dateStr}T12:00:00.000Z`,
  });

  it('generates a 30-day forecast with default values if activities list is empty', () => {
    const report = generateForecast([], 300, 50);

    expect(report.dataPoints).toHaveLength(30);
    expect(report.dataPoints[0].day).toBe(1);
    expect(report.dataPoints[29].day).toBe(30);

    // Target daily is 300 / 30 = 10 kg
    expect(report.dataPoints[0].targetLine).toBe(10);
    expect(report.totalProjected30Days).toBeGreaterThan(0);
    expect(report.percentChange).toBeLessThan(0); // 50% challenge completion should lead to a reduction
    expect(report.changeDirection).toBe('decreasing');
  });

  it('calculates average daily baseline correctly from activities and applies challenge completion', () => {
    // 3 activities across 3 unique days, total co2e = 90. Avg daily = 30 kg.
    const activities: readonly CarbonActivity[] = [
      mockActivity(30, '2026-06-01'),
      mockActivity(40, '2026-06-02'),
      mockActivity(20, '2026-06-03'),
    ];

    // target is 600. totalCo2e is 90. goalRatio = 90 / 600 = 0.15.
    // challenge completion is 100% (1.0). Challenge reduction = 0.20.
    // goalProgressOffset = (1 - 0.15) * 0.15 = 0.85 * 0.15 = 0.1275.
    // multiplier = 1 - 0.20 - 0.1275 = 0.6725.
    // targetDailyAverage = 30 * 0.6725 = 20.175.
    // percentChange = ((20.175 - 30) / 30) * 100 = -32.75% (approx -32.8%)
    const report = generateForecast(activities, 600, 100);
    expect(report.percentChange).toBe(-32.7);
    expect(report.changeDirection).toBe('decreasing');
    expect(report.dataPoints).toHaveLength(30);

    // Check that values are numbers and fluctuate due to cyclical variance
    const emissions = report.dataPoints.map(dp => dp.projectedEmission);
    const uniqueEmissions = new Set(emissions);
    expect(uniqueEmissions.size).toBeGreaterThan(1); // Should fluctuate and not be flat
  });

  it('projects an increasing trend if the user is significantly over budget', () => {
    // Avg daily is 40 kg. Total 120. Target is 90.
    // goalRatio = 120 / 90 = 1.333.
    // challenge completion = 0.
    // goalProgressOffset = (1.0 - 1.333) * 0.15 = -0.05.
    // multiplier = 1.0 - 0 - (-0.05) = 1.05.
    // targetDailyAverage = 40 * 1.05 = 42.
    // percentChange = 5%
    const activities: readonly CarbonActivity[] = [
      mockActivity(40, '2026-06-01'),
      mockActivity(40, '2026-06-02'),
      mockActivity(40, '2026-06-03'),
    ];

    const report = generateForecast(activities, 90, 0);

    expect(report.percentChange).toBeCloseTo(5.0, 1);
    expect(report.changeDirection).toBe('increasing');
  });

  it('handles negative or invalid parameter bounds safely', () => {
    const report = generateForecast([], -100, -50);

    expect(report.dataPoints).toHaveLength(30);
    // target falls back to 450. targetLine = 15.
    expect(report.dataPoints[0].targetLine).toBe(15);
    // challenge completion clamped to 0. goal progress offset is 0.15 (0 emissions under 450 target). multiplier = 0.85.
    // percentChange = -15%
    expect(report.percentChange).toBe(-15);
    expect(report.changeDirection).toBe('decreasing');
  });
});
