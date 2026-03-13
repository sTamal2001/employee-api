const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError("Authorization Header Missing", 401));
  }
  const token = authHeader.split(" ")[1];
  console.log(authHeader);

  if (!token) {
    return next(new AppError("Token is Missing", 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError("Expired or Invalid token", 401)); // ✅
  }
};

module.exports = authMiddleware;
