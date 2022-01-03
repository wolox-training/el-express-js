exports.paginationSchema = {
  page: {
    in: ['query'],
    customSanitizer: {
      options: value => (value < 1 || !value ? 1 : value)
    },
    isInt: {
      errorMessage: 'must_be_int'
    }
  },
  per_page: {
    in: ['query'],
    customSanitizer: {
      options: value => (value < 1 || !value ? 10 : value)
    },
    isInt: {
      errorMessage: 'must_be_int'
    }
  }
};
