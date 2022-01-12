'use strict';

module.exports = (sequelize, DataTypes) => {
  // eslint-disable-line
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      surname: DataTypes.STRING,
      email: DataTypes.STRING,
      // eslint-disable-next-line new-cap
      password: DataTypes.STRING(512),
      role: {
        type: DataTypes.ENUM,
        values: ['ADMIN', 'REGULAR'],
        defaultValue: 'REGULAR'
      }
    },
    {
      timestamps: false,
      tableName: 'users'
    }
  );
  User.associate = models => {
    User.hasMany(models.Weet, { as: 'weets', foreignKey: 'user_id' });
  };
  User.findByEmail = async email => {
    const queryBuilder = {
      where: { email }
    };
    const user = await User.findOne(queryBuilder);
    return user;
  };

  // eslint-disable-line
  return User;
};
