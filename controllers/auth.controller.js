const db = require("../models");
const config = require("../config/auth.config");
const uploadFile = require("../middleware/upload");
const User = db.User;
const Post = db.Post;
const UserLike = db.UserLike;
const Op = db.Sequelize.Op;
const baseUrl = 'http://localhost:4000/auth/files/';
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.allUser = (req, res) => {
  User.findAll({
  })
    .then(user => {
      res.json(user)
    });
};

exports.changeLike = async (req, res) => {
  let statusLike = false;
  try {
    const idAuthor = Number(req.body.idAuthor.slice(1));
    const idPost = req.body.idPost;
    const token = req.headers.authorization.split(' ')[1];
    let idLiker = 0;
    jwt.verify(token, config.secret, (err, decoded) => {
      idLiker = decoded.id;
    });
    const result = await UserLike.destroy({
      where: { userId: idLiker, postId: idPost, postAuthorId: idAuthor }
    })
    if (!result) {
      await UserLike.create({
        userId: idLiker,
        postId: idPost,
        postAuthorId: idAuthor
      });
      statusLike = true;
    }
    // const countLikes = await UserLike.findAll({
    //   where: { postId: idPost },
    //   attributes: [
    //     [db.sequelize.fn('COUNT', db.sequelize.col('postId')), 'likes']
    //   ],
    // });
    const { QueryTypes } = require('sequelize');
    const countLikes = await db.sequelize.query(`SELECT COUNT(postId) AS likes FROM UserLikes WHERE postId = ${idPost} GROUP BY postId`, { type: QueryTypes.SELECT });
    const likes = (countLikes.length != 0) ? countLikes[0].likes : 0;
    res.status(200).send({ statusLike: statusLike, countLikes: likes });
  }
  catch (err) {
    res.status(500).send({
      message: `Failed! : ${err}`,
    });
  }
}

exports.getUserPosts = async (req, res) => {
  let idLiker = 0;
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, config.secret, (err, decoded) => {
      idLiker = decoded.id;
    });
    const idAuthor = Number(req.params.id.slice(1));
    const userLike = await UserLike.findAll({
      where: { userId: idLiker, postAuthorId: idAuthor },
      attributes: ['postId',]
    });
    let userLikes = [];
    userLike.map((user) => userLikes.push(user.postId));
    const { QueryTypes } = require('sequelize');
    const posts = await db.sequelize.query(`SELECT count(postid) AS likes, Posts.id, Posts.title, Posts.post, Posts.userId, Posts.createdAt, UserLikes.postAuthorId FROM Posts LEFT JOIN UserLikes ON Posts.id = UserLikes.postId WHERE Posts.userId = ${idAuthor} GROUP BY Posts.id`, { type: QueryTypes.SELECT });
    if (!posts) {
      throw new Error("Failed! Author Not found!");
    }
    res.status(200).send({ posts: posts, userLikes: userLikes });
  } catch (err) {
    res.status(500).send({
      message: `Failed! : ${err}`,
    });
  }
}

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
      role: user.roleId,
      urlAvatar: user.urlAvatar,
      id: user.id,
      password: '',
    })
    // console.log(user);
  } catch (err) {
    res.status(500).send({
      message: `Failed! : ${err}`,
    });
  }
}

exports.edit = async (req, res) => {
  try {
    await uploadFile(req, res);
    const { userName, email, password, urlAvatar, id } = req.body;
    const idUser = Number(id);
    const role = Number(req.body.role);
    const user = await User.findByPk(id);
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
    const fileName = req.file === undefined ? '' : baseUrl + req.file.originalname;
    const result = await User.update({
      userName: userName,
      email: email,
      roleId: role,
      urlAvatar: fileName,
    },
      {
        where: { id: idUser }
      });
    if (!result) {
      throw new Error("Failed update!");
    };
    res.status(200).send({
      userName: userName,
      email: email,
      role: role,
      urlAvatar: urlAvatar,
      id: idUser,
      accessToken: ''
    })
  } catch (err) {
    res.status(500).send({
      message: `Failed edit! ${err}`,
    });
  }
};

exports.getListPost = async (req, res) => {
  try {
    // const { QueryTypes, or } = require('sequelize');
    // const users = await db.sequelize.query('SELECT userName, urlAvatar, id From `Users`', { type: QueryTypes.SELECT });
    // const users = await 
    Post.findAll({
      attributes: [[db.sequelize.fn("min", db.sequelize.col('id')), 'minid']],
      group: ["userId"],
      raw: true,
    })
      .then(function (minIds) {
        return Post.findAll({
          include: [{
            model: User,
            where: { state: db.Sequelize.col('Post.userId') }
          }],
          where: {
            id: { [Op.in]: minIds.map(item => item.minid) }
          },
        })
      })
      .then(function (result) {
        res.status(200).send(result);
        return Promise.resolve(result);
      })
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.getListUsers = async (req, res) => {
  try {
    const id = req.query.id;
    const users = await User.findAll({
      where: {
        id: { [Op.ne]: [id] }
      }
    });
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
      urlAvatar: user.urlAvatar,
      id: user.id,
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
    const token = jwt.sign({ email: user.email, id: user.id }, config.secret,
      {
        expiresIn: 86400 // 60*60*24
      });
    res.status(200).send({
      userName: user.userName,
      email: user.email,
      role: user.roleId,
      urlAvatar: user.urlAvatar,
      id: user.id,
      accessToken: token
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
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
