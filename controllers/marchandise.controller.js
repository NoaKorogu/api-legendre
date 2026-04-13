const Marchandise = require('../models/marchandise.model');

exports.getAll = async (req, res) => {
  try {
    const items = await Marchandise.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await Marchandise.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'marchandise non trouvé' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newItem = await Marchandise.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Marchandise.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'marchandise non trouvé' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Marchandise.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'marchandise non trouvé' });
    }
    res.json({ message: 'marchandise supprimé', item: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
