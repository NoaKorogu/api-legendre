const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) return res.status(401).json({ message: 'Token manquant' });

  const token = authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) return res.status(401).json({ message: 'Token manquant' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};
