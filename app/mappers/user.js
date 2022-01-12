exports.userSignUpMapper = data => ({
  email: data.email,
  name: data.name,
  surname: data.surname,
  password: data.password,
  role: data.role
});

exports.userSignInMapper = data => ({
  email: data.email,
  password: data.password
});
