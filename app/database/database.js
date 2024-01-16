import { createPool } from "mysql2/promise";
import config from "../config.js";
//
import mysql from 'mysql2/promise';

//let pool;

/*try {
  const pool = mysql.createPool({
    // ...
    host: 'db.id.ap-southeast-2.rds.amazonaws.com',
    ssl: 'Amazon RDS',
  });
  const connection = await pool.getConnection();
  // ... some query

  connection.release();
} catch (err) {
  console.log(err);
}*/

/*const createConnectionPool = () => {
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
};*/

const createConnectionPool = async () => {
  try {
    const pool = mysql.createPool({
      user: config.user,
      password: config.password,
      host: config.host,
      port: config.port,
      database: config.database,
    });
    const connection = await pool.getConnection();
    // ... some query
  
    connection.release();
    return {connection, pool};
  } catch (err) {
    console.log(err);
  }
}

const getConnection = () => createConnectionPool();

const closeConnection = async () => {
  //if (pool) {
    //await pool.end();
    //pool = null;
  //}
};

export { getConnection, closeConnection };
