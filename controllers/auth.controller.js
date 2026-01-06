const jwt = require('jsonwebtoken');
const Auth = require('../models/auth.model');
const SECRET_KEY = process.env.SECRET_KEY;

exports.login = (req, res) => {
  const { username, password } = req.body;

  const user = Auth.findByUsername(username);
  if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé' });

  const bcrypt = require('bcryptjs');
  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Mot de passe incorrect' });

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

  res.json({ token, username: user.username, role: user.role });
};
