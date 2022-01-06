const { Weet } = require('../models');
const { databaseError } = require('../errors');
const { DATABASE_ERROR } = require('../constants/errors');
const logger = require('../logger');

exports.weetCreate = async weetData => {
  try {
    const weet = await Weet.create(weetData);
    return weet;
  } catch (err) {
    logger.error(err);
    throw databaseError(DATABASE_ERROR);
  }
};
