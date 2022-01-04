const axios = require('axios');

exports.get = async (url, params) => {
  const data = await axios.get(url, params);
  return data;
};
