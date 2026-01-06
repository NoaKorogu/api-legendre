const User = require('../models/user.model');

exports.getAllUsers = (req, res) => {
  const users = User.findAll();
  res.json(users);
};

exports.getUserById = (req, res) => {
  const user = User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  res.json(user);
};

exports.createUser = (req, res) => {
  const newUser = User.create(req.body);
  res.status(201).json(newUser);
};

exports.deleteUser = (req, res) => {
  const deletedUser = User.deleteById(req.params.id);

  if (!deletedUser) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  res.json({ message: 'Utilisateur supprimé', user: deletedUser });
};

exports.updateUser = (req, res) => {
  const updatedUser = User.updateById(req.params.id, req.body.name);

  if (!updatedUser) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  res.json(updatedUser);
};
