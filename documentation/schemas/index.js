const user = require('./user');
const weet = require('./weet');

module.exports = {
  ...user,
  ...weet,
  Error: {
    type: 'object',
    properties: {
      message: {
        type: 'string'
      },
      internal_code: {
        type: 'string'
      }
    }
  }
};
