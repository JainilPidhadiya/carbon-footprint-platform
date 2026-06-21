/**
 * Carbon Emission Calculation Service
 * Fully typed, pure functions handling edge cases and boundary inputs.
 */

import { CARBON_FACTORS } from '../config/constants';
import type { CalculatorAnswers, TransportMode, DietType } from '../types';
import { roundTo } from '../utils/mathUtils';

/**
 * Calculates carbon emissions from transportation.
 * 
 * @param distanceKm The distance travelled in kilometers. Must be non-negative.
 * @param mode The transport mode (e.g., 'car_petrol', 'car_diesel', 'car_ev', 'public_transit').
 * @returns Calculated emissions in kg CO2e. Returns 0 for invalid inputs.
 */
export function calculateTransportEmission(distanceKm: number, mode: TransportMode | string): number {
  if (typeof distanceKm !== 'number' || isNaN(distanceKm) || distanceKm < 0) {
    return 0;
  }

  const factor = CARBON_FACTORS.transport[mode as TransportMode];
  if (typeof factor !== 'number') {
    return 0;
  }

  return roundTo(distanceKm * factor, 2);
}

/**
 * Calculates carbon emissions from electricity consumption.
 * 
 * @param kwh Electricity consumed in kilowatt-hours. Must be non-negative.
 * @returns Calculated emissions in kg CO2e. Returns 0 for invalid inputs.
 */
export function calculateElectricityEmission(kwh: number): number {
  if (typeof kwh !== 'number' || isNaN(kwh) || kwh < 0) {
    return 0;
  }

  const factor = CARBON_FACTORS.energy.electricityKwh;
  return roundTo(kwh * factor, 2);
}

/**
 * Calculates carbon emissions from dietary patterns.
 * 
 * @param mealsCount Number of meals eaten. Must be non-negative.
 * @param dietType Diet type classification (e.g., 'vegan', 'vegetarian', 'low_meat', 'high_meat').
 * @returns Calculated emissions in kg CO2e. Returns 0 for invalid inputs.
 */
export function calculateFoodEmission(mealsCount: number, dietType: DietType | string): number {
  if (typeof mealsCount !== 'number' || isNaN(mealsCount) || mealsCount < 0) {
    return 0;
  }

  const factor = CARBON_FACTORS.food[dietType as DietType];
  if (typeof factor !== 'number') {
    return 0;
  }

  return roundTo(mealsCount * factor, 2);
}

/**
 * Combines category emissions into a single aggregate total footprint.
 * 
 * @param metrics Object containing optional footprint categories values.
 * @returns Cumulative footprint total in kg CO2e. Handles missing categories or negative outputs safely.
 */
export function calculateTotalEmission(metrics: {
  transport?: number;
  electricity?: number;
  food?: number;
  waste?: number;
}): number {
  let total = 0;

  const addMetric = (val?: number) => {
    if (typeof val === 'number' && !isNaN(val) && val > 0) {
      total += val;
    }
  };

  addMetric(metrics.transport);
  addMetric(metrics.electricity);
  addMetric(metrics.food);
  addMetric(metrics.waste);

  return roundTo(total, 2);
}

/**
 * Calculates user baseline emissions and breakdown per category (annual values).
 * 
 * @param answers The baseline wizard questionnaire answers.
 * @returns Computed baseline summary.
 */
export function calculateBaseline(answers: CalculatorAnswers) {
  // 1. Transport (Annual)
  const transportFactor = CARBON_FACTORS.transport[answers.transportMode] || 0;
  const transportYearly = answers.weeklyDistance * 52 * transportFactor;

  // 2. Energy (Annual)
  const electricityYearly = answers.electricityBill * 12 * CARBON_FACTORS.energy.electricityKwh;
  const heatingFactor = CARBON_FACTORS.energy.heating[answers.heatingFuel] || 0;
  const heatingYearly = heatingFactor * 12;
  const energyYearly = electricityYearly + heatingYearly;

  // 3. Food (Annual)
  const foodMealFactor = CARBON_FACTORS.food[answers.dietType] || 1.5;
  const foodYearly = foodMealFactor * 3 * 365; // 3 meals/day, 365 days

  // 4. Waste (Annual)
  const wasteBaseline = CARBON_FACTORS.waste.monthlyBaseline;
  const paperOffset = answers.recyclePaper ? CARBON_FACTORS.waste.recyclingOffsets.recyclePaper : 0;
  const plasticOffset = answers.recyclePlastic ? CARBON_FACTORS.waste.recyclingOffsets.recyclePlastic : 0;
  const glassOffset = answers.recycleGlass ? CARBON_FACTORS.waste.recyclingOffsets.recycleGlass : 0;
  
  const wasteMonthly = wasteBaseline + paperOffset + plasticOffset + glassOffset;
  const wasteYearly = wasteMonthly * 12;

  const totalYearly = transportYearly + energyYearly + foodYearly + wasteYearly;

  return {
    total: Math.round(totalYearly),
    breakdown: {
      transport: Math.round(transportYearly),
      energy: Math.round(energyYearly),
      food: Math.round(foodYearly),
      waste: Math.round(wasteYearly),
    },
  };
}

