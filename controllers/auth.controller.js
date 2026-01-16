const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Auth = require('../models/auth.model');
const SECRET_KEY = process.env.SECRET_KEY;

// Login using email + password against unified `users` table
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis' });

    const user = await Auth.findByEmail(email);
    if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé' });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
