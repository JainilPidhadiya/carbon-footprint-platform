/**
 * Carbon Emission Calculation Service
 * Fully typed, pure functions handling edge cases and boundary inputs.
 */

import { CARBON_FACTORS } from '../config/constants';

/**
 * Calculates carbon emissions from transportation.
 * 
 * @param distanceKm The distance travelled in kilometers. Must be non-negative.
 * @param mode The transport mode (e.g., 'car_petrol', 'car_diesel', 'car_ev', 'public_transit').
 * @returns Calculated emissions in kg CO2e. Returns 0 for invalid inputs.
 */
export function calculateTransportEmission(distanceKm: number, mode: string): number {
  if (typeof distanceKm !== 'number' || isNaN(distanceKm) || distanceKm < 0) {
    return 0;
  }

  const factor = CARBON_FACTORS.transport[mode as keyof typeof CARBON_FACTORS.transport];
  if (typeof factor !== 'number') {
    return 0;
  }

  return Math.round(distanceKm * factor * 100) / 100;
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
  return Math.round(kwh * factor * 100) / 100;
}

/**
 * Calculates carbon emissions from dietary patterns.
 * 
 * @param mealsCount Number of meals eaten. Must be non-negative.
 * @param dietType Diet type classification (e.g., 'vegan', 'vegetarian', 'low_meat', 'high_meat').
 * @returns Calculated emissions in kg CO2e. Returns 0 for invalid inputs.
 */
export function calculateFoodEmission(mealsCount: number, dietType: string): number {
  if (typeof mealsCount !== 'number' || isNaN(mealsCount) || mealsCount < 0) {
    return 0;
  }

  const factor = CARBON_FACTORS.food[dietType as keyof typeof CARBON_FACTORS.food];
  if (typeof factor !== 'number') {
    return 0;
  }

  return Math.round(mealsCount * factor * 100) / 100;
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

  return Math.round(total * 100) / 100;
}
