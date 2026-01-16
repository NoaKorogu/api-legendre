module.exports = function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Non authentifié' });

    const userRole = req.user.role;
    if (!userRole) return res.status(403).json({ message: 'Accès refusé' });

    if (allowedRoles.length === 0) return next();

    if (allowedRoles.includes(userRole)) return next();

    return res.status(403).json({ message: 'Accès refusé' });
  };
};
