import { describe, it, expect } from 'vitest';
import { calculateEcoScore } from './ecoScore.service';

describe('Eco Score Calculation Service', () => {

  it('awards a perfect score of 100 for zero emissions and fully completed challenges', () => {
    const result = calculateEcoScore(0, 450, 100);
    expect(result.score).toBe(100);
    expect(result.rating).toBe('Excellent');
    expect(result.improvementNeeded).toBe(0);
  });

  it('evaluates rating thresholds correctly', () => {
    // Exceed budget slightly, no challenges -> Average
    const result1 = calculateEcoScore(500, 400, 0); // emissionScore = 70 - 17.5 = 52.5. score = 53
    expect(result1.score).toBe(53);
    expect(result1.rating).toBe('Average');
    expect(result1.improvementNeeded).toBe(100);

    // Well under budget, moderate challenges completed -> Good
    const result2 = calculateEcoScore(300, 400, 50); // emissionScore = 70, challengeScore = 15. score = 85
    expect(result2.score).toBe(85);
    expect(result2.rating).toBe('Good');

    // Heavily over budget, no challenges -> Poor
    const result3 = calculateEcoScore(1200, 400, 0); // emissionScore = 0. score = 0
    expect(result3.score).toBe(0);
    expect(result3.rating).toBe('Poor');
    expect(result3.improvementNeeded).toBe(800);
  });

  it('normalizes challenge completion ratios (0.8 -> 80%) correctly', () => {
    const resultPct = calculateEcoScore(300, 400, 80);
    const resultRatio = calculateEcoScore(300, 400, 0.8);
    expect(resultPct.score).toBe(resultRatio.score);
  });

  it('handles negative or NaN values defensively', () => {
    const result = calculateEcoScore(-100, NaN, -50);
    expect(result.score).toBe(70); // fallback target (450), 0 current -> 70. 0 challenges -> 0. score = 70
    expect(result.rating).toBe('Good');
    expect(result.improvementNeeded).toBe(0);
  });

  it('handles target values <= 0 and fallback budgets', () => {
    // target = 0 should fallback to 450
    const result = calculateEcoScore(450, 0, 0); // current = fallback target -> emissionScore = 70. score = 70.
    expect(result.score).toBe(70);
    expect(result.rating).toBe('Good');
  });

  it('bounds challenge percentages exceeding 100', () => {
    const result = calculateEcoScore(0, 450, 150); // challenge score capped at 30. emissionScore = 70 -> score = 100.
    expect(result.score).toBe(100);
  });

  it('evaluates exact category bounds for ratings', () => {
    // Score of 39 should be Poor
    // E.g. emission score = 39, challenge score = 0
    // If target is 100, current is 144. emission ratio excess = 44/100 -> emissionScore = 70 - 44*0.7 = 39.2 (Math.round to 39)
    const resultPoor = calculateEcoScore(144, 100, 0); 
    expect(resultPoor.score).toBe(39);
    expect(resultPoor.rating).toBe('Poor');

    // Score of 40 should be Average
    // If current is 143 -> emissionScore = 70 - 43*0.7 = 39.9 (rounds to 40)
    const resultAvg = calculateEcoScore(143, 100, 0);
    expect(resultAvg.score).toBe(40);
    expect(resultAvg.rating).toBe('Average');
  });

});
