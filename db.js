import mariadb from 'mariadb';
import 'dotenv/config';

export const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: 5,
  insertIdAsNumber: true
});

export async function getDatabaseConnection () {
  try {
      const connection = await pool.getConnection();
      console.log("Successfully established a DB connection.");
      return connection;
  } catch (error) {
      console.error("Error when connecting to the database:", error);
      throw error;
  }
}









// release it after done using it in a route or login