exports.getPosition = score => {
  if (score < 5) return 'Developer';
  if (score <= 9) return 'Lead';
  if (score <= 19) return 'TL';
  if (score <= 29) return 'EM';
  if (score <= 40) return 'HEAD';
  return 'CEO';
};
