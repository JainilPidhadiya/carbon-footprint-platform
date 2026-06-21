/**
 * Achievement Evaluation Service
 * Pure functions checking user milestones to unlock sustainability achievements.
 */

import type { Achievement, CarbonActivity } from '../types';

/**
 * Checks all achievements in a list and unlocks them if their criteria are met.
 * 
 * @param activities List of logged activities.
 * @param streakDays Current user streak in days.
 * @param ecoScoreValue Current eco score value (0 to 100).
 * @param completedChallengesCount Current count of completed challenges.
 * @param currentAchievements The list of all system achievements.
 * @returns A new array of achievements with updated unlock statuses.
 */
export function evaluateAchievements(
  activities: readonly CarbonActivity[],
  streakDays: number,
  ecoScoreValue: number,
  completedChallengesCount: number,
  currentAchievements: readonly Achievement[]
): Achievement[] {
  
  const safeActivitiesCount = Array.isArray(activities) ? activities.length : 0;
  const safeStreak = typeof streakDays === 'number' && !isNaN(streakDays) ? streakDays : 0;
  const safeScore = typeof ecoScoreValue === 'number' && !isNaN(ecoScoreValue) ? ecoScoreValue : 0;
  const safeChallenges = typeof completedChallengesCount === 'number' && !isNaN(completedChallengesCount) 
    ? completedChallengesCount 
    : 0;

  return currentAchievements.map((achievement) => {
    // If already unlocked, do not re-unlock or update unlockedAt timestamp
    if (achievement.isUnlocked) {
      return achievement;
    }

    let shouldUnlock: boolean;

    switch (achievement.id) {
      case 'ach-first-activity':
      case 'b-1': // legacy compat
        shouldUnlock = safeActivitiesCount >= 1;
        break;
      
      case 'ach-three-activities':
      case 'b-2': // legacy compat
        shouldUnlock = safeActivitiesCount >= 3;
        break;

      case 'ach-seven-streak':
        shouldUnlock = safeStreak >= 7;
        break;

      case 'ach-high-score':
      case 'b-4': // legacy compat
        shouldUnlock = safeScore > 80;
        break;

      case 'ach-five-challenges':
        shouldUnlock = safeChallenges >= 5;
        break;

      default:
        shouldUnlock = false;
    }

    if (shouldUnlock) {
      return {
        ...achievement,
        isUnlocked: true,
        unlockedAt: new Date().toISOString()
      };
    }

    return achievement;
  });
}

/**
 * Filters a list of achievements to return only the ones that are unlocked.
 * 
 * @param achievements List of achievements.
 * @returns Array of unlocked achievements.
 */
export function getUnlockedAchievements(achievements: readonly Achievement[]): Achievement[] {
  if (!Array.isArray(achievements)) {
    return [];
  }
  return achievements.filter((ach) => ach.isUnlocked);
}
