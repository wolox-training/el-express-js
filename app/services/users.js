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

exports.userFindAll = async ({ limit, offset }) => {
  try {
    const queryBuilder = { limit, offset };
    const users = await User.findAndCountAll(queryBuilder);
    return users;
  } catch (err) {
    logger.error(err);
    throw databaseError(DATABASE_ERROR);
  }
};

exports.userUpdate = async (id, userData) => {
  const queryBuilder = {
    where: { id },
    returning: true,
    plain: true
  };
  try {
    const [, user] = await User.update(userData, queryBuilder);
    return user;
  } catch (err) {
    logger.error(err);
    throw databaseError(DATABASE_ERROR);
  }
};

exports.userFindByPk = id => {
  try {
    return User.findByPk(id);
  } catch (err) {
    logger.error(err);
    throw databaseError(DATABASE_ERROR);
  }
};
