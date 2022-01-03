exports.userSerializer = user => ({
  id: user.id,
  name: user.name,
  surname: user.surname,
  email: user.email
});

exports.usersSerializer = users => ({
  total: parseInt(users.count),
  page: parseInt(users.page),
  per_page: parseInt(users.per_page),
  users: users.rows.map(user => this.userSerializer(user))
});
