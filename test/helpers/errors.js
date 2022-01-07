const errors = require('../../app/errors');
const { DEFAULT_ERROR } = require('../../app/constants/errors');
/**
 *
 * @param {object} error  - Error object
 * @returns { object }  - Error mapped
 */
exports.responseError = error => ({ message: error.message, internal_code: error.internalCode });

exports.defaultErrorResponse = () => exports.responseError(errors.defaultError(DEFAULT_ERROR));
