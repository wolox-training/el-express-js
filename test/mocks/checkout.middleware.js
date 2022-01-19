jest.mock('../../app/middlewares/auth');
const { factory } = require('factory-girl');
const { checkAuth } = require('../../app/middlewares/auth');
const { userSerializer } = require('../../app/serializer/users');
require('../factory/user_factory');

const validationMock = (user, req, next) => {
  req.payload = userSerializer(user);
  return next();
};

checkAuth.mockImplementation(async (req, _, next) => {
  const user = await factory.create('UserWithHash');
  return validationMock(user, req, next);
});

exports.checkAuthOnce = user => (req, _, next) => validationMock(user, req, next);
