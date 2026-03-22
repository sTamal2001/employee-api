const express = require("express");
const router = express.Router();

const { login, refreshToken, register, logout, changePassword } = require("../controllers/auth.controller");
const validate = require("../middleware/validate.middleware");
const { loginSchema } = require("../validations/auth.validation");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/login", validate(loginSchema), login);
router.post("/change-password",authMiddleware, changePassword);

router.post("/refresh", refreshToken);
router.post("/logout", logout);

module.exports = router;
