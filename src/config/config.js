const mysql = require('mysql2');
const { promisify } = require('util');

// Database connection configuration
const dbConfig = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10, // Adjust this limit as needed
  queueLimit: 0,
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Promisify the pool.query method to use async/await
const query = promisify(pool.query).bind(pool);

// Function to execute a database query with retry logic
async function executeQueryWithRetry(sql, params, maxRetries = 3) {
  for (let retry = 0; retry < maxRetries; retry++) {
    try {
      const result = await query(sql, params);
      return result;
    } catch (error) {
      if (error.code === 'ETIMEDOUT' && retry < maxRetries - 1) {
        // Retry the connection on ETIMEDOUT error
        console.log(`Retry attempt ${retry + 1} after ETIMEDOUT error`);
        continue;
      } else {
        throw error; // Propagate other errors
      }
    }
  }
  throw new Error(`Max retries reached. Unable to execute query.`);
}

// Example usage
async function main() {
  try {
    const result = await executeQueryWithRetry('SELECT * FROM your_table');
    console.log(result);
  } catch (error) {
    console.error(`Error executing query: ${error.message}`);
  }
}

main();
