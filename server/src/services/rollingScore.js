/**
 * Score Management Service
 * Implements PRD Section § 05:
 * - Stableford format: Score range strictly 1 to 45
 * - One score entry permitted per date (no duplicate dates)
 * - Retains strictly the latest 5 scores (rolling window)
 * - Reverse chronological order (newest date first)
 */

function validateScore(score, date) {
  if (typeof score !== 'number' || isNaN(score)) {
    throw new Error('Score must be a valid number.');
  }

  if (!Number.isInteger(score) || score < 1 || score > 45) {
    throw new Error('Stableford score must be an integer between 1 and 45.');
  }

  if (!date || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('Date must be a valid string in YYYY-MM-DD format.');
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new Error('Invalid calendar date.');
  }
}

/**
 * Adds a new score and enforces the rolling 5-score limit
 * @param {Array<{id?: string, score: number, date: string}>} existingScores
 * @param {{score: number, date: string, id?: string}} newScore
 * @returns {{ scores: Array<{score: number, date: string}>, droppedScores: Array<Object> }}
 */
function addScoreWithRollingLimit(existingScores = [], newScore) {
  validateScore(newScore.score, newScore.date);

  // Check duplicate date
  const dateExists = existingScores.some(s => s.date === newScore.date);
  if (dateExists) {
    throw new Error(`Only one score permitted per date. Duplicate score for ${newScore.date} is not allowed. Please edit or delete the existing entry.`);
  }

  // Create new list and sort descending by date (newest first)
  const combined = [...existingScores, newScore];
  combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Keep strictly the latest 5 scores
  const keptScores = combined.slice(0, 5);
  const droppedScores = combined.slice(5);

  return {
    scores: keptScores,
    droppedScores: droppedScores
  };
}

module.exports = {
  validateScore,
  addScoreWithRollingLimit
};
