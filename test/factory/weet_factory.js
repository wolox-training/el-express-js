const Chance = require('chance');

const chance = new Chance();

const weetFake = () => ({
  content: chance.string({ alpha: true, length: 140, casing: 'lower' })
});

const weetFakeContentError = () => ({
  content: chance.string({ alpha: true, length: 200, casing: 'lower' })
});

exports.weetData = {
  newWeet: weetFake(),
  weetContentError: weetFakeContentError()
};
