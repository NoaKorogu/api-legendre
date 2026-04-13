const Tournee = require('../models/tournee.model');

exports.getAll = async (req, res) => {
  try {
    const items = await Tournee.findAll(req.user?.id, req.user?.role);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await Tournee.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'tournee non trouvé' });
    }
    // Check access
    if (req.user?.role === 'chauffeur' && item.chauffeur_id !== req.user.id) {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newItem = await Tournee.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Tournee.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'tournee non trouvé' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Tournee.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'tournee non trouvé' });
    }
    res.json({ message: 'tournee supprimé', item: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getLivraisons = async (req, res) => {
  try {
    const connection = await require('../config/db').getConnection();
    const [rows] = await connection.query('SELECT * FROM livraisons WHERE tournee_id = ?', [req.params.id]);
    connection.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
