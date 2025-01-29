// src/models/leaderboard.js
const { Pool } = require('pg');
const pool = new Pool();  // PostgreSQL connection

// Get global leaderboard (top voted options across all polls)
const getLeaderboard = async () => {
  const result = await pool.query('SELECT option_text, SUM(vote_count) AS total_votes FROM options GROUP BY option_text ORDER BY total_votes DESC LIMIT 10');
  return result.rows;
};

module.exports = { getLeaderboard };
