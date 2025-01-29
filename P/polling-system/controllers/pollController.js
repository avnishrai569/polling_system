const pollService = require('../services/pollService');

// Create a poll
async function createPoll(req, res) {
  try {
    const { title, options } = req.body;
    const pollId = await pollService.createPoll(title, options);
    res.status(201).json({ pollId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating poll' });
  }
}

// Get poll results
async function getPollResults(req, res) {
  try {
    const { id } = req.params;
    const results = await pollService.getPollResults(id);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching results' });
  }
}

module.exports = {
  createPoll,
  getPollResults,
};
