'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post, {
        foreignKey: 'userId',
      });
      User.belongsTo(models.Role, {
        foreignKey: 'roleId',
        onDelete: 'CASCADE'
      });
      User.belongsToMany(models.User, {
        through: {
          model: models.Subscription
        },
        foreignKey: 'userSubscribe',
        as: 'subscriber'
      });
      User.belongsToMany(models.User, {
        through: {
          model: models.Subscription
        },
        foreignKey: 'userId',
        as: 'user'
      });
    }
  };
  User.init({
    userName: DataTypes.STRING,
    email: DataTypes.STRING,
    urlAvatar: DataTypes.STRING,
    roleId: DataTypes.INTEGER,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};