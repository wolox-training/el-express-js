exports.paginationSerializer = pagination => ({
  count: pagination.count,
  current_page: parseInt(pagination.page),
  per_page: parseInt(pagination.per_page),
  total_pages: Math.ceil(pagination.count / pagination.per_page),
  next_page: parseInt(pagination.page) + 1,
  previous_page: pagination.page > 1 ? parseInt(pagination.page) - 1 : null
});
