const pool = require('../config/db');
const bcrypt = require('bcryptjs');

exports.register = async (data) => {
  const connection = await pool.getConnection();
  try {
    const { nom, prenom, email, telephone, password, role } = data;
    const hashed = bcrypt.hashSync(password, 10);
    const table = role === 'chauffeur' ? 'chauffeurs' : 'clients';

    // prenom n'existe pas dans clients
    if (role === 'chauffeur') {
      const [result] = await connection.query(
        'INSERT INTO chauffeurs (nom, prenom, email, telephone, password, role) VALUES (?, ?, ?, ?, ?, ?)',
        [nom, prenom, email, telephone, hashed, 'chauffeur']
      );
      return { id: result.insertId, nom, prenom, email, role: 'chauffeur' };
    } else {
      const [result] = await connection.query(
        'INSERT INTO clients (nom, email, telephone, password, role) VALUES (?, ?, ?, ?, ?)',
        [nom, email, telephone, hashed, 'client']
      );
      return { id: result.insertId, nom, email, role: 'client' };
    }
  } finally {
    connection.release();
  }
};

exports.findByEmail = async (email) => {
  const connection = await pool.getConnection();
  try {
    // Cherche d'abord dans chauffeurs
    const [chauffeurs] = await connection.query('SELECT id, nom, prenom, email, telephone, password, role FROM chauffeurs WHERE email = ?', [email]);
    if (chauffeurs.length > 0) return chauffeurs[0];

    // Sinon dans clients
    const [clients] = await connection.query('SELECT id, nom, email, telephone, password, role FROM clients WHERE email = ?', [email]);
    if (clients.length > 0) return clients[0];

    return null;
  } finally {
    connection.release();
  }
};