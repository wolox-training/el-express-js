const {
  DEVELOPER_POSITION,
  LEAD_POSITION,
  TL_POSITION,
  EM_POSITION,
  HEAD_POSITION,
  CEO_POSITION
} = require('../constants/users');

exports.getPosition = score => {
  if (score < 5) return DEVELOPER_POSITION;
  if (score <= 9) return LEAD_POSITION;
  if (score <= 19) return TL_POSITION;
  if (score <= 29) return EM_POSITION;
  if (score <= 49) return HEAD_POSITION;
  return CEO_POSITION;
};
