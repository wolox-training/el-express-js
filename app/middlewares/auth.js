const logger = require('../logger');
const errors = require('../errors');
const { TOKEN_INVALID, TOKEN_REQUIRED, TOKEN_EXPIRED } = require('../constants/errors');
const { validateJwt } = require('../helpers/auth');
const { userFindByPk } = require('../services/users');

exports.checkAuth = async (req, _, next) => {
  const { authorization } = req.headers;
  try {
    if (!authorization) throw errors.authenticationError(TOKEN_REQUIRED);
    if (!authorization.toLowerCase().startsWith('bearer')) throw errors.authenticationError(TOKEN_REQUIRED);
    const token = authorization.split(' ')[1];
    const verify = validateJwt(token);
    if (!verify.isValid) throw errors.authenticationError(TOKEN_INVALID);
    req.payload = verify.payload;
    const { id: userId, iat } = verify.payload;
    const { tokens_expired: tokensExpired } = await userFindByPk(userId);
    const timeExpired = new Date(tokensExpired).getTime();
    if (iat < timeExpired) throw errors.authenticationError(TOKEN_EXPIRED);
    return next();
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};
