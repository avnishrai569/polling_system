const { Pool } = require('pg');

// Database connection setup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'polling_system',
  password: 'Avnish123',
  port: 5432,
});

pool.on('connect', () => {
  console.log('Database connected successfully');
});

pool.on('error', (err) => {
  console.error('Error connecting to the database:', err);
});

module.exports = pool;
