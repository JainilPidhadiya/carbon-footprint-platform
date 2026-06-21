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
        return "I don't see any activity logs yet! Go ahead and log transport, meals, or electricity usage on the tracker page. Once you do, I will analyze your impact share.";
      }
      
      let analysis = `Based on your logs, you have emitted **${Math.round(totalMonthlyEmissions)} kg CO2e** this month. `;
      if (dominant === 'transport') {
        analysis += `Your primary source is **Transport** (${Math.round(categorySums.transport)} kg). Swap a few drives for train rides or cycling to make the biggest impact.`;
      } else if (dominant === 'food') {
        analysis += `Your largest footprint segment is **Diet & Food** (${Math.round(categorySums.food)} kg). Swapping red meat meals for vegetarian or vegan options represents the fastest individual carbon reductions available.`;
      } else if (dominant === 'energy') {
        analysis += `Your biggest draw is **Home Energy** (${Math.round(categorySums.energy)} kg). Lower your space heating thermostat by 1°C or ensure you use LED lighting to save watts.`;
      } else {
        analysis += `Your carbon footprint is fairly evenly distributed. Great tracking! Maintain your goals by checking the weekly challenges list.`;
      }
      return analysis;
    }

    case 'challenge': {
      const suggestions = [
        "Swap your next commute under 5km for walking or bicycle transit. That immediately eliminates car emissions.",
        "Try going fully plant-based for dinner today. Lentils, beans, or tofu emit 90% less carbon than beef.",
        "Turn off standby power strips at night. Standby power represents up to 10% of standard home electricity footprints.",
        "Audit your plastic recycling bin. Rinsing and compacting plastic ensures sorting centers can process it."
      ];
      return `Here is a daily task suggestion: **${suggestions[Math.floor(Math.random() * suggestions.length)]}**`;
    }

    case 'energy_tips':
      return "To optimize heating energy, install draft excluders around outer doors and lower boiler flow temperatures to 55°C. For electricity, swap traditional halogens to LED lights (saves 85% energy) and clean refrigerator condenser coils annually to maximize heat exchange efficiency.";

    default:
      return "I am here to guide you toward carbon reduction! Let's explore your analytics or complete weekly challenges.";
  }
};

/** Quick suggestions for user interaction options. */
export const quickPrompts = [
  { key: 'analyze', text: '📊 Analyze my carbon log', description: 'Get a personalized audit' },
  { key: 'challenge', text: '💡 Suggest a green challenge', description: 'Get an actionable prompt' },
  { key: 'energy_tips', text: '⚡ Home energy hacks', description: 'Reduce electricity & gas' },
];
