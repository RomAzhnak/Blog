const db = require("../models");
const config = require("../config/auth.config");
const User = db.User;
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.allUser = (req, res) => {
  User.findAll({
  })
    .then(user => {
      res.json(user)
    });
};

exports.edit = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email }
    });
    if (!user) {
      throw new Error("Failed! User Not found!");
    };
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      throw new Error("Failed! Invalid Password!");
    };
    const result =  await User.update({
      userName: req.body.userName, 
      roleId: req.body.role,
    },
      { where: { email: req.body.email }
    });
    if (!result) {
      throw new Error("Failed update!");
    };
    res.status(200).send({
      userName: req.body.userName,
      email: req.body.email,
      role: req.body.roleId,
      urlAvatar: req.body.urlAvatar,
      accessToken: ''
    });
    // res.send({ message: "User was updated successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  const email = req.query.email;
  try {
    const user = await User.findOne({
      where: { email: req.query.email }
    });
    if (!user) {
      throw new Error("Failed! User Not found!");
    };
    const passwordIsValid = bcrypt.compareSync(
      req.query.password,
      user.password
    );
    if (!passwordIsValid) {
      throw new Error("Failed! Invalid Password!");
    };
    const result = await User.destroy({
      where: { email: req.query.email }
    })
    if (!result) {
      throw new Error("Failed delete!");
    };
    res.send({ message: "User was deleted successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.signup = async (req, res) => {
  try {
    await User.create({
      userName: req.body.userName,
      email: req.body.email,
      role: req.body.role,
      password: bcrypt.hashSync(req.body.password, 8)
    })
    res.send({ message: "User registered successfully!" })
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getUser = async (req, res) => {
  // const userId = req.userEmail;
  try {
    const user = await User.findOne({
      where: {
        email: req.userEmail
      }
    });
    if (!user) {
      throw new Error("Failed! User Not found!");
    }
    res.status(200).send({
      userName: user.userName,
      email: user.email,
      role: user.roleId,
      urlAvatar: user.urlAvatar
      // accessToken: token
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    if (!user) {
      throw new Error("Failed! User Not found!");
    }
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      throw new Error("Failed! Invalid Password!");
    }
    const token = jwt.sign({ email: user.email }, config.secret, {    //{ id: user.id }
      expiresIn: 86400 // 60*60*24
    });
    res.status(200).send({
      userName: user.userName,
      email: user.email,
      role: user.roleId,
      urlAvatar: user.urlAvatar,
      accessToken: token
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.findAll = (req, res) => {
  const title = req.query.title;
  const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  User.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving user."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving user with id=" + id
      });
    });
};



// exports.delete = (req, res) => {
//   const id = req.params.id;

//   User.destroy({
//     where: { id: id }
//   })
//     .then(num => {
//       if (num == 1) {
//         res.send({
//           message: "User was deleted successfully!"
//         });
//       } else {
//         res.send({
//           message: `Cannot delete user with id=${id}. Maybe user was not found!`
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Could not delete user with id=" + id
//       });
//     });
// };

exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all users."
      });
    });
};
