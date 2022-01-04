exports.paginationSerializer = pagination => ({
  total: pagination.count,
  page: parseInt(pagination.page),
  per_page: parseInt(pagination.per_page)
});
