const express = require("express");
const core = require("cors");
const errorHandler = require("./middleware/error.middleware");

const v1Route = require("./routes/v1/index");

const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const AppError = require("./utils/AppError");

const app = express();

app.use(core());
app.use(helmet());
app.use(morgan("combined"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);

app.use(express.json());

app.use("/api/v1", v1Route);


app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} Not Found`, 404));
});
app.use(errorHandler);
module.exports = app;
