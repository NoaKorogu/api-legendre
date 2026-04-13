const Livraison_marchandise = require('../models/livraison_marchandise.model');

exports.getAll = async (req, res) => {
  try {
    const items = await Livraison_marchandise.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await Livraison_marchandise.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'livraison_marchandise non trouvé' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newItem = await Livraison_marchandise.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Livraison_marchandise.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'livraison_marchandise non trouvé' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Livraison_marchandise.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'livraison_marchandise non trouvé' });
    }
    res.json({ message: 'livraison_marchandise supprimé', item: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
