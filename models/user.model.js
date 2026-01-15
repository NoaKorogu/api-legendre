const pool = require('../config/db');

exports.findAll = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM users');
    return rows;
  } finally {
    connection.release();
  }
};

exports.findById = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  } finally {
    connection.release();
  }
};

exports.create = async (user) => {
  const connection = await pool.getConnection();
  try {
    const { name } = user;
    const [result] = await connection.query('INSERT INTO users (name) VALUES (?)', [name]);
    return { id: result.insertId, name, created_at: new Date() };
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

exports.updateById = async (id, name) => {
  const connection = await pool.getConnection();
  try {
    const user = await this.findById(id);
    if (!user) return null;
    
    await connection.query('UPDATE users SET name = ? WHERE id = ?', [name, id]);
    return { id, name, created_at: user.created_at };
  } finally {
    connection.release();
  }
};
