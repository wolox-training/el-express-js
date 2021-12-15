'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      surname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING(512)
    },
    {
      timestamps: false,
      tableName: 'users'
    }
  );
  User.associate = function(models) {
    User.hasMany(models.Weet, { as: 'weets', foreignKey: 'user_id' });
  };
  return User;
};
