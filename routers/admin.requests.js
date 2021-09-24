const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const controllerAuth = require("../controllers/auth.controller");
const controllerFile = require("../controllers/file.controller");
const { verifyToken } = require('../middleware/authJwt');
const { checkDuplicateUsernameOrEmail } = require("../middleware/verifySignUp");
// const { verifyToken } = require("../middleware/authJwt");

// router.get("/test", verifyToken, (req,res) => {res.status(200).send(`User Content id = ${req.userId} `);});

// router.post("/signup", checkDuplicateUsernameOrEmail, controllerAuth.signup);
// router.get('/', verifyToken, controllerAuth.getUser);
// router.get('/user/:id', verifyToken, controllerAuth.getUserById);
// router.get('/user/posts/:id', verifyToken, controllerAuth.getUserPosts);
// router.post("/signin", controllerAuth.signin);
// router.post("/like", verifyToken, controllerAuth.changeLike);
// router.delete("/", verifyToken, controllerAuth.delete);
router.delete("/deleteUser", verifyToken, controllerAuth.deleteAdmin); //
router.post("/editAdmin", verifyToken, controllerAuth.editAdmin); //
router.get("/users", controllerAuth.getListUsersAdmin); //
// router.get("/postlist", controllerAuth.getListPost);
// router.post("/edit", controllerFile.upload);
// router.get("/files", controllerFile.getListFiles);
router.get("/files/:name", controllerFile.download);

module.exports = router;