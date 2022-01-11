const { weetCreate } = require('../services/weets');
const { weetSerializer, weetsSerializer } = require('../serializer/weets');
const { weetCreateMapper } = require('../mappers/weets');
const { getSentence } = require('../services/numbers');
const { paginationMapper } = require('../mappers/pagination');
const { paginationSerializer } = require('../serializer/pagination');
const { weetFindAll } = require('../services/weets');
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

exports.getWeets = async (req, res, next) => {
  const { query } = req;
  try {
    const pagination = paginationMapper(query);
    const weets = await weetFindAll(pagination);
    return res.status(200).send({
      page: weetsSerializer(weets.rows),
      ...paginationSerializer({ count: weets.count, ...query })
    });
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};
