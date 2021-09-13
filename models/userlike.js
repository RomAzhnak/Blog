'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserLike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserLike.belongsTo(models.Post, {
        foreignKey: 'postId',
        onDelete: 'CASCADE'
      });
    }
  };
  UserLike.init({
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    postAuthorId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'UserLike',
  });
  return UserLike;
};