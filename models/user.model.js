const bcrypt = require('bcryptjs');
const pool = require('../config/db');

exports.findAll = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT id, name, email, role, created_at FROM users');
    return rows;
  } finally {
    connection.release();
  }
};

exports.findById = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  } finally {
    connection.release();
  }
};

exports.findByEmail = async (email) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows.length > 0 ? rows[0] : null;
  } finally {
    connection.release();
  }
};

exports.create = async (user) => {
  const connection = await pool.getConnection();
  try {
    const { name, email, password, role = 'user' } = user;

    // Hash the password before storing
    const hashed = bcrypt.hashSync(password, 10);

    const [result] = await connection.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashed, role]);
    return { id: result.insertId, name, email, role, created_at: new Date() };
  } finally {
    connection.release();
  }
};

exports.deleteById = async (id) => {
  const connection = await pool.getConnection();
  try {
    const user = await this.findById(id);
    if (!user) return null;
    
    await connection.query('DELETE FROM users WHERE id = ?', [id]);
    return user;
  } finally {
    connection.release();
  }
};

exports.updateById = async (id, data) => {
  const connection = await pool.getConnection();
  try {
    const user = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
    if (!user || user[0].length === 0) return null;

    const existing = user[0][0];

    const fields = [];
    const values = [];

    if (data.name) { fields.push('name = ?'); values.push(data.name); }
    if (data.email) { fields.push('email = ?'); values.push(data.email); }
    if (data.role) { fields.push('role = ?'); values.push(data.role); }
    if (data.password) { fields.push('password = ?'); values.push(bcrypt.hashSync(data.password, 10)); }

    if (fields.length === 0) return { id, name: existing.name, email: existing.email, role: existing.role, created_at: existing.created_at };

    values.push(id);
    await connection.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);

    return { id, name: data.name || existing.name, email: data.email || existing.email, role: data.role || existing.role, created_at: existing.created_at };
  } finally {
    connection.release();
  }
};
