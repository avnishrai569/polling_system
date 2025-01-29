// src/websocket.js
const WebSocket = require('ws');

class WebSocketServer {
  constructor() {
    this.wss = new WebSocket.Server({ port: 8080 });  // WebSocket server runs on port 8080
    this.clients = [];
    this.wss.on('connection', this.onConnection.bind(this));
  }

  // Handle new WebSocket connections
  onConnection(ws) {
    this.clients.push(ws);
    ws.on('close', () => this.onClose(ws));
  }

  // Remove closed connections from clients list
  onClose(ws) {
    this.clients = this.clients.filter(client => client !== ws);
  }

  // Broadcast vote updates to all connected clients
  broadcastVoteUpdate(vote) {
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(vote));
      }
    });
  }
}

module.exports = WebSocketServer;
