exports.weetSerializer = data => ({
  id: data.id,
  content: data.content,
  user_id: data.user_id
});

exports.weetsSerializer = weets => weets.map(weet => this.weetSerializer(weet));
