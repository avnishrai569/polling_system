const pool = require('../config/db');

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


// const pool = require('../config/db');

// // Create a new poll
// async function createPoll(title, options) {
//   const client = await pool.connect();
//   try {
//     await client.query('BEGIN');
//     const result = await client.query(
//       'INSERT INTO polls (title) VALUES ($1) RETURNING id',
//       [title]
//     );
//     const pollId = result.rows[0].id;

//     const insertOptions = options.map((option) => [
//       option,
//       pollId,
//     ]);
//     await client.query(
//       'INSERT INTO options (title, poll_id) VALUES ($1, $2)',
//       insertOptions
//     );

//     await client.query('COMMIT');
//     return pollId;
//   } catch (e) {
//     await client.query('ROLLBACK');
//     throw e;
//   } finally {
//     client.release();
//   }
// }

// // Get poll results
// async function getPollResults(pollId) {
//   const result = await pool.query(
//     'SELECT title, votes FROM options WHERE poll_id = $1',
//     [pollId]
//   );
//   return result.rows;
// }

// module.exports = {
//   createPoll,
//   getPollResults,
// };
