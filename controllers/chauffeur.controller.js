const Chauffeur = require('../models/chauffeur.model');

exports.getAll = async (req, res) => {
  try {
    const items = await Chauffeur.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await Chauffeur.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'chauffeur non trouvé' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newItem = await Chauffeur.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Chauffeur.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'chauffeur non trouvé' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Chauffeur.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'chauffeur non trouvé' });
    }
    res.json({ message: 'chauffeur supprimé', item: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getTournees = async (req, res) => {
  try {
    const connection = await require('../config/db').getConnection();
    const [rows] = await connection.query('SELECT * FROM tournees WHERE chauffeur_id = ?', [req.params.id]);
    connection.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
