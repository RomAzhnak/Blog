const express = require('express');
const router = express.Router();
const controllerUser = require("../controllers/user.controller");
const { verifyToken } = require('../middleware/authJwt');


router.get('/user/:id', verifyToken, controllerUser.getUserPosts);
router.post("/addpost", verifyToken, controllerUser.addPost);
router.post("/like", verifyToken, controllerUser.changeLike);
router.get("/list", controllerUser.getListPost);

module.exports = router;