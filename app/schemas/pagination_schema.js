
exports.paginationSchema = {
  page: {
    in: ['query'],
    isRequired: {
      errorMessage: 'required'
    },
    isNumeric: {
      errorMessage: 'must_be_numeric'
    }
  },
  per_page: {
    in: ['query'],
    isRequired: {
      errorMessage: 'required'
    },
    isNumeric: {
      errorMessage: 'must_be_numeric'
    }
  }
}