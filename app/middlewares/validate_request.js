const { validationResult, checkSchema } = require('express-validator');
const errors = require('../errors');

exports.validate = (req, _, next) => {
  const validations = validationResult(req);
  if (validations.isEmpty()) return next();
  const { msg, param } = validations.errors.shift();
  return next(errors.badRequest(`${param}_${msg}`));
};

exports.generateSchema = (schema) => checkSchema(schema);
exports.validOrAbort = (schema) => [exports.generateSchema(schema), exports.validate]