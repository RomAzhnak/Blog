const jwt = require("jsonwebtoken");
require('dotenv').config();

exports.verifyToken = (req, res, next) => {
    try {
    if (!req.headers.authorization) {
      throw new Error("Unauthorized!");
    }
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      throw new Error("Unauthorized!");
    }
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        throw new Error("Unauthorized!");
      }
      req.userEmail = decoded.email;
      req.userId = decoded.id;
      next();
    })
  } catch (err) {
    next(err);
  }
};