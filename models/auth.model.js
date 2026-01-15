const bcrypt = require('bcryptjs');
const pool = require('../config/db');

exports.findByUsername = async (username) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM auth_users WHERE username = ?', [username]);
    return rows.length > 0 ? rows[0] : null;
  } finally {
    connection.release();
  }
};
