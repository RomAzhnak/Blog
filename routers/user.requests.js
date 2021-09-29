const express = require('express');
const router = express.Router();
const controllerUser = require("../controllers/user.controller");
const controllerFile = require("../controllers/file.controller");
const { verifyToken } = require('../middleware/authJwt');


router.get('/getuser/:id', verifyToken, controllerUser.getUserById);
router.get('/userposts/:id', verifyToken, controllerUser.getUserPosts);
router.post("/addpost", verifyToken, controllerUser.addPost);
router.post("/like", verifyToken, controllerUser.changeLike);
router.delete("/", verifyToken, controllerUser.delete);
router.post("/edit", verifyToken, controllerUser.edit);
router.get("/usersubcribe", verifyToken, controllerUser.setUserSubscribe);
router.get("/users", controllerUser.getListUsers);
router.get("/postlist", controllerUser.getListPost);
router.get("/files/:name", controllerFile.download);

module.exports = router;