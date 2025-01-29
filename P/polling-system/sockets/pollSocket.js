const WebSocket = require('ws');
const pollService = require('../services/pollService');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  // Listen for poll updates and send data
  ws.on('message', async (message) => {
    const { pollId } = JSON.parse(message);
    const results = await pollService.getPollResults(pollId);
    ws.send(JSON.stringify({ pollId, results }));
  });
});

module.exports = wss;
