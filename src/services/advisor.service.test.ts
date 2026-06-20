import { describe, it, expect } from 'vitest';
import { generateRecommendations } from './advisor.service';
import type { CarbonActivity } from '../types';

describe('Advisor Service', () => {
  const mockActivity = (category: 'transport' | 'energy' | 'food' | 'waste', co2e: number): CarbonActivity => ({
    id: `act-${category}-${co2e}`,
    userId: 'user-123',
    category,
    description: `Test ${category} activity`,
    value: 10,
    unit: 'any',
    co2e,
    loggedAt: new Date().toISOString(),
  });

  it('identifies transport as the top emission category and returns appropriate advice', () => {
    const activities: readonly CarbonActivity[] = [
      mockActivity('transport', 100),
      mockActivity('energy', 40),
      mockActivity('food', 20),
      mockActivity('waste', 10),
    ];
    
    const report = generateRecommendations(activities, 300);

    expect(report.topCategory).toBe('transport');
    expect(report.topCategoryPercentage).toBe(Math.round((100 / 170) * 100)); // ~59%
    expect(report.quickWin).toContain('short commute');
    expect(report.quickWin).toContain('cycling or walking');
    expect(report.longTermImprovement).toContain('electric vehicle');
    expect(report.weeklyPlan).toHaveLength(7);
    expect(report.weeklyPlan[0]).toContain('Take public transit');
    // reductionRatio for transport is 0.25. 170 * 0.25 = 42.5
    expect(report.estimatedSavingsKg).toBe(42.5);
  });

  it('identifies energy as the top emission category and returns appropriate advice', () => {
    const activities: readonly CarbonActivity[] = [
      mockActivity('transport', 20),
      mockActivity('energy', 150),
      mockActivity('food', 10),
    ];
    
    const report = generateRecommendations(activities, 200);

    expect(report.topCategory).toBe('energy');
    expect(report.topCategoryPercentage).toBe(Math.round((150 / 180) * 100)); // ~83%
    expect(report.quickWin).toContain('thermostat');
    expect(report.longTermImprovement).toContain('heat pump');
    expect(report.weeklyPlan[0]).toContain('lights');
    // reductionRatio for energy is 0.20. 180 * 0.2 = 36.0
    expect(report.estimatedSavingsKg).toBe(36.0);
  });

  it('identifies food as the top emission category and returns appropriate advice', () => {
    const activities: readonly CarbonActivity[] = [
      mockActivity('food', 80),
      mockActivity('waste', 30),
    ];
    
    const report = generateRecommendations(activities, 200);

    expect(report.topCategory).toBe('food');
    expect(report.topCategoryPercentage).toBe(Math.round((80 / 110) * 100)); // ~73%
    expect(report.quickWin).toContain('red meat meals');
    expect(report.longTermImprovement).toContain('plant-based diet');
    expect(report.weeklyPlan[0]).toContain('(vegan) breakfast');
    // reductionRatio for food is 0.30. 110 * 0.3 = 33.0
    expect(report.estimatedSavingsKg).toBe(33.0);
  });

  it('identifies waste as the top emission category and returns appropriate advice', () => {
    const activities: readonly CarbonActivity[] = [
      mockActivity('waste', 60),
      mockActivity('energy', 30),
    ];
    
    const report = generateRecommendations(activities, 200);

    expect(report.topCategory).toBe('waste');
    expect(report.topCategoryPercentage).toBe(Math.round((60 / 90) * 100)); // ~67%
    expect(report.quickWin).toContain('plastic and glass');
    expect(report.longTermImprovement).toContain('Composting');
    expect(report.weeklyPlan[0]).toContain('cardboard boxes');
    // reductionRatio for waste is 0.15. 90 * 0.15 = 13.5
    expect(report.estimatedSavingsKg).toBe(13.5);
  });

  it('handles empty activities array cleanly by falling back to defaults', () => {
    const report = generateRecommendations([], 400);

    expect(report.topCategory).toBe('food'); // default fallback
    expect(report.topCategoryPercentage).toBe(25);
    expect(report.quickWin).toContain('red meat meals');
    // reductionRatio for food is 0.30. Base emission falls back to target (400). 400 * 0.30 = 120
    expect(report.estimatedSavingsKg).toBe(120);
  });

  it('handles invalid target emission cleanly', () => {
    const report = generateRecommendations([], -100);

    expect(report.topCategory).toBe('food');
    // negative target emission falls back to 450. 450 * 0.30 = 135
    expect(report.estimatedSavingsKg).toBe(135);
  });

  it('ignores invalid activities with negative or non-numeric co2e values', () => {
    const activities: readonly CarbonActivity[] = [
      mockActivity('transport', 100),
      mockActivity('energy', -50),
      mockActivity('food', NaN),
    ];

    const report = generateRecommendations(activities, 200);

    expect(report.topCategory).toBe('transport');
    expect(report.topCategoryPercentage).toBe(100);
    // reductionRatio for transport is 0.25. 100 * 0.25 = 25
    expect(report.estimatedSavingsKg).toBe(25);
  });
});
