'user strict';

module.exports = (sequelize, DataTypes) => {
  // eslint-disable-line
  const Rating = sequelize.define(
    'Rating',
    {
      score: {
        type: DataTypes.INTEGER
      }
    },
    {
      timestamps: false,
      tableName: 'ratings'
    }
  );

  Rating.associate = models => {
    Rating.belongsTo(models.User, { foreignKey: 'rating_user_id' });
    Rating.belongsTo(models.Weet, { foreignKey: 'weet_id' });
  };

  return Rating;
};
