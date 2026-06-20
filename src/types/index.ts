/**
 * Carbon Footprint Platform Core Type Definitions
 * Designed by Senior TypeScript Architect
 */

/**
 * Standard categories of carbon-emitting activities.
 */
export type CarbonCategory = 'transport' | 'energy' | 'food' | 'waste';

/**
 * Legacy alias for CarbonCategory to maintain backward compatibility.
 */
export type EmissionCategory = CarbonCategory;

/**
 * Represents an individual carbon-emitting activity logged by a user.
 */
export interface CarbonActivity {
  readonly id: string;
  readonly userId: string;
  readonly category: CarbonCategory;
  readonly description: string;
  /** Raw metric value inputted by the user (e.g. km driven, kWh used) */
  readonly value: number;
  /** Unit of the metric value (e.g. "km", "kWh", "meals") */
  readonly unit: string;
  /** Calculated Carbon Dioxide equivalent in kilograms (kg CO2e) */
  readonly co2e: number;
  /** ISO 8601 string representing when the activity occurred */
  readonly loggedAt: string;
}

/**
 * Legacy alias for CarbonActivity to maintain backward compatibility.
 */
export type EmissionActivity = CarbonActivity;

/**
 * Aggregated carbon footprint statistics over a specific timeframe.
 */
export interface CarbonSummary {
  /** Cumulative carbon footprint in kg CO2e */
  readonly totalCo2e: number;
  /** Carbon footprint breakdown per category */
  readonly byCategory: Readonly<Record<CarbonCategory, number>>;
  /** Total number of activities logged in this summary period */
  readonly activitiesCount: number;
}

/**
 * Dynamic sustainability score and gamification ranking for the user.
 */
export interface EcoScore {
  /** Sustainability rating score between 0 and 100 */
  readonly value: number;
  /** Current user eco-level */
  readonly level: number;
  /** Total accrued Experience Points (XP) */
  readonly totalXp: number;
  /** Title corresponding to current level (e.g. "Sustainability Scholar") */
  readonly rankName: string;
}

/**
 * A weekly task offered to the user to promote footprint reductions.
 */
export interface WeeklyChallenge {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: CarbonCategory;
  /** Experience Points rewarded on successful completion */
  readonly xpReward: number;
  /** Estimated potential savings of CO2e in kg if action is completed */
  readonly co2ePotentialSaving: number;
  /** Flag representing if user accepted the challenge */
  readonly isAccepted: boolean;
  /** Flag representing if user completed the challenge */
  readonly isCompleted: boolean;
}

/**
 * Legacy alias for WeeklyChallenge to maintain backward compatibility.
 */
export type Challenge = WeeklyChallenge;

/**
 * An achievement badge unlocked by reaching tracking milestones.
 */
export interface Achievement {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly iconName: string;
  readonly isUnlocked: boolean;
  readonly unlockCriteria: string;
  readonly unlockedAt?: string;
}

/**
 * Legacy alias for Achievement to maintain backward compatibility.
 */
export type Badge = Achievement;

/**
 * User goals defining carbon thresholds or limits.
 */
export interface UserGoal {
  readonly id: string;
  /** Target category. Use "overall" to set limits across all footprint sections */
  readonly category: CarbonCategory | 'overall';
  /** Target maximum allowed CO2e in kg */
  readonly targetCo2e: number;
  readonly term: 'daily' | 'monthly' | 'yearly';
  readonly createdAt: string;
}

/**
 * Recommendation or insight from the AI sustainability advisor.
 */
export interface AdvisorInsight {
  readonly id: string;
  readonly text: string;
  readonly priority: 'low' | 'medium' | 'high';
  readonly category?: CarbonCategory;
  /** Optional recommendation text action step */
  readonly suggestedAction?: string;
}

/**
 * Complete metrics representing state of the main dashboard UI.
 */
export interface DashboardMetrics {
  readonly currentMonthSummary: CarbonSummary;
  readonly budgetPercentUsed: number;
  readonly budgetRemaining: number;
  readonly ecoScore: EcoScore;
  readonly streakDays: number;
  readonly activeChallengesCount: number;
}

/**
 * Profile specifications for the logged-in user.
 */
export interface UserProfile {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly monthlyTargetCo2e: number;
  readonly createdAt: string;
  readonly carbonScore: number;
}

/**
 * Response collection for the baseline calculator wizard.
 */
export interface CalculatorAnswers {
  readonly transportMode: 'car_petrol' | 'car_diesel' | 'car_ev' | 'public_transit' | 'bicycle' | 'walking';
  readonly weeklyDistance: number;
  readonly electricityBill: number;
  readonly heatingFuel: 'gas' | 'electric' | 'oil' | 'none';
  readonly dietType: 'vegan' | 'vegetarian' | 'low_meat' | 'high_meat';
  readonly recyclePaper: boolean;
  readonly recyclePlastic: boolean;
  readonly recycleGlass: boolean;
}

/**
 * Educational reading materials.
 */
export interface EducationArticle {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly summary: string;
  readonly content: string;
  readonly readTimeMinutes: number;
  readonly category: string;
  readonly imageUrl?: string;
}

/**
 * Single multiple-choice quiz question definition.
 */
export interface QuizQuestion {
  readonly id: string;
  readonly question: string;
  readonly options: readonly string[];
  readonly correctOptionIndex: number;
  readonly explanation: string;
}

/**
 * Group of questions forming a specific educational quiz.
 */
export interface Quiz {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly questions: readonly QuizQuestion[];
  readonly xpReward: number;
}

/**
 * Single data point representing a day's projected carbon footprint.
 */
export interface ForecastDataPoint {
  readonly day: number;
  readonly date: string;
  readonly projectedEmission: number;
  readonly targetLine?: number;
}

/**
 * 30-day projection analysis report.
 */
export interface ForecastReport {
  readonly dataPoints: readonly ForecastDataPoint[];
  readonly totalProjected30Days: number;
  readonly changeDirection: 'decreasing' | 'stable' | 'increasing';
  readonly percentChange: number;
}

