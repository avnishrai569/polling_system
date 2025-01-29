// const leaderboardService = require('../services/leaderboardService');

// // Get leaderboard
// async function getLeaderboard(req, res) {
//   try {
//     const leaderboard = await leaderboardService.getLeaderboard();
//     res.status(200).json(leaderboard);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching leaderboard' });
//   }
// }

// module.exports = {
//   getLeaderboard,
// };

const leaderboardService = require('../services/leaderboardService');

// Get leaderboard
async function getLeaderboard(req, res) {
  try {
    const leaderboard = await leaderboardService.getLeaderboard();
    res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Error in leaderboard controller:', error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
}

module.exports = {
  getLeaderboard,
};
