const store = require('../config/store');
const { calculatePoolAndCharity } = require('../services/poolCalculator');

// GET /api/user/profile
function getProfile(req, res) {
  const user = store.currentUser;
  const charity = store.charities.find(c => c.id === user.charityId);
  res.json({
    user: {
      ...user,
      selectedCharity: charity || null
    }
  });
}

// PUT /api/user/profile
function updateProfile(req, res) {
  const { charityId, charityPercentage, subscriptionPlan } = req.body;

  if (charityPercentage !== undefined) {
    const rate = parseInt(charityPercentage, 10);
    if (isNaN(rate) || rate < 10) {
      return res.status(400).json({ error: 'Charity contribution must be at least 10%.' });
    }
    store.currentUser.charityPercentage = rate;

    // sync with subscriber pool
    const sub = store.subscribers.find(s => s.id === store.currentUser.id);
    if (sub) sub.charityPercentage = rate;
  }

  if (charityId) {
    const exists = store.charities.some(c => c.id === charityId);
    if (!exists) return res.status(400).json({ error: 'Selected charity does not exist' });
    store.currentUser.charityId = charityId;
  }

  if (subscriptionPlan) {
    if (!['monthly', 'yearly'].includes(subscriptionPlan)) {
      return res.status(400).json({ error: 'Plan must be monthly or yearly' });
    }
    store.currentUser.subscriptionPlan = subscriptionPlan;
  }

  res.json({ message: 'Profile updated successfully', user: store.currentUser });
}

// GET /api/admin/stats
function getAdminStats(req, res) {
  const poolData = calculatePoolAndCharity(store.subscribers, store.currentJackpotRollover);

  res.json({
    totalUsers: store.subscribers.length,
    activeSubscribers: store.subscribers.length,
    totalPrizePool: poolData.totalPrizePool,
    totalCharityRaised: poolData.totalCharityRaised,
    currentRollover: store.currentJackpotRollover,
    drawStatistics: {
      pastDrawsCount: store.pastDraws.length,
      totalClaimsCount: store.winnerClaims.length,
      pendingVerifications: store.winnerClaims.filter(c => c.verificationStatus === 'under_review').length
    }
  });
}

module.exports = {
  getProfile,
  updateProfile,
  getAdminStats
};
