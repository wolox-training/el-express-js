const request = require('../helpers/request');
const {
  common: { numbersApi }
} = require('../../config');
const { SERVER_ERROR } = require('../constants/errors');
const logger = require('../logger');

exports.getSentence = async () => {
  const { url } = numbersApi;
  try {
    const data = await request.get(url);
    return data.data;
  } catch (err) {
    logger.error(err);
    throw Error(SERVER_ERROR);
  }
};
