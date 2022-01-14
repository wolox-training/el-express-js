exports.userSerializer = user => ({
  id: user.id,
  name: user.name,
  surname: user.surname,
  email: user.email,
  score: user.score,
  position: user.position,
  role: user.role
});

exports.usersSerializer = users => users.map(user => this.userSerializer(user));
