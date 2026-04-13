const pool = require('../config/db');

exports.findAll = async (userId = null, userRole = null) => {
  const connection = await pool.getConnection();
  try {
    let rows;
    if (userRole === 'client') {
      [rows] = await connection.query('SELECT * FROM livraisons WHERE client_id = ?', [userId]);
    } else {
      [rows] = await connection.query('SELECT * FROM livraisons');
    }
    return rows;
  } finally {
    connection.release();
  }
};

exports.findById = async (id, userId = null) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM livraisons WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  } finally {
    connection.release();
  }
};

exports.create = async (data, userId = null) => {
  const connection = await pool.getConnection();
  try {

    
    // Validate tournee_id exists
    const [tournee_idCheck] = await connection.query('SELECT id FROM tournees WHERE id = ?', [data.tournee_id]);
    if (tournee_idCheck.length === 0) {
      throw new Error('tournee_id invalide ou inexistant');
    }
    // Validate client_id exists
    const [client_idCheck] = await connection.query('SELECT id FROM clients WHERE id = ?', [data.client_id]);
    if (client_idCheck.length === 0) {
      throw new Error('client_id invalide ou inexistant');
    }
    // Validate adresse_id exists
    const [adresse_idCheck] = await connection.query('SELECT id FROM adresses WHERE id = ?', [data.adresse_id]);
    if (adresse_idCheck.length === 0) {
      throw new Error('adresse_id invalide ou inexistant');
    }

    const fields = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);
    
    const [result] = await connection.query(
      `INSERT INTO livraisons (${fields}) VALUES (${placeholders})`,
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

    // Validate tournee_id if provided
    if (data.tournee_id) {
      const [tournee_idCheck] = await connection.query('SELECT id FROM tournees WHERE id = ?', [data.tournee_id]);
      if (tournee_idCheck.length === 0) {
        throw new Error('tournee_id invalide ou inexistant');
      }
    }
    // Validate client_id if provided
    if (data.client_id) {
      const [client_idCheck] = await connection.query('SELECT id FROM clients WHERE id = ?', [data.client_id]);
      if (client_idCheck.length === 0) {
        throw new Error('client_id invalide ou inexistant');
      }
    }
    // Validate adresse_id if provided
    if (data.adresse_id) {
      const [adresse_idCheck] = await connection.query('SELECT id FROM adresses WHERE id = ?', [data.adresse_id]);
      if (adresse_idCheck.length === 0) {
        throw new Error('adresse_id invalide ou inexistant');
      }
    }

    const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(data), id];

    await connection.query(
      `UPDATE livraisons SET ${fields} WHERE id = ?`,
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

    await connection.query('DELETE FROM livraisons WHERE id = ?', [id]);
    return existing;
  } finally {
    connection.release();
  }
};
