const bcryptJs = require('bcryptjs');
const jwt = require('jwt-simple');
const {
  common: { bcrypt, jwt: jwtConfig }
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

/**
 *
 * @param {string} hash - hash to compare
 * @param {string} textPlain  - text to compare
 * @returns {boolean} - true if hash matches the text
 */
exports.compareHash = (hash, textPlain) => bcryptJs.compareSync(textPlain, hash);

/**
 *
 * @param {object} payload - object to encode
 * @returns  {string} - token jwt
 */
exports.jwtEncode = payload => {
  const { secretKey } = jwtConfig;
  return jwt.encode(payload, secretKey);
};
/**
 *
 * @param {string} token  - jwt to decode
 * @returns  {object} - object with payload and flag isValid
 */
exports.validateJwt = token => {
  const { secretKey } = jwtConfig;
  try {
    return { payload: jwt.decode(token, secretKey), isValid: true };
  } catch (err) {
    return { payload: {}, isValid: false };
  }
};
