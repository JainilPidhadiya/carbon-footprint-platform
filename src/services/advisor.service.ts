/**
 * AI Sustainability Advisor Service
 * Pure functions generating structured sustainability recommendations without hardcoding.
 */

import type { CarbonActivity, CarbonCategory } from '../types';

export interface AdvisorReport {
  readonly topCategory: CarbonCategory;
  readonly topCategoryPercentage: number;
  readonly quickWin: string;
  readonly longTermImprovement: string;
  readonly weeklyPlan: readonly string[]; // 7 elements, one for each day
  readonly estimatedSavingsKg: number; // estimated monthly saving in kg
}

interface RecommendationTemplate {
  readonly category: CarbonCategory;
  readonly title: string;
  readonly renderQuickWin: (contextValue: number) => string;
  readonly renderLongTerm: (contextValue: number) => string;
  readonly dailyActions: readonly string[];
  readonly reductionRatio: number; // expected saving ratio
}

const TEMPLATES: Record<CarbonCategory, RecommendationTemplate> = {
  transport: {
    category: 'transport',
    title: 'Transportation',
    renderQuickWin: (km) => `Swap your next short commute under ${km} km for cycling or walking transit.`,
    renderLongTerm: (pct) => `Transitioning your primary vehicle to an electric vehicle (EV) can cut transit emissions by up to ${pct}%.`,
    dailyActions: [
      'Take public transit (metro/bus) for your main commutes today.',
      'Combine multiple shopping runs into a single round trip.',
      'Check vehicle tire pressure to optimize fuel mileage.',
      'Walk or ride a bike for small local trips under 3 kilometers.',
      'Work from home today if remote work arrangements are available.',
      'Carpool with a colleague for your next drive.',
      'Turn on eco-mode in your vehicle dashboard configuration.'
    ],
    reductionRatio: 0.25,
  },
  energy: {
    category: 'energy',
    title: 'Home Energy',
    renderQuickWin: (temp) => `Lower your home heating thermostat by ${temp}°C to reduce power.`,
    renderLongTerm: (pct) => `Install a heat pump system to reduce space heating footprints by up to ${pct}%.`,
    dailyActions: [
      'Turn off all lights in rooms that are not in active use.',
      'Wash laundry loads with cold water (30°C) instead of hot.',
      'Unplug standby appliances and device chargers before bed.',
      'Lower your boiler flow temperature setting to 55°C.',
      'Air-dry clothes on a rack instead of running the dryer.',
      'Turn down the thermostat or air conditioner by 1 degree.',
      'Cook multiple portions together to save oven/stoves power.'
    ],
    reductionRatio: 0.20,
  },
  food: {
    category: 'food',
    title: 'Diet & Nutrition',
    renderQuickWin: (meals) => `Replace ${meals} red meat meals this week with vegan or vegetarian alternatives.`,
    renderLongTerm: (pct) => `Transitioning to a plant-based diet can cut food emissions by up to ${pct}%.`,
    dailyActions: [
      'Eat a fully plant-based (vegan) breakfast today.',
      'Choose beans or lentils instead of beef for your protein.',
      'Cook a vegetarian soup/curry for family dinner.',
      'Save leftovers to minimize kitchen food waste.',
      'Skip dairy products today; choose oat/soy milk instead.',
      'Pack a zero-waste lunchbox using reusable wrappers.',
      'Buy locally-sourced seasonal ingredients.'
    ],
    reductionRatio: 0.30,
  },
  waste: {
    category: 'waste',
    title: 'Waste & Recycling',
    renderQuickWin: (items) => `Rinse and sort ${items} plastic and glass containers properly before recycling.`,
    renderLongTerm: (pct) => `Composting organic waste can reduce household garbage output by up to ${pct}%.`,
    dailyActions: [
      'Rinse and sort cardboard boxes into recycling.',
      'Start a home compost bin for fruit and vegetable peels.',
      'Rinse and sort glass and metal containers carefully.',
      'Choose loose vegetables instead of pre-packaged options.',
      'Bring a reusable canvas bag to your grocery run.',
      'Decline single-use plastic cups/cutlery for takeout.',
      'Reuse jars or bottles for kitchen storage.'
    ],
    reductionRatio: 0.15,
  }
};

/**
 * Evaluates logged user activities to generate a structured AI Advisor report.
 * 
 * @param activities List of logged activities.
 * @param targetEmission Monthly target budget in kg.
 * @returns A structured AdvisorReport with dynamic recommendations.
 */
export function generateRecommendations(
  activities: readonly CarbonActivity[],
  targetEmission: number
): AdvisorReport {
  const safeTarget = typeof targetEmission === 'number' && targetEmission > 0 ? targetEmission : 450;
  
  // 1. Group emissions by category
  const categorySums: Record<CarbonCategory, number> = { transport: 0, energy: 0, food: 0, waste: 0 };
  let totalEmissions = 0;

  if (activities) {
    for (const act of activities) {
      if (act && typeof act.co2e === 'number' && !isNaN(act.co2e) && act.co2e > 0) {
        categorySums[act.category] = (categorySums[act.category] || 0) + act.co2e;
        totalEmissions += act.co2e;
      }
    }
  }

  // 2. Identify dominant category
  let topCategory: CarbonCategory = 'food'; // default fallback
  let maxEmission = 0;

  for (const [cat, val] of Object.entries(categorySums)) {
    if (val > maxEmission) {
      maxEmission = val;
      topCategory = cat as CarbonCategory;
    }
  }

  const topCategoryPercentage = totalEmissions > 0 
    ? Math.round((maxEmission / totalEmissions) * 100) 
    : 25; // standard default percentage if no logs

  // 3. Grab corresponding template
  const template = TEMPLATES[topCategory];

  // 4. Construct recommendations dynamically
  const quickWinVal = topCategory === 'transport' ? 5 : topCategory === 'food' ? 3 : 2;
  const longTermVal = topCategory === 'transport' ? 60 : topCategory === 'energy' ? 50 : 35;
  
  const quickWin = template.renderQuickWin(quickWinVal);
  const longTermImprovement = template.renderLongTerm(longTermVal);
  const weeklyPlan = template.dailyActions;

  // 5. Estimate potential reductions (monthly)
  // If user has no emissions, estimate base savings off target budget
  const baseEmissionsForSavings = totalEmissions > 0 ? totalEmissions : safeTarget;
  const estimatedSavingsKg = Math.round(baseEmissionsForSavings * template.reductionRatio * 10) / 10;

  return {
    topCategory,
    topCategoryPercentage,
    quickWin,
    longTermImprovement,
    weeklyPlan,
    estimatedSavingsKg
  };
}
