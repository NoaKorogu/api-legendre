const UserModel = require('../models/user.model');

test('create adds a new user and returns it', () => {
  const before = UserModel.findAll().length;
  const newUser = { name: 'Charlie' };
  const created = UserModel.create(newUser);

  expect(created).toHaveProperty('id');
  expect(created.name).toBe('Charlie');
  const after = UserModel.findAll();
  expect(after.length).toBe(before + 1);
  expect(after.find(u => u.id === created.id)).toEqual(created);
});