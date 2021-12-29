const { User } = require('../models');
const { databaseError } = require('../errors');
const logger = require('../logger');
const { DATABASE_ERROR } = require('../constants/errors');

exports.userCreate = async userData => {
  const user = await User.create(userData);
  return user;
};

exports.userFindByEmail = async email => {
  try {
    const user = await User.findByEmail(email);
    return user;
  } catch (err) {
    logger.error(err);
    throw databaseError(DATABASE_ERROR);
  }
};
