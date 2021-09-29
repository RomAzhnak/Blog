const express = require('express');
const router = express.Router();
const controllerUser = require("../controllers/user.controller");
const controllerFile = require("../controllers/file.controller");
const { verifyToken } = require('../middleware/authJwt');


router.post("/signup", controllerUser.signup);
router.get('/', verifyToken, controllerUser.getUser);
router.post("/signin", controllerUser.signin);
router.get("/files/:name", controllerFile.download);

module.exports = router;