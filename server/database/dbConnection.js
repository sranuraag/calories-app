const { Client } = require("pg");
const { logger } = require("../utils");

let pgConnection = null;

const pgConnectionPool = () => {
  try {
    logger.info("Inside pgConnectionPool.");
    if (pgConnection == null) {
      let conf = {
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD,
        port: process.env.PG_PORT,
      };
      pgConnection = new Client(conf);
      pgConnection.connect();
    }
    return pgConnection;
  } catch (error) {
    logger.error("Error in pgConnectionPool.");
    console.log(error);
    return null;
  }
};

// Used for executing all DB queries 
const executeQuery = async (query) => {
  try {
    logger.info("Inside executeQuery.");
    const client = pgConnectionPool();
    const result = await client.query(query);
    return result.rows;
  } catch (error) {
    logger.error("Error in executeQuery.");
    console.log(error);
    throw new Error(); 
  }
};

module.exports = {
  executeQuery,
};
