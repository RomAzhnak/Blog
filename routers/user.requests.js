const express = require('express');
const router = express.Router();
const controllerUser = require("../controllers/user.controller");
const { verifyToken } = require('../middleware/authJwt');


router.get('/bloger/:id', verifyToken, controllerUser.getUserById);
router.delete("/bloger", verifyToken, controllerUser.delete);
router.post("/bloger", verifyToken, controllerUser.edit);
router.get("/subcribe", verifyToken, controllerUser.setUserSubscribe);
router.get("/list", verifyToken, controllerUser.getListUsers);

module.exports = router;