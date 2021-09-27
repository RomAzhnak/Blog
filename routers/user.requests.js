const express = require('express');
const router = express.Router();
const controllerAuth = require("../controllers/controller");
const controllerFile = require("../controllers/file.controller");
const { verifyToken } = require('../middleware/authJwt');


router.get('/getuser/:id', verifyToken, controllerAuth.getUserById);
router.get('/userposts/:id', verifyToken, controllerAuth.getUserPosts);
router.post("/addpost", verifyToken, controllerAuth.addPost);
router.post("/like", verifyToken, controllerAuth.changeLike);
router.delete("/", verifyToken, controllerAuth.delete);
router.post("/edit", verifyToken, controllerAuth.edit);
router.get("/usersubcribe", verifyToken, controllerAuth.setUserSubscribe);
router.get("/users", controllerAuth.getListUsers);
router.get("/postlist", controllerAuth.getListPost);
router.get("/files/:name", controllerFile.download);

module.exports = router;