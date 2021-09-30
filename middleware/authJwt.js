const jwt = require("jsonwebtoken");
require('dotenv').config();

exports.verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({
        message: "Unauthorized!"
      });
  }
  // 
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(403).send({
      message: "Unauthorized!"
    });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userEmail = decoded.email;
    req.userId = decoded.id;
    next();
  });
};
