// src/controllers/pollController.js
const express = require('express');
const { createPoll, voteOnPoll, getPollResults } = require('../models/poll');
const { sendVoteToKafka } = require('../app');  // Kafka producer

const router = express.Router();

// Route to create a poll
router.post('/', async (req, res) => {
  const { question, options } = req.body;
  try {
    const poll = await createPoll(question, options);
    res.status(201).json({poll});
  } catch (error) {
    res.status(500).json({ error: 'Error creating poll' });
  }
});

// Route to vote on a poll
router.post('/:id/vote', async (req, res) => {
  const { id } = req.params;
  const { userId, optionId } = req.body;

  try {
    // Send vote to Kafka for processing
    await sendVoteToKafka({ pollId: id, userId, optionId });
    res.status(200).json({ message: 'Vote received' });
  } catch (error) {
    res.status(500).json({ error: 'Error processing vote' });
  }
});

// Route to get poll results
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const results = await getPollResults(id);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching poll results' });
  }
});

module.exports = router;
