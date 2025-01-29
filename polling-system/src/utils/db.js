// src/utils/db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'polling_system',
  password: 'Avnish123',
  port: 5432,
});

const connectDB = () => {
  pool.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Error connecting to PostgreSQL', err.stack));
};

module.exports = { connectDB };
