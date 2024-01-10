import { createPool } from "mysql2/promise";
import config from "../config.js";

/*const connection = createPool({
  user: config.user,
  password: config.password,
  host: config.host,
  port: config.port,
  database: config.database,
});

export const getConnection = () => connection;
*/

let pool;

const createConnectionPool = () => {
  if (!pool) {
    pool = createPool({
      user: config.user,
      password: config.password,
      host: config.host,
      port: config.port,
      database: config.database,
    });
  }
  return pool;
};

const getConnection = () => createConnectionPool();

const closeConnection = async () => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};

export { getConnection, closeConnection };
