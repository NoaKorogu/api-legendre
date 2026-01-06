let users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

exports.findAll = () => {
  return users;
};

exports.findById = (id) => {
  return users.find(u => u.id === Number(id));
};

exports.create = (user) => {
  const newUser = {
    id: users.length + 1,
    ...user
  };
  users.push(newUser);
  return newUser;
};

exports.deleteById = (id) => {
  const index = users.findIndex(u => u.id === Number(id));

  if (index === -1) return null;

  const deleted = users[index];
  users.splice(index, 1);
  return deleted;
};

exports.updateById = (id, name) => {
  const user = users.find(u => u.id === Number(id));
  if (!user) return null;

  user.name = name;
  return user;
};
