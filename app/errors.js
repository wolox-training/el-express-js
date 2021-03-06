const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.BAD_REQUEST_ERROR = 'bad_request';
exports.badRequest = message => internalError(message, exports.BAD_REQUEST_ERROR);

exports.FORBIDDEN_ERROR = 'forbidden_error';
exports.forbidden = message => internalError(message, exports.FORBIDDEN_ERROR);

exports.AUTHENTICATION_ERROR = 'authentication_error';
exports.authenticationError = message => internalError(message, exports.AUTHENTICATION_ERROR);
