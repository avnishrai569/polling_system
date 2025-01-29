const express = require('express');
const { Kafka, Partitioners } = require('kafkajs');
const WebSocketServer = require('./websocket/websocket');
const pollRoutes = require('./controllers/pollController');
const leaderboardRoutes = require('./controllers/leaderboardController');
const { connectDB } = require('./utils/db');
const kerberos = require('kerberos');


const app = express();
app.use(express.json());  // Parse JSON requests

// Setup routes
app.use('/polls', pollRoutes);
app.use('/leaderboard', leaderboardRoutes);

// Initialize WebSocket server
const wsServer = new WebSocketServer();

// Connect to PostgreSQL database
connectDB();

// Kafka setup (without SSL or SASL, adjust if necessary)
// const kafka = new Kafka({
//   clientId: 'polling-system',
//   brokers: ['localhost:9092'],
// });
const password = process.env.KAFKA_PASSWORD;
console.log('Kafka password:', password);

// const kafka = new Kafka({
//   clientId: 'polling-system',
//   brokers: ['localhost:9092'],
//   sasl: {
//     mechanism: 'PLAIN',  // Same mechanism as broker-side
//     username: process.env.KAFKA_USERNAME,  // Your SASL username
//     password: process.env.KAFKA_PASSWORD,  // Your SASL password
//   },
//   ssl: false,
// });
const kafka = new Kafka({
  clientId: 'polling-system',
  brokers: ['localhost:9092'],  // Use the PLAINTEXT port
  ssl: false, // Disable SSL
  sasl: undefined // Ensure SASL is not enabled
});


const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,  // Avoid partitioner warning
});
const consumer = kafka.consumer({ groupId: 'poll-group' });

// Kafka producer for voting
//  const sendVoteToKafka = async (vote) => {
//   try {
//     await producer.send({
//       topic: 'poll-votes',
//       messages: [{ value: JSON.stringify(vote) }],
//     });
//   } catch (err) {
//     console.error('Error sending vote to Kafka:', err);
//   }
// };
const sendVoteToKafka = async (vote) => {
  try {
    console.log('Sending vote to Kafka:', JSON.stringify(vote));
    await producer.send({
      topic: 'poll-votes',
      messages: [{ value: JSON.stringify(vote) }],
    });
    console.log('Vote sent to Kafka successfully');
  } catch (err) {
    console.error('Error sending vote to Kafka:', err);
    // Log the vote data for further debugging
    console.error('Failed vote data:', JSON.stringify(vote));
  }
};

// Kafka consumer for processing votes and updating results
const consumeVotes = async () => {
  try {
    console.log('Connecting Kafka consumer...');
    await consumer.connect();
    console.log('Kafka consumer connected');
    await consumer.subscribe({ topic: 'poll-votes', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const vote = JSON.parse(message.value.toString());
          console.log(`Vote received: ${JSON.stringify(vote)}`);
          wsServer.broadcastVoteUpdate(vote);  // Broadcast to WebSocket clients
        } catch (err) {
          console.error('Error processing vote:', err);
        }
      },
    });
    
  } catch (err) {
    console.error('Error connecting to Kafka consumer:', err);
  }
};

// Start everything
const startApp = async () => {
  try {
    await producer.connect();  // Connect producer first
    await consumeVotes();  // Start consuming votes after producer is connected
    app.listen(3000, () => {
      console.log('Server running on http://localhost:3000');
    });
  } catch (err) {
    console.error('Error starting the app:', err);
  }
};

startApp();

// const express = require('express');
// const WebSocketServer = require('./websocket/websocket');
// const pollRoutes = require('./controllers/pollController');
// const leaderboardRoutes = require('./controllers/leaderboardController');
// const { connectDB } = require('./utils/db');

// const app = express();
// app.use(express.json()); // Parse JSON requests

// // Setup routes
// app.use('/polls', pollRoutes);
// app.use('/leaderboard', leaderboardRoutes);

// // Initialize WebSocket server
// const wsServer = new WebSocketServer();

// // Connect to PostgreSQL database
// connectDB();

// // Kafka-related code disabled

// // const { Kafka, Partitioners } = require('kafkajs');
// // const kafka = new Kafka({
// //   clientId: 'polling-system',
// //   brokers: ['localhost:9092'],
// //   sasl: {
// //     mechanism: 'PLAIN',
// //     username: process.env.KAFKA_USERNAME,
// //     password: process.env.KAFKA_PASSWORD,
// //   },
// //   ssl: false,
// // });

// // const producer = kafka.producer({
// //   createPartitioner: Partitioners.LegacyPartitioner,
// // });
// // const consumer = kafka.consumer({ groupId: 'poll-group' });

// // Kafka producer for voting (disabled)
// const sendVoteToKafka = async (vote) => {
//   console.log('Kafka is disabled. Vote:', vote);
// };

// // Kafka consumer for processing votes and updating results (disabled)
// // const consumeVotes = async () => {
// //   console.log('Kafka is disabled. Consumer not started.');
// // };

// // Start everything
// const startApp = async () => {
//   try {
//     console.log('Kafka is disabled. Skipping Kafka producer and consumer setup.');
//     app.listen(3000, () => {
//       console.log('Server running on http://localhost:3000');
//     });
//   } catch (err) {
//     console.error('Error starting the app:', err);
//   }
// };

// startApp();
