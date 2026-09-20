/**
 * Draw & Reward Engine
 * Implements PRD Section § 06 & § 07:
 * - Match types: 5-number, 4-number, 3-number match
 * - Draw logic:
 *     - Random (standard lottery-style)
 *     - Algorithmic (weighted by score frequency across active users)
 * - Operations:
 *     - Simulation before publish
 *     - Admin controls publishing
 *     - Jackpot rollover if unclaimed in 5-number match tier
 */

const { calculatePoolAndCharity } = require('./poolCalculator');

/**
 * Generates 5 unique random numbers between min and max (inclusive)
 */
function drawRandomNumbers(count = 5, min = 1, max = 45) {
  const chosen = new Set();
  while (chosen.size < count) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    chosen.add(num);
  }
  return Array.from(chosen).sort((a, b) => a - b);
}

/**
 * Generates 5 numbers weighted by score frequency
 * Scores that appear more frequently in player submissions have higher odds
 */
function drawAlgorithmicNumbers(subscribers = [], count = 5, min = 1, max = 45) {
  // Count frequency of all scores
  const frequencyMap = {};
  for (let i = min; i <= max; i++) {
    frequencyMap[i] = 1; // baseline smoothing weight of 1
  }

  subscribers.forEach(sub => {
    (sub.scores || []).forEach(item => {
      const s = typeof item === 'number' ? item : item.score;
      if (s >= min && s <= max) {
        frequencyMap[s] = (frequencyMap[s] || 1) + 3; // boosted weight for real scores
      }
    });
  });

  const chosen = new Set();
  while (chosen.size < count) {
    // Weighted random selection
    const pool = [];
    for (const [numStr, weight] of Object.entries(frequencyMap)) {
      const num = parseInt(numStr, 10);
      if (!chosen.has(num)) {
        for (let w = 0; w < weight; w++) {
          pool.push(num);
        }
      }
    }

    if (pool.length === 0) break;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    chosen.add(picked);
  }

  return Array.from(chosen).sort((a, b) => a - b);
}

/**
 * Evaluates winners and payouts for a given draw
 * @param {Array<{id: string, name?: string, scores: Array<{score: number}>}>} subscribers
 * @param {Array<number>} winningNumbers
 * @param {number} rolloverJackpot
 */
function evaluateDraw(subscribers = [], winningNumbers = [], rolloverJackpot = 0) {
  const winningSet = new Set(winningNumbers);
  const poolData = calculatePoolAndCharity(subscribers, rolloverJackpot);

  const results = {
    tier5: { winners: [], totalPool: poolData.tiers.tier5.poolShare },
    tier4: { winners: [], totalPool: poolData.tiers.tier4.poolShare },
    tier3: { winners: [], totalPool: poolData.tiers.tier3.poolShare },
    nonWinnersCount: 0
  };

  subscribers.forEach(sub => {
    const rawScores = (sub.scores || []).map(s => (typeof s === 'number' ? s : s.score));
    const matchedScores = rawScores.filter(score => winningSet.has(score));
    const matchCount = matchedScores.length;

    const winnerEntry = {
      userId: sub.id,
      name: sub.name || 'Anonymous Golfer',
      matchedCount: matchCount,
      matchedScores: matchedScores
    };

    if (matchCount === 5) {
      results.tier5.winners.push(winnerEntry);
    } else if (matchCount === 4) {
      results.tier4.winners.push(winnerEntry);
    } else if (matchCount === 3) {
      results.tier3.winners.push(winnerEntry);
    } else {
      results.nonWinnersCount++;
    }
  });

  // Calculate payouts (split equally among winners in same tier)
  const tier5WinnersCount = results.tier5.winners.length;
  const tier4WinnersCount = results.tier4.winners.length;
  const tier3WinnersCount = results.tier3.winners.length;

  const tier5PayoutPerWinner = tier5WinnersCount > 0 ? results.tier5.totalPool / tier5WinnersCount : 0;
  const tier4PayoutPerWinner = tier4WinnersCount > 0 ? results.tier4.totalPool / tier4WinnersCount : 0;
  const tier3PayoutPerWinner = tier3WinnersCount > 0 ? results.tier3.totalPool / tier3WinnersCount : 0;

  // Rollover rule: If 5-number match has no winners, entire tier 5 pool rolls over to next month
  const nextMonthRollover = tier5WinnersCount === 0 ? results.tier5.totalPool : 0;

  return {
    winningNumbers,
    poolData,
    summary: {
      tier5: {
        winnerCount: tier5WinnersCount,
        payoutPerWinner: Number(tier5PayoutPerWinner.toFixed(2)),
        totalAllocated: Number(results.tier5.totalPool.toFixed(2)),
        rolloverToNextMonth: Number(nextMonthRollover.toFixed(2)),
        winners: results.tier5.winners
      },
      tier4: {
        winnerCount: tier4WinnersCount,
        payoutPerWinner: Number(tier4PayoutPerWinner.toFixed(2)),
        totalAllocated: Number(results.tier4.totalPool.toFixed(2)),
        rolloverToNextMonth: 0,
        winners: results.tier4.winners
      },
      tier3: {
        winnerCount: tier3WinnersCount,
        payoutPerWinner: Number(tier3PayoutPerWinner.toFixed(2)),
        totalAllocated: Number(results.tier3.totalPool.toFixed(2)),
        rolloverToNextMonth: 0,
        winners: results.tier3.winners
      },
      nonWinnersCount: results.nonWinnersCount
    },
    nextMonthRollover: Number(nextMonthRollover.toFixed(2))
  };
}

module.exports = {
  drawRandomNumbers,
  drawAlgorithmicNumbers,
  evaluateDraw
};
