const pool = require('../config/db');

exports.findAll = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM products');
    return rows;
  } finally {
    connection.release();
  }
};

exports.findById = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  } finally {
    connection.release();
  }
};

exports.create = async (data) => {
  const connection = await pool.getConnection();
  try {
    const fields = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);
    
    const [result] = await connection.query(
      `INSERT INTO products (${fields}) VALUES (${placeholders})`,
      values
    );
    
    return { id: result.insertId, ...data };
  } finally {
    connection.release();
  }
};

exports.update = async (id, data) => {
  const connection = await pool.getConnection();
  try {
    const existing = await this.findById(id);
    if (!existing) return null;

    const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(data), id];

    await connection.query(
      `UPDATE products SET ${fields} WHERE id = ?`,
      values
    );

    return { id, ...data };
  } finally {
    connection.release();
  }
};

exports.delete = async (id) => {
  const connection = await pool.getConnection();
  try {
    const existing = await this.findById(id);
    if (!existing) return null;

    await connection.query('DELETE FROM products WHERE id = ?', [id]);
    return existing;
  } finally {
    connection.release();
  }
};
