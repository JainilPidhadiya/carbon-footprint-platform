/**
 * Eco Score Calculation Service
 * Fully typed, pure TypeScript functions for evaluating sustainability scores.
 */

export interface EcoScoreResult {
  readonly score: number; // 0 to 100
  readonly rating: 'Poor' | 'Average' | 'Good' | 'Excellent';
  readonly improvementNeeded: number; // kg CO2e reduction needed to hit target
}

/**
 * Computes an environmental Eco Score out of 100, map ratings, and identify improvements needed.
 * 
 * @param currentEmission The user's logged emissions in kg CO2e. Must be non-negative.
 * @param targetEmission The user's target monthly limit in kg CO2e. Must be greater than 0.
 * @param challengeCompletionPct The percentage of challenges completed (0 to 100).
 * @returns Computed EcoScoreResult metadata. Handles invalid inputs defensively.
 */
export function calculateEcoScore(
  currentEmission: number,
  targetEmission: number,
  challengeCompletionPct: number
): EcoScoreResult {
  // 1. Input Sanity Guards
  const safeCurrent = typeof currentEmission !== 'number' || isNaN(currentEmission) || currentEmission < 0 
    ? 0 
    : currentEmission;
  
  const safeTarget = typeof targetEmission !== 'number' || isNaN(targetEmission) || targetEmission <= 0 
    ? 450 // standard baseline fallback
    : targetEmission;

  // Handle challenge completion percentage representing either percentage (e.g. 80) or ratio (e.g. 0.8)
  let safeChallenge = typeof challengeCompletionPct !== 'number' || isNaN(challengeCompletionPct) 
    ? 0 
    : challengeCompletionPct;
  if (safeChallenge < 0) safeChallenge = 0;
  if (safeChallenge > 100) safeChallenge = 100;
  // If it looks like a ratio, scale it up
  if (challengeCompletionPct > 0 && challengeCompletionPct <= 1.0) {
    safeChallenge = challengeCompletionPct * 100;
  }

  // 2. Emission Performance Score (70% weight)
  let emissionScore: number;
  if (safeCurrent <= safeTarget) {
    emissionScore = 70; // full score if within budget
  } else {
    // Subtract points proportionally as user exceeds target budget
    const excessRatio = (safeCurrent - safeTarget) / safeTarget;
    emissionScore = Math.max(0, 70 - excessRatio * 70);
  }

  // 3. Challenge Completion Score (30% weight)
  const challengeScore = safeChallenge * 0.3;

  // 4. Combined Aggregate Score
  const score = Math.round(emissionScore + challengeScore);

  // 5. Ratings Mapping
  let rating: 'Poor' | 'Average' | 'Good' | 'Excellent';
  if (score < 40) {
    rating = 'Poor';
  } else if (score < 70) {
    rating = 'Average';
  } else if (score < 90) {
    rating = 'Good';
  } else {
    rating = 'Excellent';
  }

  // 6. Carbon Reduction Target Needed
  const improvementNeeded = safeCurrent > safeTarget 
    ? Math.round((safeCurrent - safeTarget) * 100) / 100 
    : 0;

  return {
    score,
    rating,
    improvementNeeded
  };
}
