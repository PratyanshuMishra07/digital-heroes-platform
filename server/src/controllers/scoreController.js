const store = require('../config/store');
const { addScoreWithRollingLimit, validateScore } = require('../services/rollingScore');

// GET /api/scores
function getScores(req, res) {
  const userScores = store.scores
    .filter(s => s.userId === store.currentUser.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  res.json({
    scores: userScores,
    count: userScores.length,
    maxLimit: 5
  });
}

// POST /api/scores
function addScore(req, res) {
  try {
    const { score, date } = req.body;
    const userId = store.currentUser.id;

    const currentScores = store.scores.filter(s => s.userId === userId);
    const newEntry = {
      id: `sc_${Date.now()}`,
      userId,
      score: parseInt(score, 10),
      date
    };

    const { scores: updatedScores, droppedScores } = addScoreWithRollingLimit(currentScores, newEntry);

    // Update global store
    store.scores = [
      ...store.scores.filter(s => s.userId !== userId),
      ...updatedScores
    ];

    // Update subscriber list in store for draw engine
    const sub = store.subscribers.find(s => s.id === userId);
    if (sub) {
      sub.scores = updatedScores.map(s => s.score);
    }

    res.status(201).json({
      message: 'Score successfully recorded',
      scores: updatedScores,
      droppedScores
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// PUT /api/scores/:id
function editScore(req, res) {
  try {
    const { id } = req.params;
    const { score, date } = req.body;
    const userId = store.currentUser.id;

    const existingIndex = store.scores.findIndex(s => s.id === id && s.userId === userId);
    if (existingIndex === -1) {
      return res.status(404).json({ error: 'Score not found' });
    }

    validateScore(score, date);

    // Ensure date does not collide with another existing score
    const dateCollision = store.scores.some(s => s.id !== id && s.userId === userId && s.date === date);
    if (dateCollision) {
      return res.status(400).json({ error: `A score for date ${date} already exists.` });
    }

    store.scores[existingIndex] = {
      ...store.scores[existingIndex],
      score: parseInt(score, 10),
      date
    };

    store.scores.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.json({
      message: 'Score updated successfully',
      score: store.scores[existingIndex]
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// DELETE /api/scores/:id
function deleteScore(req, res) {
  const { id } = req.params;
  const userId = store.currentUser.id;

  const initialCount = store.scores.length;
  store.scores = store.scores.filter(s => !(s.id === id && s.userId === userId));

  if (store.scores.length === initialCount) {
    return res.status(404).json({ error: 'Score not found' });
  }

  res.json({ message: 'Score deleted successfully' });
}

module.exports = {
  getScores,
  addScore,
  editScore,
  deleteScore
};
