const pool = require('../../config/db');

// Create a new poll
async function createPoll(title, options) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');  // Start the transaction
    
    // Insert the poll and get the poll_id
    const result = await client.query(
      'INSERT INTO polls (title) VALUES ($1) RETURNING id',
      [title]
    );
    const pollId = result.rows[0].id;  // Get the poll_id of the created poll

    // Insert each option for the poll individually
    for (const option of options) {
      await client.query(
        'INSERT INTO options (title, poll_id) VALUES ($1, $2)',
        [option, pollId]  // Insert option title with the associated poll_id
      );
    }

    await client.query('COMMIT');  // Commit the transaction
    return pollId;  // Return the poll ID after successful creation
  } catch (e) {
    await client.query('ROLLBACK');  // Rollback in case of error
    console.error('Error in createPoll:', e);
    throw e;  // Rethrow the error to be handled by the controller
  } finally {
    client.release();  // Release the client back to the pool
  }
}

// Get poll results
async function getPollResults(pollId) {
  const result = await pool.query(
    'SELECT title, votes FROM options WHERE poll_id = $1',
    [pollId]
  );
  return result.rows;
}

module.exports = {
  createPoll,
  getPollResults,
};








// // src/models/poll.js
// const { Pool } = require('pg');
// const pool = new Pool();  // PostgreSQL connection

// // Create a poll in the database
// // const createPoll = async (question, options) => {
// //   const result = await pool.query('INSERT INTO polls(question) VALUES($1) RETURNING id', [question]);
// //   const pollId = result.rows[0].id;

// //   const optionPromises = options.map(option =>
// //     pool.query('INSERT INTO options(poll_id, option_text) VALUES($1, $2)', [pollId, option])
// //   );
// //   await Promise.all(optionPromises);

// //   return { pollId, question, options };
// // };
// const createPoll = async (question, options) => {
//     try {
//       if (!question || !options || options.length < 2) {
//         throw new Error("Invalid input: Poll must have a question and at least two options.");
//       }
  
//       // Insert the poll question into the polls table
//       const result = await pool.query(
//         'INSERT INTO polls(question) VALUES($1) RETURNING id',
//         [question]
//       );
  
//       const pollId = result.rows[0].id;
  
//       // Insert poll options into the options table
//       const optionPromises = options.map((option) =>
//         pool.query(
//           'INSERT INTO options(poll_id, option_text, vote_count) VALUES($1, $2, 0)',
//           [pollId, option]
//         )
//       );
  
//       await Promise.all(optionPromises);
  
//       return { pollId, question, options };
//     } catch (error) {
//       console.error('Error creating poll:', error.message);
//       throw new Error(error.message || 'Error creating poll');
//     }
//   };
// // Record a vote and update the database
// const voteOnPoll = async (pollId, userId, optionId) => {
//   await pool.query('INSERT INTO votes(poll_id, user_id, option_id) VALUES($1, $2, $3)', [pollId, userId, optionId]);
//   await pool.query('UPDATE options SET vote_count = vote_count + 1 WHERE id = $1', [optionId]);
// };

// // Get poll results
// const getPollResults = async (pollId) => {
//   const result = await pool.query('SELECT * FROM options WHERE poll_id = $1', [pollId]);
//   return result.rows;
// };

// module.exports = { createPoll, voteOnPoll, getPollResults };
