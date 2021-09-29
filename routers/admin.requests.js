const express = require('express');
const router = express.Router();
const controllerUser = require("../controllers/user.controller");
const controllerFile = require("../controllers/file.controller");
const { verifyToken } = require('../middleware/authJwt');


router.delete("/deleteUser", verifyToken, controllerUser.deleteAdmin);
router.post("/editAdmin", verifyToken, controllerUser.editAdmin);
router.get("/users", verifyToken, controllerUser.getListUsersAdmin);
router.get("/files/:name", controllerFile.download);

module.exports = router;