/**
 * @file features/coach/coachUtils.ts
 * @description Helper functions and mock response mappings for the AI Sustainability Coach chat interface.
 */

import type { CarbonActivity, CarbonCategory } from '../../types';

/**
 * Represents a single chat message in the coach UI.
 */
export interface ChatMessage {
  /** Unique message identifier. */
  id: string;
  /** Role of the sender ('ai' or 'user'). */
  sender: 'ai' | 'user';
  /** Text content of the message. */
  text: string;
  /** Date and time when the message was sent. */
  timestamp: Date;
}

/**
 * Escapes HTML characters to prevent XSS issues when rendering user or AI messages.
 * 
 * @param str The raw input text.
 * @returns Escaped HTML text.
 */
export const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Converts double asterisks (`**`) into HTML strong tags and newlines into break tags.
 * 
 * @param text The markdown-like text to format.
 * @returns HTML string suitable for rendering.
 */
export const formatAiMessage = (text: string): string => {
  const escaped = escapeHtml(text);
  return escaped
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
};

/**
 * Generates an automated sustainability advice response based on the selected prompt key,
 * logged activities, and aggregate emissions metrics.
 * 
 * @param promptKey The chosen quick query action identifier.
 * @param activities The monthly collection of logged activities.
 * @param totalMonthlyEmissions The sum total of CO2 emissions for the month.
 * @param categorySums The mapping of emissions by category.
 * @returns Personalized message reply text.
 */
export const getResponse = (
  promptKey: string, 
  activities: readonly CarbonActivity[],
  totalMonthlyEmissions: number,
  categorySums: Record<CarbonCategory, number>
): string => {
  let maxCat = 'none';
  let maxVal = 0;
  Object.entries(categorySums).forEach(([cat, val]) => {
    if (val > maxVal) {
      maxVal = val;
      maxCat = cat;
    }
  });

  const dominant = maxCat;
  
  switch (promptKey) {
    case 'analyze': {
      if (activities.length === 0) {
        return "I don't see any activity logs yet! Go ahead and log transport, meals, or electricity usage on the tracker page. Once you do, I will analyze your category emissions and monthly carbon budget.";
      }
      
      let analysis = `Based on your logs, you have emitted **${Math.round(totalMonthlyEmissions)} kg CO2e** this month. `;
      if (dominant === 'transport') {
        analysis += `Your primary emission source is **Transport** (${Math.round(categorySums.transport)} kg CO2e). Swapping gasoline commutes for public transit or cycling represents the highest immediate carbon reduction potential.`;
      } else if (dominant === 'food') {
        analysis += `Your largest footprint driver is **Diet & Food** (${Math.round(categorySums.food)} kg CO2e). Substituting high-emission red meats with vegetarian options can reduce meal-related carbon intensity by up to 60%.`;
      } else if (dominant === 'energy') {
        analysis += `Your major carbon draw is **Home Energy** (${Math.round(categorySums.energy)} kg CO2e). Lowering space heating thermostats by 1°C and switching to LED fixtures offers the most efficient path to reduce residential footprint.`;
      } else {
        analysis += `Your carbon footprint is evenly distributed across sectors. Great tracking! Continue tracking to discover more personalized carbon-saving opportunities.`;
      }
      return analysis;
    }

    case 'challenge': {
      const suggestions = [
        "Swap a vehicle commute under 5km for walking or cycling (avoids 0.17 kg CO2e per km).",
        "Swap beef for a plant-based alternative for one meal (reduces food carbon intensity by up to 2.5 kg CO2e per serving).",
        "Unplug household devices on standby at night (standby power accounts for up to 10% of home electricity emissions).",
        "Optimize paper and cardboard recycling (avoids methane release from decomposing organic materials in landfill waste)."
      ];
      return `Here is a carbon-saving recommendation: **${suggestions[Math.floor(Math.random() * suggestions.length)]}**`;
    }

    case 'energy_tips':
      return "To lower heating carbon emissions, install draft excluders around outer doors and lower boiler flow temperatures to 55°C (saves ~180kg CO2e/year). For electricity emissions, swap traditional halogens to LED lights (saves 85% energy, reducing home footprint by up to 200kg CO2e/year).";

    default:
      return "I am here to guide you toward carbon footprint reduction! Let's explore your analytics or review your carbon reduction plans.";
  }
};

/** Quick suggestions for user interaction options. */
export const quickPrompts = [
  { key: 'analyze', text: '📊 Audit carbon footprint', description: 'Detailed breakdown of category emissions and budget limits' },
  { key: 'challenge', text: '🌱 Suggest carbon reduction plan', description: 'Get a direct action to lower transport, food, or waste emissions' },
  { key: 'energy_tips', text: '⚡ Decarbonize home energy', description: 'Strategies to reduce electricity and space heating emissions' },
];
