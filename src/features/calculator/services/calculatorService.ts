import { CARBON_FACTORS } from '../../../config/constants';
import type { CalculatorAnswers } from '../../../types';

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
