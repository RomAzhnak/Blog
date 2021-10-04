const express = require('express');
const router = express.Router();
const controllerUser = require("../controllers/user.controller");
const { verifyToken } = require('../middleware/authJwt');


router.delete("/user", verifyToken, controllerUser.deleteAdmin);
router.post("/user", verifyToken, controllerUser.editAdmin);
router.get("/user", verifyToken, controllerUser.getListUsersAdmin);

module.exports = router;