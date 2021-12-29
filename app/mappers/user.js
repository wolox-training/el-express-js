exports.userSignUpMapper = data => ({
  email: data.email,
  name: data.name,
  surname: data.surname,
  password: data.password
});

exports.userSignInMapper = data => ({
  email: data.email,
  password: data.password
});
