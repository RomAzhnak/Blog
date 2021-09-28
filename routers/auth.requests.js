const express = require('express');
const router = express.Router();
const controllerAuth = require("../controllers/uer.controller");
const controllerFile = require("../controllers/file.controller");
const { verifyToken } = require('../middleware/authJwt');


router.post("/signup", controllerAuth.signup);
router.get('/', verifyToken, controllerAuth.getUser);
router.post("/signin", controllerAuth.signin);
router.get("/files/:name", controllerFile.download);

module.exports = router;