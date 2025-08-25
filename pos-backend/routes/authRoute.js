const express = require("express");
const { signup, login, logout } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");    

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authMiddleware(), logout);

module.exports = router;