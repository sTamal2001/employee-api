const pool = require("../config/db");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return next(new AppError("Email and password is required", 400));
    }

    const existing = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (existing.rows.length > 0) {
      return next(new AppError("Email already exists", 409));
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (email, password, role) values($1, $2, $3) RETURNING id, email, role, created_at",
      [email, hashPassword, role],
    );

    res
      .status(201)
      .json({ message: "User Registered successfully", data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Email and password is required", 400));
    }

    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
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
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN },
    );

    await pool.query("UPDATE users SET refresh_token = $1 where id = $2 ", [
      refreshToken,
      user.id,
    ]);

    res.json({ token, refreshToken });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new AppError("refreshToken is required", 401));
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const result = await pool.query("SELECT * FROM users WHERE id =$1", [
      decoded.id,
    ]);

    const user = result.rows[0];

    if (!user || user.refresh_token !== refreshToken) {
      return next(new AppError("Invalid refreshToken", 403));
    }

    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new AppError("refreshToken is required", 401));
    }
    const result = await pool.query(
      "UPDATE users SET refresh_token = NULL WHERE refresh_token=$1",
      [refreshToken],
    );
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, refreshToken, logout };
