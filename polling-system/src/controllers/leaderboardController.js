// src/controllers/leaderboardController.js
const express = require('express');
const { getLeaderboard } = require('../models/leaderboard');

const router = express.Router();

// Route to get global leaderboard
router.get('/', async (req, res) => {
  try {
    const leaderboard = await getLeaderboard();
    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching leaderboard' });
  }
});

module.exports = router;
