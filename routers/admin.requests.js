const express = require('express');
const router = express.Router();
const controllerAuth = require("../controllers/controller");
const controllerFile = require("../controllers/file.controller");
const { verifyToken } = require('../middleware/authJwt');


router.delete("/deleteUser", verifyToken, controllerAuth.deleteAdmin);
router.post("/editAdmin", verifyToken, controllerAuth.editAdmin);
router.get("/users", verifyToken, controllerAuth.getListUsersAdmin);
router.get("/files/:name", controllerFile.download);

module.exports = router;