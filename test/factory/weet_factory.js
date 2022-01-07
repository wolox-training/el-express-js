const Chance = require('chance');
const { factory } = require('factory-girl');
const { factoryByModel } = require('./factory_by_models');

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
