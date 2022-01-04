const logger = require('../logger');
const errors = require('../errors');
const { TOKEN_INVALID, TOKEN_REQUIRED } = require('../constants/errors');
const { validateJwt } = require('../helpers/auth');

exports.checkAuth = (req, _, next) => {
  const { authorization } = req.headers;
  try {
    if (!authorization) throw errors.authenticationError(TOKEN_REQUIRED);
    if (!authorization.toLowerCase().startsWith('bearer')) throw errors.authenticationError(TOKEN_REQUIRED);
    const token = authorization.split(' ')[1];
    const verify = validateJwt(token);
    if (!verify.isValid) throw errors.authenticationError(TOKEN_INVALID);
    req.payload = verify.payload;
    return next();
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};
