const db = require("../models");
const User = db.User;
const { Op } = require("sequelize");

exports.checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { userName: req.body.userName },
          { email: req.body.email }
        ]
      }
    });
    if (user) {
      throw new Error("Failed! Username or email already in use!");
    }
    next();
  } catch(err) {
    next(err)
  }
};
