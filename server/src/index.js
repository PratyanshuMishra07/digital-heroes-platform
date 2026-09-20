const express = require('express');
const cors = require('cors');

const scoreController = require('./controllers/scoreController');
const drawController = require('./controllers/drawController');
const charityController = require('./controllers/charityController');
const winnerController = require('./controllers/winnerController');
const userController = require('./controllers/userController');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Digital Heroes API running', timestamp: new Date() });
});

// --- Scores Endpoints (§ 05) ---
app.get('/api/scores', scoreController.getScores);
app.post('/api/scores', scoreController.addScore);
app.put('/api/scores/:id', scoreController.editScore);
app.delete('/api/scores/:id', scoreController.deleteScore);

// --- Draw Endpoints (§ 06, § 07) ---
app.get('/api/draws/pool', drawController.getCurrentPool);
app.get('/api/draws/history', drawController.getPastDraws);
app.post('/api/draws/simulate', drawController.simulate);
app.post('/api/draws/publish', drawController.publish);

// --- Charities Endpoints (§ 08) ---
app.get('/api/charities', charityController.getCharities);
app.post('/api/charities', charityController.createCharity);
app.put('/api/charities/:id', charityController.updateCharity);
app.delete('/api/charities/:id', charityController.deleteCharity);

// --- Winner Verification (§ 09) ---
app.get('/api/winners/my-claims', winnerController.getMyClaims);
app.post('/api/winners/upload-proof/:claimId', winnerController.uploadProof);
app.get('/api/winners/all', winnerController.getAllClaims);
app.put('/api/winners/verify/:claimId', winnerController.verifyClaim);

// --- User Profile & Admin (§ 10, § 11) ---
app.get('/api/user/profile', userController.getProfile);
app.put('/api/user/profile', userController.updateProfile);
app.get('/api/admin/stats', userController.getAdminStats);

app.listen(PORT, () => {
  console.log(`Digital Heroes Backend Server listening on http://localhost:${PORT}`);
});
