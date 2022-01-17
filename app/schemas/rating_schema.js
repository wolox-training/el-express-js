exports.ratingSchema = {
  score: {
    exists: {
      errorMessage: 'required'
    },
    custom: {
      options: value => [1, -1].includes(value),
      errorMessage: 'range_invalid'
    }
  },
  id: {
    in: ['params'],
    isInt: {
      errorMessage: 'mut_be_int'
    }
  }
};
