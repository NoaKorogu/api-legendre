const fs = require('fs');
const path = require('path');

module.exports = (req, res, next) => {
  const log = `${new Date().toISOString()} | ${req.method} ${req.originalUrl} | User: ${req.user?.username || 'Guest'}\n`;

  fs.appendFile(path.join(__dirname, '../logs.txt'), log, err => {
    if (err) console.error('Erreur log:', err);
  });

  next();
};
