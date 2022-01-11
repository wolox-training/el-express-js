const {
  common: { weets }
} = require('../../config');

exports.weetCreateMapper = data => ({
  content: data.content.slice(0, weets.contentMaxLength),
  user_id: data.user_id
});
