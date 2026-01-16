const Sell = require('../models/sell.model');

exports.getAll = async (req, res) => {
  try {
    const items = await Sell.findAll(req.user?.id);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await Sell.findById(req.params.id, req.user?.id);
    if (!item) {
      return res.status(404).json({ message: 'sell non trouvé' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newItem = await Sell.create(req.body, req.user?.id);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Sell.update(req.params.id, req.body, req.user?.id);
    if (!updated) {
      return res.status(404).json({ message: 'sell non trouvé' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Sell.delete(req.params.id, req.user?.id);
    if (!deleted) {
      return res.status(404).json({ message: 'sell non trouvé' });
    }
    res.json({ message: 'sell supprimé', item: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
