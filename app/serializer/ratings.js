exports.ratingSerializer = rating => ({
  id: rating.id,
  weet_id: rating.weet_id,
  rating_user_id: rating.rating_user_id,
  score: rating.score
});
