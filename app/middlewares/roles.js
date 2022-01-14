const errors = require('../errors');
const { UNAUTHORIZED_ROLE } = require('../constants/errors');

exports.hasRole = role => (req, _, next) => {
  const { payload } = req;
  try {
    const { role: roleUser } = payload;
    if (role === roleUser) return next();
    throw errors.forbidden(UNAUTHORIZED_ROLE);
  } catch (err) {
    return next(err);
  }
};
