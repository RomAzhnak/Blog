const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const controllerAuth = require("../controllers/auth.controller");
const controllerFile = require("../controllers/file.controller");
const { verifyToken } = require('../middleware/authJwt');
const { checkDuplicateUsernameOrEmail } = require("../middleware/verifySignUp");
// const { verifyToken } = require("../middleware/authJwt");

// router.get("/test", verifyToken, (req,res) => {res.status(200).send(`User Content id = ${req.userId} `);});

router.post(
  "/signup",
  // username must be an email
  // body('email').isEmail(),
  // // password must be at least 5 chars long
  // body('password').isLength({ min: 5 }),
  // (req, res, next) => {
  //   // Finds the validation errors in this request and wraps them in an object with handy functions
  //   const errors = validationResult(req);
  //   if (!errors.isEmpty()) {
  //     return res.status(400).send({ message: `Failed! Invalid password or email format!` });
  //   };
  //   next();
  // },
  checkDuplicateUsernameOrEmail,
  controllerAuth.signup
);
router.get('/', verifyToken, controllerAuth.getUser);
router.get('/user/:id', verifyToken, controllerAuth.getUserById);
router.get('/user/posts/:id', verifyToken, controllerAuth.getUserPosts);
router.post("/signin", controllerAuth.signin);
router.delete("/", controllerAuth.delete);
router.post("/edit", controllerAuth.edit);
router.get("/users", controllerAuth.getListUsers);
// router.post("/edit", controllerFile.upload);
// router.get("/files", controllerFile.getListFiles);
router.get("/files/:name", controllerFile.download);

module.exports = router;