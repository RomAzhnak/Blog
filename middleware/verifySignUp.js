const db = require("../models");
const User = db.User;
const { Op } = require("sequelize");

exports.checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // const user = await User.findOne({
    //   where: {
    //     [Op.or]: [
    //       { username: req.body.username },
    //       { email: req.body.email }
    //     ]
    //   }
    // });
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
      throw new Error("Failed! Username or email already in use!");
    }
    next();
  } catch(err) {
    res.status(500).send({ message: err.message });
  }
};
