const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Auth = require('../models/auth.model');
const SECRET_KEY = process.env.SECRET_KEY;

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Auth.findByUsername(username);
    if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé' });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token, username: user.username, role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
