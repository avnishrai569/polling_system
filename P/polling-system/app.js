const express = require('express');
const bodyParser = require('body-parser');
const pollController = require('./controllers/pollController');
const leaderboardController = require('./controllers/leaderboardController');
const pollService = require('./services/pollService')
const wss = require('./sockets/pollSocket');
const pool = require('./config/db'); // Import the database connection
const app = express();

app.use(bodyParser.json());

// Poll routes
app.post('/polls', pollController.createPoll);
app.get('/polls/:id', pollController.getPollResults);
app.post('/polls/:id/vote', async (req, res) => {
  const { id } = req.params;
  const { optionId } = req.body;
  const votes = await pollService.voteOnPoll(id, optionId);
  wss.clients.forEach((client) => {
    client.send(JSON.stringify({ pollId: id, votes }));
  });
  res.status(200).json({ votes });
});

// Leaderboard routes
app.get('/leaderboard', leaderboardController.getLeaderboard);

app.listen(3000, async () => {
  try {
    // Test database connection with a simple query
    await pool.query('SELECT NOW()');
    console.log('Server running on http://localhost:3000');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});


// const express = require('express');
// const bodyParser = require('body-parser');
// const pollController = require('./controllers/pollController');
// const leaderboardController = require('./controllers/leaderboardController');
// const wss = require('./sockets/pollSocket');
// const app = express();

// app.use(bodyParser.json());

// // Poll routes
// app.post('/polls', pollController.createPoll);
// app.get('/polls/:id', pollController.getPollResults);
// app.post('/polls/:id/vote', async (req, res) => {
//   const { id } = req.params;
//   const { optionId } = req.body;
//   const votes = await pollService.voteOnPoll(id, optionId);
//   wss.clients.forEach((client) => {
//     client.send(JSON.stringify({ pollId: id, votes }));
//   });
//   res.status(200).json({ votes });
// });

// // Leaderboard routes
// app.get('/leaderboard', leaderboardController.getLeaderboard);

// app.listen(3000, () => {
//   console.log('Server running on http://localhost:3000');
// });
