const {
  common: {
    pagination: { pageDefault, perPageDefault }
  }
} = require('../../config');

exports.paginationSchema = {
  page: {
    in: ['query'],
    customSanitizer: {
      options: value => (value < 1 || !value ? pageDefault : value)
    },
    isInt: {
      errorMessage: 'must_be_int'
    }
  },
  per_page: {
    in: ['query'],
    customSanitizer: {
      options: value => (value < 1 || !value ? perPageDefault : value)
    },
    isInt: {
      errorMessage: 'must_be_int'
    }
  }
};
