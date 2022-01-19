/**
  @param {string} prop - param to remove
  @return {(object) => object} - return object without prop
 */
// eslint-disable-next-line no-unused-vars
exports.removeProperty = prop => ({ [prop]: _, ...rest }) => rest;
