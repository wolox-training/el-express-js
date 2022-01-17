const { Rating, sequelize, User } = require('../models');
const errors = require('../errors');
const { DATABASE_ERROR } = require('../constants/errors');
const logger = require('../logger');

exports.ratingCreate = async ({ userId, weetId, score, userOwner }) => {
  let transaction = {};
  try {
    transaction = await sequelize.transaction();
    const rating = await Rating.findOne({ where: { weet_id: weetId, rating_user_id: userId } });
    const user = await User.findByPk(userOwner);
    let queryBuilder = { weet_id: weetId, rating_user_id: userId, score };
    queryBuilder = rating ? { id: rating.id, ...queryBuilder } : queryBuilder;
    const userScore = rating && score === rating.score ? 0 : score;
    const [ratingUpdatedOrCreated] = await Rating.upsert(queryBuilder, { transaction, returning: true });
    await user.increment('score', { by: userScore, transaction });
    transaction.commit();
    return ratingUpdatedOrCreated;
  } catch (err) {
    logger.error(err);
    if (transaction.rollback) await transaction.rollback();
    throw errors.databaseError(DATABASE_ERROR);
  }
};
