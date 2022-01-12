const logger = require('../logger');
const { userCreate, userFindByEmail, userFindAll, userUpdate } = require('../services/users');
const { userSerializer, usersSerializer } = require('../serializer/users');
const { paginationSerializer } = require('../serializer/pagination');
const { userSignUpMapper, userSignInMapper } = require('../mappers/user');
const { paginationMapper } = require('../mappers/pagination');
const { hash, compareHash, jwtEncode } = require('../helpers/auth');
const errors = require('../errors');
const { EMAIL_EXISTS, DATABASE_ERROR, EMAIL_OR_PASSWORD_DO_NOT_MATCH } = require('../constants/errors');
const { ADMIN_ROLE } = require('../constants/users');

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

exports.getUsers = async (req, res, next) => {
  const { query } = req;
  try {
    const pagination = paginationMapper(query);
    const users = await userFindAll(pagination);
    return res.status(200).send({
      ...paginationSerializer({ count: users.count, ...query }),
      users: usersSerializer(users.rows)
    });
  } catch (err) {
    logger.error(err.message);
    return next(err);
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
exports.createAdmin = async (req, res, next) => {
  const { body } = req;
  const userData = userSignUpMapper(body);
  try {
    const userExists = await userFindByEmail(userData.email);
    const passwordHash = hash(userData.password);
    const userAdmin = userExists
      ? await userUpdate(userExists.id, { role: ADMIN_ROLE })
      : await userCreate({ ...userData, password: passwordHash, role: ADMIN_ROLE });
    return res.status(201).send(userSerializer(userAdmin));
  } catch (err) {
    return next(err);
  }
};
