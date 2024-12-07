import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_AUTH,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const sql = async (query: string, params?: any[]) => {
  const [rows] = await pool.execute(query, params);
  return rows;
};
