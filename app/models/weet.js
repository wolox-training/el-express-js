'use strict';

module.exports = (sequelize, DataTypes) => {
  // eslint-disable-next-line new-cap
  const Weet = sequelize.define(
    'Weet',
    {
      // eslint-disable-next-line new-cap
      content: DataTypes.STRING(280)
    },
    {
      timestamps: false,
      tableName: 'weets'
    }
  );
  Weet.associate = models => {
    Weet.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
  };
  return Weet;
};
