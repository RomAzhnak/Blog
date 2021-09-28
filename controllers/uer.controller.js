const db = require("../models");
const uploadFile = require("../middleware/upload");
const User = db.User;
const Post = db.Post;
const UserLike = db.UserLike;
const Subscription = db.Subscription;
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { QueryTypes } = require('sequelize');
require('dotenv').config();


exports.allUser = (req, res) => {
  User.findAll({
  })
    .then(user => {
      res.json(user)
    });
};

exports.changeLike = async (req, res, next) => {
  let statusLike = false;
  try {
    const idAuthor = Number(req.body.idAuthor.slice(1));
    const idPost = req.body.idPost;
    const idLiker = req.userId;
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
    const countLikes = await db.sequelize.query(`SELECT COUNT(postId) AS likes 
    FROM UserLikes WHERE postId = ${idPost} 
    GROUP BY postId`, { type: QueryTypes.SELECT });
    const likes = (countLikes.length != 0) ? countLikes[0].likes : 0;
    res.status(200).send({ statusLike: statusLike, countLikes: likes });
  }
  catch (err) {
    next(err);
  }
}

exports.getUserPosts = async (req, res, next) => {
  try {
    const idLiker = req.userId;
    const idAuthor = Number(req.params.id.slice(1));
    const userLike = await UserLike.findAll({
      where: { userId: idLiker, postAuthorId: idAuthor },
      attributes: ['postId',]
    });
    let userLikes = [];
    userLike.map((user) => userLikes.push(user.postId));
    const posts = await db.sequelize.query(`SELECT count(UserLikes.id) AS likes, 
    Posts.id, Posts.title, Posts.post, Posts.userId, Posts.createdAt, 
    UserLikes.postId FROM Posts LEFT JOIN UserLikes ON Posts.id = UserLikes.postId 
    WHERE Posts.userId = ${idAuthor} GROUP BY Posts.id`, { type: QueryTypes.SELECT });
    if (!posts) {
      throw new Error("Failed! Author not found!");
    }
    res.status(200).send({ posts: posts, userLikes: userLikes });
  } catch (err) {
      next(err);
  }
}

exports.addPost = async (req, res, next) => {
  const id = req.userId;
  const { title, post } = req.body;
  try {
    await Post.create({
      userId: id,
      post: post,
      title: title,
      likes: 0,
    });
    res.status(200).send('Add post');
  } catch (err) {
      next(err);
  }

}

exports.getUserById = async (req, res, next) => {
  try {
    const id = Number(req.params.id.slice(1));
    const idSubscriber = req.userId;
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("Failed! User not found!");
    };
    const isSubscribe = await Subscription.findOne({
      where: { userId: idSubscriber, userSubscribe: id }
    });
    const subscribe = Boolean(isSubscribe);
    res.status(200).send({
      userName: user.userName,
      email: user.email,
      roleId: user.roleId,
      urlAvatar: user.urlAvatar,
      id: user.id,
      subscribe: subscribe,
      password: '',
    })
  } catch (err) {
        next(err);
  }
}

exports.editAdmin = async (req, res, next) => {
  try {
    await uploadFile(req, res);
    const { userName, email, password, urlAvatar, id } = req.body;
    const idUser = Number(id);
    const roleId = Number(req.body.roleId);
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("Failed! User not found!");
    };
    if (user.roleId === 1) {
      throw new Error("Failed! Cannot edit admin");
    }
    const fileName = req.file === undefined ? '' : process.env.baseUrl + req.file.originalname;
    const result = await User.update({
      userName: userName,
      email: email,
      roleId: roleId,
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
      roleId: roleId,
      urlAvatar: fileName,
      id: idUser,
    })
  } catch (err) {
    next(err);
  }
};

exports.edit = async (req, res, next) => {
  try {
    await uploadFile(req, res);
    const { userName, email, password, urlAvatar, id } = req.body;
    const idUser = Number(id);
    const roleId = Number(req.body.roleId);
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("Failed! User not found!");
    };
    const passwordIsValid = bcrypt.compareSync(
      password,
      user.password
    );
    if (!passwordIsValid) {
      throw new Error("Failed! Invalid Password!");
    };
    const fileName = req.file === undefined ? '' : process.env.baseUrl + req.file.originalname;
    const result = await User.update({
      userName: userName,
      email: email,
      roleId: roleId,
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
      roleId: roleId,
      urlAvatar: fileName,
      id: idUser,
    })
  } catch (err) {
    next(err);
  }
};

exports.getListPost = async (req, res, next) => {
  const filter = req.query.filter;
  const page = Number(req.query.page) - 1;
  try {
    const minIds = await Post.findAll({
      attributes: [[db.sequelize.fn("min", db.sequelize.col('id')), 'minid']],
      group: ["userId"],
      raw: true,
    });
    const result = await Post.findAll({
      include: [{
        model: User,
        where: { state: db.Sequelize.col('Post.userId') }
      }],
      where: {
        [Op.and]: [
          { id: { [Op.in]: minIds.map(item => item.minid) } },
          { title: { [Op.substring]: `${filter}` } },
        ]
      },
      offset: page * 5,
      limit: 5,
    })
    const postsFilter = await Post.findAll({
      include: [{
        model: User,
        where: { state: db.Sequelize.col('Post.userId') }
      }],
      where: {
        [Op.and]: [
          { id: { [Op.in]: minIds.map(item => item.minid) } },
          { title: { [Op.substring]: `${filter}` } },
        ]
      },
    })
    const countPosts = postsFilter.length;
    res.status(200).send({ posts: result, countPosts: countPosts });;
  } catch (err) {
        next(err);
  }
}

exports.setUserSubscribe = async (req, res, next) => {
  let subscribe = false;
  try {
    const id = Number(req.query.id);
    const idSubscriber = req.userId;
    const result = await Subscription.destroy({
      where: { userId: idSubscriber, userSubscribe: id }
    })
    if (!result) {
      await Subscription.create({
        userId: idSubscriber,
        userSubscribe: id,
      });
      subscribe = true;
    }
    res.status(200).send({ subscribe: subscribe });
  } catch (err) {
        next(err);
  }
}

exports.getListUsersAdmin = async (req, res, next) => {
  try {
    const id = req.query.id;
    const users = await User.findAll({
      where: {
        id: { [Op.ne]: [id] }
      }
    });
    res.status(200).send(users);
  } catch (err) {
        next(err);
  }
}

exports.getListUsers = async (req, res, next) => {
  try {
    const id = req.query.id;
    const subscribe = await User.findAll(
      {
        include: [{
          model: User,
          through: {
            model: Subscription,
            where: {
              userId: id
            }
          },
          as: 'subscriber',
          required: true
        }]
      }
    );
    res.status(200).send(subscribe);
  } catch (err) {
        next(err);
  }
}

exports.deleteAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.query.id }
    });
    if (!user) {
      throw new Error("Failed! User not found!");
    };
    if (user.roleId === 1) {
      throw new Error("Failed! Cannot delete admin!");
    };
    const result = await User.destroy({
      where: { id: req.query.id }
    })
    if (!result) {
      throw new Error("Failed delete!");
    };
    res.status(200).send({ message: "User was deleted successfully!" });
  } catch (err) {
        next(err);
  }
}

exports.delete = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.query.id }
    });
    if (!user) {
      throw new Error("Failed! User not found!");
    };
    const passwordIsValid = bcrypt.compareSync(
      req.query.password,
      user.password
    );
    if (!passwordIsValid) {
      throw new Error("Failed! Invalid Password!");
    };
    const result = await User.destroy({
      where: { id: req.query.id }
    })
    if (!result) {
      throw new Error("Failed delete!");
    };
    res.status(200).send({ message: "User was deleted successfully!" });
  } catch (err) {
        next(err);
  }
};

exports.signup = async (req, res, next) => {
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
    await User.create({
      userName: req.body.userName,
      email: req.body.email,
      roleId: req.body.roleId,
      password: bcrypt.hashSync(req.body.password, 8)
    })
    res.status(200).send({ message: "User registered successfully!" })
  } catch (err) {
      next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.userEmail
      }
    });
    if (!user) {
      throw new Error("Failed! User not found!");
    }
    res.status(200).send({
      userName: user.userName,
      email: user.email,
      roleId: user.roleId,
      urlAvatar: user.urlAvatar,
      id: user.id,
    });
  } catch (err) {
        next(err);
  }
}

exports.signin = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    if (!user) {
      throw new Error("Failed! User not found!");
    }
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      throw new Error("Failed! Invalid Password!");
    }
    const token = jwt.sign({ email: user.email, id: user.id }, process.env.SECRET,
      {
        expiresIn: 86400 // 60*60*24
      });
    res.status(200).send({
      userName: user.userName,
      email: user.email,
      roleId: user.roleId,
      urlAvatar: user.urlAvatar,
      id: user.id,
      accessToken: token
    });
  } catch (err) {
        next(err);
  }
};
