const axios = require('axios');
const {
  common: { numbersApi }
} = require('../../config');
const errors = require('../errors');
const { DEFAULT_ERROR } = require('../constants/errors');
const logger = require('../logger');

exports.getSentence = async () => {
  const { url } = numbersApi;
  try {
    const data = await axios.get(url);
    return data.data;
  } catch (err) {
    logger.error(err);
    throw errors.defaultError(DEFAULT_ERROR);
  }
};
