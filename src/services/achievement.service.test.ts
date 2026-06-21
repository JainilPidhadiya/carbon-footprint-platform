/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import { evaluateAchievements, getUnlockedAchievements } from './achievement.service';
import type { Achievement, CarbonActivity } from '../types';

const MOCK_BASE_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-activity',
    name: 'Green Rookie',
    description: 'First Activity Logged',
    iconName: 'Leaf',
    isUnlocked: false,
    unlockCriteria: 'Log 1 activity',
  },
  {
    id: 'ach-three-activities',
    name: 'Carbon Tracker',
    description: '3 Activities Logged',
    iconName: 'Activity',
    isUnlocked: false,
    unlockCriteria: 'Log 3 activities',
  },
  {
    id: 'ach-seven-streak',
    name: 'Daily Warrior',
    description: '7 Day Streak',
    iconName: 'Flame',
    isUnlocked: false,
    unlockCriteria: 'Log 7 days in a row',
  },
  {
    id: 'ach-high-score',
    name: 'Eco Expert',
    description: 'Eco Score > 80',
    iconName: 'Award',
    isUnlocked: false,
    unlockCriteria: 'Achieve score > 80',
  },
  {
    id: 'ach-five-challenges',
    name: 'Challenge Master',
    description: 'Completed 5 Challenges',
    iconName: 'Trophy',
    isUnlocked: false,
    unlockCriteria: 'Complete 5 challenges',
  }
];

const MOCK_ACTIVITY: CarbonActivity = {
  id: 'act-1',
  userId: 'user-1',
  category: 'food',
  description: 'Vegan salad',
  value: 1,
  unit: 'meal',
  co2e: 0.5,
  loggedAt: new Date().toISOString()
};

describe('Achievement Evaluation Service', () => {

  it('unlocks first activity milestone when activities length is 1', () => {
    const list = evaluateAchievements([MOCK_ACTIVITY], 0, 0, 0, MOCK_BASE_ACHIEVEMENTS);
    const unlocked = getUnlockedAchievements(list);
    
    expect(unlocked.length).toBe(1);
    expect(unlocked[0].id).toBe('ach-first-activity');
    expect(unlocked[0].isUnlocked).toBe(true);
    expect(unlocked[0].unlockedAt).toBeDefined();
  });

  it('unlocks three activities milestone when activities length is 3', () => {
    const activities = [MOCK_ACTIVITY, MOCK_ACTIVITY, MOCK_ACTIVITY];
    const list = evaluateAchievements(activities, 0, 0, 0, MOCK_BASE_ACHIEVEMENTS);
    const unlocked = getUnlockedAchievements(list);
    
    // Should unlock BOTH first activity AND three activities
    expect(unlocked.length).toBe(2);
    expect(unlocked.map(u => u.id)).toContain('ach-first-activity');
    expect(unlocked.map(u => u.id)).toContain('ach-three-activities');
  });

  it('unlocks streak milestone when streak is 7 or more', () => {
    const list = evaluateAchievements([], 7, 0, 0, MOCK_BASE_ACHIEVEMENTS);
    const unlocked = getUnlockedAchievements(list);
    
    expect(unlocked.length).toBe(1);
    expect(unlocked[0].id).toBe('ach-seven-streak');
  });

  it('unlocks score milestone when score > 80', () => {
    const list = evaluateAchievements([], 0, 81, 0, MOCK_BASE_ACHIEVEMENTS);
    const unlocked = getUnlockedAchievements(list);
    
    expect(unlocked.length).toBe(1);
    expect(unlocked[0].id).toBe('ach-high-score');
  });

  it('does not unlock score milestone if score is exactly 80', () => {
    const list = evaluateAchievements([], 0, 80, 0, MOCK_BASE_ACHIEVEMENTS);
    const unlocked = getUnlockedAchievements(list);
    
    expect(unlocked.length).toBe(0);
  });

  it('unlocks challenges milestone when completed challenges count is 5 or more', () => {
    const list = evaluateAchievements([], 0, 0, 5, MOCK_BASE_ACHIEVEMENTS);
    const unlocked = getUnlockedAchievements(list);
    
    expect(unlocked.length).toBe(1);
    expect(unlocked[0].id).toBe('ach-five-challenges');
  });

  it('preserves existing unlocked achievements without changing fields', () => {
    const alreadyUnlocked: Achievement[] = [
      {
        ...MOCK_BASE_ACHIEVEMENTS[0],
        isUnlocked: true,
        unlockedAt: 'legacy-timestamp'
      }
    ];

    const list = evaluateAchievements([MOCK_ACTIVITY], 0, 0, 0, alreadyUnlocked);
    expect(list[0].isUnlocked).toBe(true);
    expect(list[0].unlockedAt).toBe('legacy-timestamp');
  });

  it('handles invalid input types defensively', () => {
    const list = evaluateAchievements(
      null as any,
      undefined as any,
      'invalid' as any,
      null as any,
      MOCK_BASE_ACHIEVEMENTS
    );
    expect(list.filter(a => a.isUnlocked).length).toBe(0);
  });

  it('handles non-array inputs in getUnlockedAchievements', () => {
    expect(getUnlockedAchievements(null as any)).toEqual([]);
    expect(getUnlockedAchievements(undefined as any)).toEqual([]);
  });

  it('handles legacy achievements or unknown IDs in evaluateAchievements', () => {
    const customAchievements: Achievement[] = [
      {
        id: 'ach-unknown-id',
        name: 'Secret Badge',
        description: 'Unknown logic',
        iconName: 'Help',
        isUnlocked: false,
        unlockCriteria: 'None',
      }
    ];
    const list = evaluateAchievements([], 0, 0, 0, customAchievements);
    expect(list[0].isUnlocked).toBe(false);
  });

});
