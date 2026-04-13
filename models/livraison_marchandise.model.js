const pool = require('../config/db');

exports.findAll = async (userId = null) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM livraison_marchandises');
    return rows;
  } finally {
    connection.release();
  }
};

exports.findById = async (id, userId = null) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM livraison_marchandises WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  } finally {
    connection.release();
  }
};

exports.create = async (data, userId = null) => {
  const connection = await pool.getConnection();
  try {

    
    // Validate livraison_id exists
    const [livraison_idCheck] = await connection.query('SELECT id FROM livraisons WHERE id = ?', [data.livraison_id]);
    if (livraison_idCheck.length === 0) {
      throw new Error('livraison_id invalide ou inexistant');
    }
    // Validate marchandise_id exists
    const [marchandise_idCheck] = await connection.query('SELECT id FROM marchandises WHERE id = ?', [data.marchandise_id]);
    if (marchandise_idCheck.length === 0) {
      throw new Error('marchandise_id invalide ou inexistant');
    }

    const fields = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);
    
    const [result] = await connection.query(
      `INSERT INTO livraison_marchandises (${fields}) VALUES (${placeholders})`,
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

    // Validate livraison_id if provided
    if (data.livraison_id) {
      const [livraison_idCheck] = await connection.query('SELECT id FROM livraisons WHERE id = ?', [data.livraison_id]);
      if (livraison_idCheck.length === 0) {
        throw new Error('livraison_id invalide ou inexistant');
      }
    }
    // Validate marchandise_id if provided
    if (data.marchandise_id) {
      const [marchandise_idCheck] = await connection.query('SELECT id FROM marchandises WHERE id = ?', [data.marchandise_id]);
      if (marchandise_idCheck.length === 0) {
        throw new Error('marchandise_id invalide ou inexistant');
      }
    }

    const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(data), id];

    await connection.query(
      `UPDATE livraison_marchandises SET ${fields} WHERE id = ?`,
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

    await connection.query('DELETE FROM livraison_marchandises WHERE id = ?', [id]);
    return existing;
  } finally {
    connection.release();
  }
};
