const { factory } = require('factory-girl');
const Chance = require('chance');
const { factoryByModel } = require('./factory_by_models');
const { hash } = require('.././../app/helpers/auth');
const { badRequest } = require('../../app/errors');
const { responseError } = require('../helpers/errors');
const { removeProperty } = require('../helpers/body');
const {
  EMAIL_EXISTS,
  PASSWORD_INVALID,
  PASSWORD_MIN_LENGTH,
  EMAIL_REQUIRED,
  NAME_REQUIRED,
  SURNAME_REQUIRED,
  PASSWORD_REQUIRED
} = require('../../app/constants/errors');

const chance = new Chance();
factoryByModel('User');

factory.extend('User', 'UserWithHash', {
  password: hash('12345678wwwffC'),
  email: factory.sequence('User.email', n => `user.test${n}@wolox.com.co`)
});

const userFake = () => ({
  name: chance.first(),
  surname: chance.last(),
  email: chance.email({ domain: 'accenture.com' }),
  password: 'XYZ1234567789'
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
  passwordRequired: responseError(badRequest(PASSWORD_REQUIRED))
};
