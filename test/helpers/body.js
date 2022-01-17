/**
  @param {string} prop - param to remove
  @return {(object) => object} - return object without prop
 */
// eslint-disable-next-line no-unused-vars
exports.removeProperty = prop => ({ [prop]: _, ...rest }) => rest;

/**
 * @param {string} prop  - key to compare
 * @param {number|string} value  - value to compare
 * @return {(data:array) => object} - return object that matches with the value
 */

exports.find = (prop, value) => data => data.find(d => d[prop] === value);
