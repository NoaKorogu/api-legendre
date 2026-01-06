const bcrypt = require('bcryptjs');

// Users statiques
let users = [
  {
    id: 1,
    username: 'admin',
    password: bcrypt.hashSync('admin123', 8),
    role: 'admin'
  },
  {
    id: 2,
    username: 'user',
    password: bcrypt.hashSync('user123', 8),
    role: 'user'
  }
];

exports.findByUsername = (username) => {
  return users.find(u => u.username === username);
};
