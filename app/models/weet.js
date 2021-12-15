'use strict';

module.exports = (sequelize, DataTypes) => {
  const Weet = sequelize.define(
    'Weet',
    {
      content: DataTypes.STRING(280)
    },
    {
      timestamps: false,
      tableName: 'weets'
    }
  );
  Weet.associate = function(models) {
    Weet.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
  };
  return Weet;
};
