const pool = require("../config/db");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if ((!email|| !password)) {
    return next(new AppError("Eamil and passsword is required", 400));
  }

  const result = await pool.query("SELECT * FROM employees WHERE email=$1", [
    email,
  ]);

  if (result.rows.length === 0) {
    return next(new AppError("User Not Found", 404));
  }
  const user = result.rows[0];
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return next(new AppError("Email or Password Invalid", 401));
  }
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );

  res.json({ token });
};

module.exports = { login };
