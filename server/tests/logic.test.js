const assert = require('assert');
const { addScoreWithRollingLimit, validateScore } = require('../src/services/rollingScore');
const { calculatePoolAndCharity } = require('../src/services/poolCalculator');
const { drawRandomNumbers, drawAlgorithmicNumbers, evaluateDraw } = require('../src/services/drawEngine');

console.log('====================================================');
console.log(' DIGITAL HEROES PRD - LOGIC VERIFICATION SUITE');
console.log('====================================================\n');

let passedTests = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] ${name}`);
    console.error(`       Error: ${err.message}\n`);
  }
}

// -------------------------------------------------------------
// 1. SCORE LOGIC & VALIDATION TESTS (§ 05)
// -------------------------------------------------------------

runTest('Score must be between 1 and 45', () => {
  assert.throws(() => validateScore(0, '2026-03-01'), /between 1 and 45/);
  assert.throws(() => validateScore(46, '2026-03-01'), /between 1 and 45/);
  assert.throws(() => validateScore(25.5, '2026-03-01'), /integer/);
  // Valid scores should not throw
  validateScore(1, '2026-03-01');
  validateScore(45, '2026-03-01');
  validateScore(36, '2026-03-01');
});

runTest('Disallows duplicate scores on the same date', () => {
  const existing = [
    { score: 32, date: '2026-03-10' },
    { score: 35, date: '2026-03-12' }
  ];
  assert.throws(
    () => addScoreWithRollingLimit(existing, { score: 40, date: '2026-03-10' }),
    /Only one score permitted per date/
  );
});

runTest('Retains exactly 5 scores and drops the oldest date automatically (Rolling Window)', () => {
  const existing = [
    { score: 20, date: '2026-03-01' }, // oldest
    { score: 25, date: '2026-03-05' },
    { score: 30, date: '2026-03-10' },
    { score: 35, date: '2026-03-15' },
    { score: 40, date: '2026-03-20' }
  ];

  // User adds 6th score on 2026-03-25
  const result = addScoreWithRollingLimit(existing, { score: 42, date: '2026-03-25' });

  assert.strictEqual(result.scores.length, 5, 'Should hold strictly 5 scores');
  assert.strictEqual(result.scores[0].date, '2026-03-25', 'Newest date should be first');
  assert.strictEqual(result.scores[4].date, '2026-03-05', '5th score should be 2026-03-05');
  assert.strictEqual(result.droppedScores.length, 1, 'Should have dropped 1 score');
  assert.strictEqual(result.droppedScores[0].date, '2026-03-01', 'Should have dropped the 2026-03-01 score');
});

// -------------------------------------------------------------
// 2. PRIZE POOL & CHARITY CALCULATOR (§ 04, § 07, § 08)
// -------------------------------------------------------------

runTest('Calculates charity contributions with 10% minimum & custom increase', () => {
  const subscribers = [
    { id: 'u1', charityPercentage: 10, plan: 'monthly' }, // 10% of $30 = $3.00
    { id: 'u2', charityPercentage: 25, plan: 'monthly' }, // 25% of $30 = $7.50
    { id: 'u3', charityPercentage: 5,  plan: 'monthly' }, // below 10%, clamped to 10% = $3.00
  ];

  const pool = calculatePoolAndCharity(subscribers, 0);
  assert.strictEqual(pool.totalCharityRaised, 13.50); // $3 + $7.5 + $3 = $13.50
  assert.strictEqual(pool.freshPrizePool, 45.00);      // 3 users * $15 = $45
});

runTest('Prize pool shares: 40% (Tier 5), 35% (Tier 4), 25% (Tier 3)', () => {
  // 100 subscribers at $30/mo = $1500 fresh pool
  const subscribers = Array.from({ length: 100 }, (_, i) => ({ id: `u${i}`, charityPercentage: 10 }));
  const pool = calculatePoolAndCharity(subscribers, 0);

  assert.strictEqual(pool.freshPrizePool, 1500);
  assert.strictEqual(pool.tiers.tier5.poolShare, 600); // 40% of 1500
  assert.strictEqual(pool.tiers.tier4.poolShare, 525); // 35% of 1500
  assert.strictEqual(pool.tiers.tier3.poolShare, 375); // 25% of 1500
});

// -------------------------------------------------------------
// 3. DRAW & MATCHING ENGINE (§ 06, § 07)
// -------------------------------------------------------------

runTest('Generates 5 unique numbers between 1 and 45', () => {
  const randomNums = drawRandomNumbers(5, 1, 45);
  assert.strictEqual(randomNums.length, 5);
  const uniqueSet = new Set(randomNums);
  assert.strictEqual(uniqueSet.size, 5);
  randomNums.forEach(n => {
    assert.ok(n >= 1 && n <= 45, 'Number must be between 1 and 45');
  });
});

runTest('Evaluates matches, splits tier prizes equally, and carries rollover if 5-match unclaimed', () => {
  const mockSubscribers = [
    // User 1 matches 5 numbers (Jackpot!)
    { id: 'u1', name: 'Alice', scores: [{ score: 10 }, { score: 20 }, { score: 30 }, { score: 40 }, { score: 45 }] },
    // User 2 matches 4 numbers
    { id: 'u2', name: 'Bob',   scores: [{ score: 10 }, { score: 20 }, { score: 30 }, { score: 40 }, { score: 2 }] },
    // User 3 matches 3 numbers
    { id: 'u3', name: 'Carol', scores: [{ score: 10 }, { score: 20 }, { score: 30 }, { score: 3 },  { score: 4 }] },
    // User 4 matches 3 numbers
    { id: 'u4', name: 'David', scores: [{ score: 10 }, { score: 20 }, { score: 30 }, { score: 5 },  { score: 6 }] },
    // User 5 matches 2 numbers (no prize)
    { id: 'u5', name: 'Eve',   scores: [{ score: 10 }, { score: 20 }, { score: 7 },  { score: 8 },  { score: 9 }] }
  ];

  const winningNumbers = [10, 20, 30, 40, 45];
  const evalResult = evaluateDraw(mockSubscribers, winningNumbers, 0);

  // 1 winner in Tier 5
  assert.strictEqual(evalResult.summary.tier5.winnerCount, 1);
  assert.strictEqual(evalResult.summary.tier5.winners[0].userId, 'u1');
  assert.strictEqual(evalResult.summary.tier5.rolloverToNextMonth, 0, 'No rollover because Alice won');

  // 1 winner in Tier 4
  assert.strictEqual(evalResult.summary.tier4.winnerCount, 1);
  assert.strictEqual(evalResult.summary.tier4.winners[0].userId, 'u2');

  // 2 winners in Tier 3 (Carol and David split the 25% pool)
  assert.strictEqual(evalResult.summary.tier3.winnerCount, 2);
  const tier3Total = evalResult.summary.tier3.totalAllocated;
  assert.strictEqual(evalResult.summary.tier3.payoutPerWinner, Number((tier3Total / 2).toFixed(2)));
});

runTest('Jackpot rollover triggers when 0 users match 5 numbers', () => {
  const mockSubscribers = [
    { id: 'u1', name: 'Alice', scores: [{ score: 1 }, { score: 2 }, { score: 3 }, { score: 4 }, { score: 5 }] },
    { id: 'u2', name: 'Bob',   scores: [{ score: 10 }, { score: 20 }, { score: 30 }, { score: 40 }, { score: 44 }] }
  ];

  // Winning numbers where no one gets 5 matches
  const winningNumbers = [11, 22, 33, 44, 45];
  const previousRollover = 500; // $500 rolled over from prior month
  const evalResult = evaluateDraw(mockSubscribers, winningNumbers, previousRollover);

  assert.strictEqual(evalResult.summary.tier5.winnerCount, 0);
  assert.ok(evalResult.nextMonthRollover > 500, 'Next month rollover must accumulate previous rollover + fresh 40% pool');
});

console.log(`\n====================================================`);
console.log(` RESULTS: ${passedTests} / 8 TESTS PASSED SUCCESSFULLY!`);
console.log('====================================================\n');
