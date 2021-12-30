const logger = require('../logger');
const { userCreate, userFindByEmail } = require('../services/users');
const { userSerializer } = require('../serializer/users');
const { userSignUpMapper, userSignInMapper } = require('../mappers/user');
const { hash, compareHash, jwtEncode } = require('../helpers/auth');
const errors = require('../errors');
const { EMAIL_EXISTS, DATABASE_ERROR, EMAIL_OR_PASSWORD_DO_NOT_MATCH } = require('../constants/errors');

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

exports.signIn = async (req, res, next) => {
  const { body } = req;
  const { email, password } = userSignInMapper(body);
  try {
    const user = await userFindByEmail(email);
    if (!user) throw errors.authenticationError(EMAIL_OR_PASSWORD_DO_NOT_MATCH);
    const comparePassword = compareHash(user.password, password);
    if (!comparePassword) throw errors.authenticationError(EMAIL_OR_PASSWORD_DO_NOT_MATCH);
    const token = jwtEncode(userSerializer(user));
    return res.status(200).send({ token });
  } catch (err) {
    return next(err);
  }
};
