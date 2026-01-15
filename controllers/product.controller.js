const Product = require('../models/product.model');

exports.getAll = async (req, res) => {
  try {
    const items = await Product.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'product non trouvé' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newItem = await Product.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Product.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'product non trouvé' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Product.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'product non trouvé' });
    }
    res.json({ message: 'product supprimé', item: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
