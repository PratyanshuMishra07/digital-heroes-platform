const store = require('../config/store');
const { drawRandomNumbers, drawAlgorithmicNumbers, evaluateDraw } = require('../services/drawEngine');
const { calculatePoolAndCharity } = require('../services/poolCalculator');

// GET /api/draws/pool
function getCurrentPool(req, res) {
  const pool = calculatePoolAndCharity(store.subscribers, store.currentJackpotRollover);
  res.json({
    pool,
    currentRollover: store.currentJackpotRollover
  });
}

// GET /api/draws/history
function getPastDraws(req, res) {
  res.json({ draws: store.pastDraws });
}

// POST /api/draws/simulate
function simulate(req, res) {
  const { mode = 'algorithmic' } = req.body;

  let numbers;
  if (mode === 'algorithmic') {
    numbers = drawAlgorithmicNumbers(store.subscribers, 5, 1, 45);
  } else {
    numbers = drawRandomNumbers(5, 1, 45);
  }

  const evaluation = evaluateDraw(store.subscribers, numbers, store.currentJackpotRollover);

  res.json({
    simulated: true,
    drawMode: mode,
    evaluation
  });
}

// POST /api/draws/publish (Admin only)
function publish(req, res) {
  const { mode = 'algorithmic' } = req.body;

  let numbers;
  if (mode === 'algorithmic') {
    numbers = drawAlgorithmicNumbers(store.subscribers, 5, 1, 45);
  } else {
    numbers = drawRandomNumbers(5, 1, 45);
  }

  const evaluation = evaluateDraw(store.subscribers, numbers, store.currentJackpotRollover);

  const drawId = `draw_${new Date().toISOString().slice(0, 10)}_${Date.now()}`;
  const newDraw = {
    id: drawId,
    drawDate: new Date().toISOString().slice(0, 10),
    drawMode: mode,
    winningNumbers: numbers,
    totalPool: evaluation.poolData.totalPrizePool,
    tier5Jackpot: evaluation.poolData.tiers.tier5.poolShare,
    tier4Pool: evaluation.poolData.tiers.tier4.poolShare,
    tier3Pool: evaluation.poolData.tiers.tier3.poolShare,
    status: 'published',
    rolloverCarried: store.currentJackpotRollover,
    nextMonthRollover: evaluation.nextMonthRollover
  };

  store.pastDraws.unshift(newDraw);
  store.currentJackpotRollover = evaluation.nextMonthRollover;

  // Generate winner claim tickets for winners
  const allWinners = [
    ...evaluation.summary.tier5.winners.map(w => ({ ...w, tier: 'tier5', prize: evaluation.summary.tier5.payoutPerWinner })),
    ...evaluation.summary.tier4.winners.map(w => ({ ...w, tier: 'tier4', prize: evaluation.summary.tier4.payoutPerWinner })),
    ...evaluation.summary.tier3.winners.map(w => ({ ...w, tier: 'tier3', prize: evaluation.summary.tier3.payoutPerWinner }))
  ];

  allWinners.forEach(winner => {
    store.winnerClaims.unshift({
      id: `claim_${Date.now()}_${winner.userId}`,
      drawId,
      userId: winner.userId,
      userName: winner.name,
      tier: winner.tier,
      matchCount: winner.matchedCount,
      matchedScores: winner.matchedScores,
      prizeAmount: winner.prize,
      proofImageUrl: null,
      verificationStatus: 'pending_proof',
      createdAt: new Date().toISOString()
    });
  });

  res.status(201).json({
    message: 'Draw successfully published!',
    draw: newDraw,
    evaluation
  });
}

module.exports = {
  getCurrentPool,
  getPastDraws,
  simulate,
  publish
};
