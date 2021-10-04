const express = require('express');
const router = express.Router();
const controllerUser = require("../controllers/user.controller");
const { verifyToken } = require('../middleware/authJwt');


router.post("/signup", controllerUser.signup);
router.post("/signin", controllerUser.signin);
router.get('/', verifyToken, controllerUser.getUser);

module.exports = router;