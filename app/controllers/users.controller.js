const logger = require('../logger');
const { userCreate, userFindByEmail } = require('../services/users');
const { userSerializer } = require('../serializer/users');
const { userSignUpMapper } = require('../mappers/user');
const { hash } = require('../helpers/auth');
const errors = require('../errors');
const { EMAIL_EXISTS, DATABASE_ERROR } = require('../constants/errors');

exports.signUp = async (req, res, next) => {
  const { body } = req;
  const { email, password, name, surname } = userSignUpMapper(body);
  try {
    const userExists = await userFindByEmail(email);
    if (userExists) return next(errors.badRequest(EMAIL_EXISTS));
    const passwordHash = hash(password);
    const user = await userCreate({ name, surname, email, password: passwordHash });
    logger.info({ msg: `user ${user.name} was created succesfully` });
    return res.status(201).send(userSerializer(user));
  } catch (err) {
    logger.error(err.message);
    return next(errors.databaseError(DATABASE_ERROR));
  }
};
