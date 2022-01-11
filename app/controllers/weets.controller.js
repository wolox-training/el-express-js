const { weetCreate } = require('../services/weets');
const { weetSerializer } = require('../serializer/weets');
const { weetCreateMapper } = require('../mappers/weets');
const { getSentence } = require('../services/numbers');
const logger = require('../logger');

exports.weetCreate = async (req, res, next) => {
  const { id } = req.payload;
  try {
    const weetContent = await getSentence();
    const dataWeet = weetCreateMapper({ content: weetContent, user_id: id });
    const weet = await weetCreate(dataWeet);
    return res.status(201).send(weetSerializer(weet));
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};
