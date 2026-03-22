const pool = require("../config/db");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (req, res, next) => {
  let client;
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return next(new AppError("Email and password is required", 400));
    }

    client = await pool.connect();

    const existing = await client.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (existing.rows.length > 0) {
      return next(new AppError("Email already exists", 409));
    }

    await client.query("BEGIN");

    const hashPassword = await bcrypt.hash(password, 10);

    const result = await client.query(
      "INSERT INTO users (email, password, role) values($1, $2, $3) RETURNING id, email, role, created_at",
      [email, hashPassword, role],
    );

    await client.query("COMMIT");

    res
      .status(201)
      .json({ message: "User Registered successfully", data: result.rows[0] });
  } catch (error) {
    if (client) await client.query("ROLLBACK");
    next(error);
  } finally {
    if (client) client.release();
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

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const id = req.user.id;

    if (!oldPassword || !newPassword) {
      return next(new AppError("oldPassword and newPassword is required", 400));
    }

    const user = await pool.query(
      "SELECT id, password FROM users WHERE id = $1",
      [id],
    );
    if (user.rows.length === 0) {
      return next(new AppError("User not Found", 404));
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    const isValid = await bcrypt.compare(oldPassword, user.rows[0].password);
    if (!isValid) {
      return next(new AppError("Password not matched", 401));
    }
    await pool.query("UPDATE users SET password = $1 WHERE id= $2", [
      hashPassword,
      id,
    ]);

    res.json({ message: "Password Changed Successfully" });
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

module.exports = { register, login, changePassword, refreshToken, logout };
