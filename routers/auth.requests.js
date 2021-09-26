const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const controllerAuth = require("../controllers/controller");
const controllerFile = require("../controllers/file.controller");
const { verifyToken } = require('../middleware/authJwt');
const { checkDuplicateUsernameOrEmail } = require("../middleware/verifySignUp");
// const { verifyToken } = require("../middleware/authJwt");

// router.get("/test", verifyToken, (req,res) => {res.status(200).send(`User Content id = ${req.userId} `);});

router.post("/signup", controllerAuth.signup); // checkDuplicateUsernameOrEmail,
router.get('/', verifyToken, controllerAuth.getUser); //
// router.get('/user/:id', verifyToken, controllerAuth.getUserById);
// router.get('/user/posts/:id', verifyToken, controllerAuth.getUserPosts);
router.post("/signin", controllerAuth.signin);  //
// router.post("/like", verifyToken, controllerAuth.changeLike);
// router.delete("/", verifyToken, controllerAuth.delete);
// router.delete("/admin", verifyToken, controllerAuth.deleteAdmin);
// router.post("/edit", verifyToken, controllerAuth.edit);
// router.get("/users", controllerAuth.getListUsers);
// router.get("/postlist", controllerAuth.getListPost);
// router.post("/edit", controllerFile.upload);
// router.get("/files", controllerFile.getListFiles);
router.get("/files/:name", controllerFile.download);

module.exports = router;