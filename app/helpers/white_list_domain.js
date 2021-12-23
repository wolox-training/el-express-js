/**
 * @param {string} email - Email to validate
 * @param {array} domains - White list of domains
 * @return {boolean} - True if email domain is valid
 */
exports.whiteListDomain = (email, domains) => {
  const domainsToValidate = domains.join('|');
  const reg = new RegExp(`\\w+@(${domainsToValidate})(\\.com\\.[a-z]{2}$|\\.com$)`);
  return reg.test(email);
};
