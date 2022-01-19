const Chance = require('chance');
const { factory } = require('factory-girl');
const { factoryByModel } = require('./factory_by_models');
const { badRequest } = require('../../app/errors');
const { SCORE_RANGE_INVALID, WEET_DOES_NOT_EXIST } = require('../../app/constants/errors');
const { responseError } = require('../helpers/errors');

const chance = new Chance();
require('./user_factory');

factoryByModel('Weet');

const weetFake = () => ({
  content: chance.string({ alpha: true, length: 140, casing: 'lower' })
});

const weetFakeContentError = () => ({
  content: chance.string({ alpha: true, length: 200, casing: 'lower' })
});

exports.defaultUser = async () => {
  const user = await factory.create('UserWithHash');
  return user;
};

factory.extend('Weet', 'WeetNew', {
  content: chance.string({ alpha: true, length: 140, casing: 'lower' }),
  user_id: factory.assoc('UserWithHash', 'id')
});
exports.weetData = {
  newWeet: weetFake(),
  weetContentError: weetFakeContentError()
};

exports.weetErrors = {
  scoreInvalidRange: responseError(badRequest(SCORE_RANGE_INVALID)),
  weetDoesNotExist: responseError(badRequest(WEET_DOES_NOT_EXIST))
};
