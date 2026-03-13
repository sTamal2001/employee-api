const express = require("express");
const router = express.Router();

const { login, refreshToken, register, logout } = require("../controllers/auth.controller");
const validate = require("../middleware/validate.middleware");
const { loginSchema } = require("../validations/auth.validation");

router.post("/register", register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

module.exports = router;
