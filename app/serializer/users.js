exports.userSerializer = user => ({
  id: user.id,
  name: user.name,
  surname: user.surname,
  email: user.email
});

exports.usersSerializer = users => users.map(user => this.userSerializer(user));
