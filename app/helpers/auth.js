const bcryptJs = require('bcryptjs');
const {
  common: { bcrypt }
} = require('../../config');
/**
 *
 * @param {string} textPlain - text for get hash
 * @returns {string} - hash of text
 */
exports.hash = textPlain => {
  const { rounds } = bcrypt;
  const salt = bcryptJs.genSaltSync(parseInt(rounds));
  return bcryptJs.hashSync(textPlain, salt);
};
