const pollModel = require('../models/pollModel');
const voteModel = require('../models/voteModel');

// Create a poll and its options
async function createPoll(title, options) {
  return await pollModel.createPoll(title, options);
}

// Get poll results
async function getPollResults(pollId) {
  return await pollModel.getPollResults(pollId);
}

// Record a vote
async function voteOnPoll(pollId, optionId) {
  return await voteModel.voteOnPoll(pollId, optionId);
}

module.exports = {
  createPoll,
  getPollResults,
  voteOnPoll,
};
