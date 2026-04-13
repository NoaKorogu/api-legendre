const Livraison = require('../models/livraison.model');

exports.getAll = async (req, res) => {
  try {
    const items = await Livraison.findAll(req.user?.id, req.user?.role);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await Livraison.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'livraison non trouvé' });
    }
    // Check access
    if (req.user?.role === 'client' && item.client_id !== req.user.id) {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    if (req.user?.role === 'chauffeur') {
      // Check if the livraison's tournee belongs to the chauffeur
      const connection = await require('../config/db').getConnection();
      const [rows] = await connection.query('SELECT chauffeur_id FROM tournees WHERE id = ?', [item.tournee_id]);
      connection.release();
      if (rows.length === 0 || rows[0].chauffeur_id !== req.user.id) {
        return res.status(403).json({ message: 'Accès refusé' });
      }
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newItem = await Livraison.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Livraison.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'livraison non trouvé' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Livraison.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'livraison non trouvé' });
    }
    res.json({ message: 'livraison supprimé', item: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.updateStatut = async (req, res) => {
  try {
    const { statut } = req.body;
    const validStatuts = ['en_attente', 'en_cours', 'livree', 'echouee'];
    if (!validStatuts.includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }
    const connection = await require('../config/db').getConnection();
    await connection.query('UPDATE livraisons SET statut = ? WHERE id = ?', [statut, req.params.id]);
    connection.release();
    res.json({ message: 'Statut mis à jour', statut });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
