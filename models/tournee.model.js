const pool = require('../config/db');

exports.findAll = async (userId = null, userRole = null) => {
  const connection = await pool.getConnection();
  try {
    let query = 'SELECT * FROM tournees';
    let params = [];
    if (userRole === 'chauffeur') {
      query += ' WHERE chauffeur_id = ?';
      params = [userId];
    }
    const [rows] = await connection.query(query, params);
    return rows;
  } finally {
    connection.release();
  }
};

exports.findById = async (id, userId = null) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM tournees WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  } finally {
    connection.release();
  }
};

exports.create = async (data, userId = null) => {
  const connection = await pool.getConnection();
  try {

    
    // Validate chauffeur_id exists
    const [chauffeur_idCheck] = await connection.query('SELECT id FROM chauffeurs WHERE id = ?', [data.chauffeur_id]);
    if (chauffeur_idCheck.length === 0) {
      throw new Error('chauffeur_id invalide ou inexistant');
    }

    const fields = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);
    
    const [result] = await connection.query(
      `INSERT INTO tournees (${fields}) VALUES (${placeholders})`,
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

    // Validate chauffeur_id if provided
    if (data.chauffeur_id) {
      const [chauffeur_idCheck] = await connection.query('SELECT id FROM chauffeurs WHERE id = ?', [data.chauffeur_id]);
      if (chauffeur_idCheck.length === 0) {
        throw new Error('chauffeur_id invalide ou inexistant');
      }
    }

    const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(data), id];

    await connection.query(
      `UPDATE tournees SET ${fields} WHERE id = ?`,
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

    await connection.query('DELETE FROM tournees WHERE id = ?', [id]);
    return existing;
  } finally {
    connection.release();
  }
};
