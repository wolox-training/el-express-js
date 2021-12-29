/**
 *
 * @param {object} error  - Error object
 * @returns { object }  - Error mapped
 */
exports.responseError = error => ({ message: error.message, internal_code: error.internalCode });
