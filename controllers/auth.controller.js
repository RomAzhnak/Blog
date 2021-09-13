const db = require("../models");
const config = require("../config/auth.config");
const uploadFile = require("../middleware/upload");
const User = db.User;
const Op = db.Sequelize.Op;
const baseUrl = 'http://localhost:4000/auth/files/';
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// const { upload } = require("./file.controller");

exports.allUser = (req, res) => {
  User.findAll({
  })
    .then(user => {
      res.json(user)
    });
};

exports.getUserById = async (req, res) => {
  try {
    
    const id = Number(req.params.id.slice(1));
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("Failed! User Not found!");
    };
    res.status(200).send({
      userName: user.userName,
      email: user.email,
      role: user.role,
      urlAvatar: user.urlAvatar,
  
    })
  } catch(err) {
    res.status(500).send({
      message: `Failed! : ${err}`,
    });
  }
}

exports.edit = async (req, res) => {
  try {
    await uploadFile(req, res);
    const { userName, email, password, role, urlAvatar } = req.body;
    console.log(req.body, userName, email, password, role, urlAvatar);
    const user = await User.findOne({
      where: { email: email }
    });
    if (!user) {
      throw new Error("Failed! User Not found!");
    };
    const passwordIsValid = bcrypt.compareSync(
      password,
      user.password
    );
    if (!passwordIsValid) {
      throw new Error("Failed! Invalid Password!");
    };
    if ((user.urlAvatar !== urlAvatar) && (req.file !== undefined)) {
      const filename = req.file.originalname;
      const result = await User.update({
        urlAvatar: baseUrl + filename,
      },
        {
          where: { email: email }
        });
      if (!result) {
        throw new Error("Failed update!");
      };
    }
    const result = await User.update({
      userName: userName,
      roleId: role,
    },
      {
        where: { email: email }
      });
    if (!result) {
      throw new Error("Failed update!");
    };
    res.status(200).send({
      userName: userName,
      email: email,
      role: role,
      urlAvatar: urlAvatar,
      accessToken: ''
    })
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

  // await uploadFile(req, res);
  // const { username, email, password, role, urlavatar } = req.body;
//   try {
//     const user = await User.findOne({
//       where: { email: email }
//     });
//     if (!user) {
//       throw new Error("Failed! User Not found!");
//     };
//     const passwordIsValid = bcrypt.compareSync(
//       password,
//       user.password
//     );
//     if (!passwordIsValid) {
//       throw new Error("Failed! Invalid Password!");
//     };

//     const avatar = await User.findOne({
//       where: {
//         email: email
//       }
//     });
//     if ((avatar.urlAvatar !== urlavatar) && (avatar.urlAvatar !== null)) {
//       await uploadFile(req, res);
//       const filename = req.file.originalname;

//       // if (req.file == undefined) {
//       //   return res.status(400).send({ message: "Please upload a file!" });
//       // }
//       const resp = await User.update({
//         urlAvatar: baseUrl + filename,
//       },
//         {
//           where: { email: email }
//         });
//       if (!resp) {
//         throw new Error("Failed update!");
//       };
//     }
//     const result = await User.update({
//       userName: username,
//       roleId: role,
//     },
//       {
//         where: { email: email }
//       });
//     if (!result) {
//       throw new Error("Failed update!");
//     };
//     res.status(200).send({
//       userName: username,
//       email: email,
//       role: role,
//       urlAvatar: urlavatar,
//       accessToken: ''
//     });
//     // res.send({ message: "User was updated successfully." });
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// };

exports.getListUsers = async (req, res) => {

  try {
    const { QueryTypes, or } = require('sequelize');
    const users = await db.sequelize.query('SELECT userName, urlAvatar, id From `Users`', { type: QueryTypes.SELECT });
    res.status(200).send(users);;
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

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
      roleId: req.body.role,
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

// exports.findAll = (req, res) => {
//   const title = req.query.title;
//   const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

//   User.findAll({ where: condition })
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving user."
//       });
//     });
// };

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
