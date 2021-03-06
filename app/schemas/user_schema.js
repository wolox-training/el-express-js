const { whiteListDomain } = require('../helpers/white_list_domain');

exports.userSchema = {
  name: {
    exists: {
      errorMessage: 'required'
    }
  },
  surname: {
    exists: {
      errorMessage: 'required'
    }
  },
  email: {
    exists: {
      errorMessage: 'required'
    },
    isEmail: {
      errorMessage: 'invalid'
    },
    custom: {
      options: value => whiteListDomain(value, ['accenture', 'wolox']),
      errorMessage: 'domain_invalid'
    }
  },
  password: {
    exists: {
      errorMessage: 'required'
    },
    isLength: {
      options: { min: 8 },
      errorMessage: 'min_length'
    },
    custom: {
      options: value => /[a-z]+[0-9]+/i.test(value),
      errorMessage: 'invalid'
    }
  }
};

exports.signInSchema = {
  email: {
    exists: {
      errorMessage: 'required'
    },
    isEmail: {
      errorMessage: 'invalid'
    },
    custom: {
      options: value => whiteListDomain(value, ['accenture', 'wolox']),
      errorMessage: 'domain_invalid'
    }
  },
  password: {
    exists: {
      errorMessage: 'required'
    }
  }
};
