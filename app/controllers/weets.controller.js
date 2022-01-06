const { weetCreate } = require('../services/weets');
const { weetSerializer } = require('../serializer/weets');
const { weetCreateMapper } = require('../mappers/weets');
const { getSentence } = require('../services/numbers');
const { maxLength } = require('../helpers/validation');
const { DEFAULT_ERROR } = require('../constants/errors');
const {
  common: { weets }
} = require('../../config');
const errors = require('../errors');
const logger = require('../logger');

exports.weetCreate = async (req, res, next) => {
  const { id } = req.payload;
  try {
    const weetContent = await getSentence();
    if (!maxLength(weetContent, weets.contentMaxLength)) throw errors.defaultError(DEFAULT_ERROR);
    const dataWeet = weetCreateMapper({ content: weetContent, user_id: id });
    const weet = await weetCreate(dataWeet);
    return res.status(201).send(weetSerializer(weet));
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};
