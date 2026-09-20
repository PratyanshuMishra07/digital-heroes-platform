/**
 * Prize Pool & Charity Calculator
 * Implements PRD Section § 04, § 06, § 07, § 08:
 * - Subscriptions: Monthly ($30) or Yearly ($300, discounted)
 * - Charity Contribution: Minimum 10% of fee, users can voluntarily increase it
 * - Prize Pool: Fixed portion (e.g. 50% of subscription base fee)
 * - Prize Tiers:
 *     - 5-Number match: 40% pool share (Rollover enabled: Yes - jackpot)
 *     - 4-Number match: 35% pool share (Rollover: No)
 *     - 3-Number match: 25% pool share (Rollover: No)
 * - Multiple winners in the same tier split the tier prize equally
 */

const DEFAULT_CONFIG = {
  monthlyFee: 30,
  poolContributionRate: 0.50, // 50% of fee goes to monthly prize pool ($15)
  minimumCharityRate: 0.10    // 10% minimum charity contribution ($3)
};

/**
 * Calculates monthly pool and charity contributions
 * @param {Array<{id: string, charityPercentage?: number, plan?: string}>} activeSubscribers
 * @param {number} rolloverJackpot - Unclaimed 5-match jackpot from previous draw
 * @param {Object} config
 */
function calculatePoolAndCharity(activeSubscribers = [], rolloverJackpot = 0, config = DEFAULT_CONFIG) {
  let totalCharityAmount = 0;
  let freshPrizePool = 0;

  activeSubscribers.forEach(subscriber => {
    const fee = subscriber.plan === 'yearly' ? (config.monthlyFee * 10) / 12 : config.monthlyFee;
    
    // Charity percentage: at least 10%
    const userCharityRate = Math.max(
      config.minimumCharityRate, 
      (subscriber.charityPercentage || 10) / 100
    );
    totalCharityAmount += fee * userCharityRate;

    // Fixed portion goes to prize pool
    freshPrizePool += fee * config.poolContributionRate;
  });

  const tier5Share = (freshPrizePool * 0.40) + (rolloverJackpot || 0);
  const tier4Share = freshPrizePool * 0.35;
  const tier3Share = freshPrizePool * 0.25;

  return {
    activeSubscriberCount: activeSubscribers.length,
    totalCharityRaised: Number(totalCharityAmount.toFixed(2)),
    freshPrizePool: Number(freshPrizePool.toFixed(2)),
    previousRollover: Number(rolloverJackpot.toFixed(2)),
    totalPrizePool: Number((freshPrizePool + (rolloverJackpot || 0)).toFixed(2)),
    tiers: {
      tier5: {
        percentage: 40,
        poolShare: Number(tier5Share.toFixed(2)),
        rolloverEnabled: true
      },
      tier4: {
        percentage: 35,
        poolShare: Number(tier4Share.toFixed(2)),
        rolloverEnabled: false
      },
      tier3: {
        percentage: 25,
        poolShare: Number(tier3Share.toFixed(2)),
        rolloverEnabled: false
      }
    }
  };
}

module.exports = {
  DEFAULT_CONFIG,
  calculatePoolAndCharity
};
