const pollModel = require('../models/pollModel');
const pool = require('../config/db'); // Import pool from the db configuration file


// Get leaderboard (top poll options across all polls)
async function getLeaderboard() {
  // const result = await pollModel.query(
  //   'SELECT title, votes FROM options ORDER BY votes DESC LIMIT 10'
  // );
  // return result.rows;
  try {
    const result = await pool.query(
      'SELECT title, votes FROM options ORDER BY votes DESC LIMIT 10'
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw new Error('Error fetching leaderboard');
  }
}

module.exports = {
  getLeaderboard,
};
