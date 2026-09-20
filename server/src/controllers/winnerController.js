const store = require('../config/store');

// GET /api/winners/my-claims
function getMyClaims(req, res) {
  const claims = store.winnerClaims.filter(c => c.userId === store.currentUser.id);
  res.json({ claims });
}

// POST /api/winners/upload-proof/:claimId
function uploadProof(req, res) {
  const { claimId } = req.params;
  const { proofImageUrl } = req.body;

  const claim = store.winnerClaims.find(c => c.id === claimId && c.userId === store.currentUser.id);
  if (!claim) {
    return res.status(404).json({ error: 'Winner claim ticket not found' });
  }

  if (!proofImageUrl) {
    return res.status(400).json({ error: 'Screenshot/proof image URL is required' });
  }

  claim.proofImageUrl = proofImageUrl;
  claim.verificationStatus = 'under_review';

  res.json({ message: 'Proof submitted successfully for verification', claim });
}

// GET /api/winners/all (Admin)
function getAllClaims(req, res) {
  res.json({ claims: store.winnerClaims });
}

// PUT /api/winners/verify/:claimId (Admin)
function verifyClaim(req, res) {
  const { claimId } = req.params;
  const { status, adminNotes } = req.body; // status: 'approved', 'rejected', 'paid'

  const claim = store.winnerClaims.find(c => c.id === claimId);
  if (!claim) {
    return res.status(404).json({ error: 'Claim not found' });
  }

  const validStatuses = ['under_review', 'approved', 'rejected', 'paid'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  claim.verificationStatus = status;
  if (adminNotes !== undefined) claim.adminNotes = adminNotes;

  res.json({ message: `Claim updated to ${status}`, claim });
}

module.exports = {
  getMyClaims,
  uploadProof,
  getAllClaims,
  verifyClaim
};
