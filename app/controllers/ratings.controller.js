const { ratingCreate } = require('../services/ratings');
const { weetFindByPk } = require('../services/weets');
const { WEET_DOES_NOT_EXIST } = require('../constants/errors');
const errors = require('../errors');
const { ratingSerializer } = require('../serializer/ratings');

exports.ratingWeet = async (req, res, next) => {
  const {
    params: { id: weetId },
    body: { score },
    payload: { id: userId }
  } = req;
  try {
    const weetExists = await weetFindByPk(weetId);
    if (!weetExists) throw errors.badRequest(WEET_DOES_NOT_EXIST);
    const { user_id: userOwner } = weetExists;
    const rating = await ratingCreate({ userId, weetId, score, userOwner });
    return res.status(201).send(ratingSerializer(rating));
  } catch (err) {
    return next(err);
  }
};
