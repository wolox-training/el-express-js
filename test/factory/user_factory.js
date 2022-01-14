const { factory } = require('factory-girl');
const Chance = require('chance');
const { factoryByModel } = require('./factory_by_models');
const { hash } = require('.././../app/helpers/auth');
const { badRequest, authenticationError } = require('../../app/errors');
const { responseError } = require('../helpers/errors');
const { removeProperty } = require('../helpers/body');
const {
  EMAIL_EXISTS,
  PASSWORD_INVALID,
  PASSWORD_MIN_LENGTH,
  EMAIL_REQUIRED,
  NAME_REQUIRED,
  SURNAME_REQUIRED,
  PASSWORD_REQUIRED,
  EMAIL_OR_PASSWORD_DO_NOT_MATCH,
  TOKEN_INVALID,
  TOKEN_REQUIRED,
  PAGE_REQUIRED,
  PAGE_NUMERIC,
  PER_PAGE_REQUIRED,
  PER_PAGE_NUMERIC
} = require('../../app/constants/errors');

const chance = new Chance();
factoryByModel('User');
exports.defaultPassword = 'XYZ1234567789';

factory.extend('User', 'UserWithHash', {
  password: hash(exports.defaultPassword),
  email: factory.sequence('User.email', n => `user.test${n}@wolox.com.co`),
  score: chance.integer({ min: 0, max: 100 })
});

const userFake = () => ({
  name: chance.first(),
  surname: chance.last(),
  email: chance.email({ domain: 'accenture.com' }),
  password: exports.defaultPassword
});

const newUser = userFake();
exports.userData = {
  newUser,
  responseWhenUserIsCreated: {
    surname: newUser.surname,
    name: newUser.name,
    email: newUser.email
  },
  userPasswordNumeric: {
    ...userFake(),
    password: '123456789000'
  },
  userPasswordMinLength: {
    ...userFake(),
    password: 'ww123'
  },
  userPasswordAlphabetic: {
    ...userFake(),
    password: 'abcdefghijkl'
  },
  userWithoutEmail: removeProperty('email')(userFake()),
  userWithoutName: removeProperty('name')(userFake()),
  userWithoutSurname: removeProperty('surname')(userFake()),
  userWithoutPassword: removeProperty('password')(userFake()),
  userWithoutParameters: {}
};

exports.userErrors = {
  emailExists: responseError(badRequest(EMAIL_EXISTS)),
  passwordInvalid: responseError(badRequest(PASSWORD_INVALID)),
  passwordMinLength: responseError(badRequest(PASSWORD_MIN_LENGTH)),
  emailRequired: responseError(badRequest(EMAIL_REQUIRED)),
  nameRequired: responseError(badRequest(NAME_REQUIRED)),
  surnameRequired: responseError(badRequest(SURNAME_REQUIRED)),
  passwordRequired: responseError(badRequest(PASSWORD_REQUIRED)),
  emailOrPassworDontMatch: responseError(authenticationError(EMAIL_OR_PASSWORD_DO_NOT_MATCH)),
  tokenInvalid: responseError(authenticationError(TOKEN_INVALID)),
  tokenRequired: responseError(authenticationError(TOKEN_REQUIRED)),
  pageRequired: responseError(badRequest(PAGE_REQUIRED)),
  pageNumeric: responseError(badRequest(PAGE_NUMERIC)),
  perPageRequired: responseError(badRequest(PER_PAGE_REQUIRED)),
  perPageNumeric: responseError(badRequest(PER_PAGE_NUMERIC))
};
