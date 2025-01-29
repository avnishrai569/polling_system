const pool = require('../config/db');

// Record a vote for a poll option
async function voteOnPoll(pollId, optionId) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE options SET votes = votes + 1 WHERE poll_id = $1 AND id = $2 RETURNING votes',
      [pollId, optionId]
    );
    return result.rows[0].votes;
  } catch (e) {
    throw e;
  } finally {
    client.release();
  }
}

module.exports = {
  voteOnPoll,
};
