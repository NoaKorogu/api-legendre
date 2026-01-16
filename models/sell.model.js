const pool = require('../config/db');

exports.findAll = async (userId = null) => {
  const connection = await pool.getConnection();
  try {
    let query = 'SELECT * FROM sells WHERE user_id = ?';
    const [rows] = await connection.query(query, [userId]);
    return rows;
  } finally {
    connection.release();
  }
};

exports.findById = async (id, userId = null) => {
  const connection = await pool.getConnection();
  try {
    let query = 'SELECT * FROM sells WHERE id = ? AND user_id = ?';
    const [rows] = await connection.query(query, [id, userId]);
    return rows.length > 0 ? rows[0] : null;
  } finally {
    connection.release();
  }
};

exports.create = async (data, userId = null) => {
  const connection = await pool.getConnection();
  try {
    // Auto-fill user_id from authenticated user
    data.user_id = userId;
    // Auto-set sells_date to current date
    data.sells_date = new Date().toISOString().split('T')[0];
    
    // Validate product_id exists
    const [product_idCheck] = await connection.query('SELECT id FROM products WHERE id = ?', [data.product_id]);
    if (product_idCheck.length === 0) {
      throw new Error('product_id invalide ou inexistant');
    }

    const fields = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);
    
    const [result] = await connection.query(
      `INSERT INTO sells (${fields}) VALUES (${placeholders})`,
      values
    );
    
    return { id: result.insertId, ...data };
  } finally {
    connection.release();
  }
};

exports.update = async (id, data, userId = null) => {
  const connection = await pool.getConnection();
  try {
    const existing = await this.findById(id, userId);
    if (!existing) return null;
    
    // Auto-set sells_date to current date on update
    data.sells_date = new Date().toISOString().split('T')[0];

    // Validate product_id if provided
    if (data.product_id) {
      const [product_idCheck] = await connection.query('SELECT id FROM products WHERE id = ?', [data.product_id]);
      if (product_idCheck.length === 0) {
        throw new Error('product_id invalide ou inexistant');
      }
    }

    const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(data), id];

    await connection.query(
      `UPDATE sells SET ${fields} WHERE id = ?`,
      values
    );

    return { id, ...data };
  } finally {
    connection.release();
  }
};

exports.delete = async (id, userId = null) => {
  const connection = await pool.getConnection();
  try {
    const existing = await this.findById(id, userId);
    if (!existing) return null;

    await connection.query('DELETE FROM sells WHERE id = ?', [id]);
    return existing;
  } finally {
    connection.release();
  }
};
