const pool = require('../config/db');

exports.findByEmail = async (email) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows.length > 0 ? rows[0] : null;
  } finally {
    connection.release();
  }
};
