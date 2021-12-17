const { User } = require('../models');

exports.userCreate = async userData => {
  const user = await User.create(userData);
  return user;
};

exports.userFindByEmail = async email => {
  const user = await User.findByEmail(email);
  return user;
};
