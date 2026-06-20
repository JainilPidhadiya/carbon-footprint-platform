import { describe, it, expect } from 'vitest';
import { calculateBaseline } from './calculatorService';
import type { CalculatorAnswers } from '../../../types';

describe('calculateBaseline', () => {
  it('should calculate correct carbon values for a vegan diet and low transport footprint', () => {
    const answers: CalculatorAnswers = {
      transportMode: 'bicycle',
      weeklyDistance: 10,
      electricityBill: 0,
      heatingFuel: 'none',
      dietType: 'vegan',
      recyclePaper: true,
      recyclePlastic: true,
      recycleGlass: true,
    };

    const results = calculateBaseline(answers);

    // Transport emissions for bicycle should be 0
    expect(results.breakdown.transport).toBe(0);

    // Energy emissions (0 usage + none heating) should be 0
    expect(results.breakdown.energy).toBe(0);

    // Food emissions: 0.5 kg CO2e * 3 meals * 365 days = 547.5 (~548)
    expect(results.breakdown.food).toBe(548);

    // Waste emissions: baseline 120 + offsets (-10 -15 -8 = -33) = 87 monthly * 12 = 1044 kg/year
    expect(results.breakdown.waste).toBe(1044);

    expect(results.total).toBe(548 + 1044);
  });

  it('should calculate higher values for petrol car transit and high-meat diets', () => {
    const answers: CalculatorAnswers = {
      transportMode: 'car_petrol',
      weeklyDistance: 100, // 100 km / week
      electricityBill: 200, // 200 kWh / month
      heatingFuel: 'gas',
      dietType: 'high_meat',
      recyclePaper: false,
      recyclePlastic: false,
      recycleGlass: false,
    };

    const results = calculateBaseline(answers);

    // Transport: 100 * 52 * 0.17 = 884
    expect(results.breakdown.transport).toBe(884);

    // Energy: (200 * 12 * 0.38) + (180 * 12) = 912 + 2160 = 3072
    expect(results.breakdown.energy).toBe(3072);

    // Food: 3.0 * 3 * 365 = 3285
    expect(results.breakdown.food).toBe(3285);

    // Waste: 120 monthly baseline (no offsets) * 12 = 1440
    expect(results.breakdown.waste).toBe(1440);

    expect(results.total).toBe(884 + 3072 + 3285 + 1440);
  });
});
