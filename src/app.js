const express = require("express");
const core = require("cors");
const errorHandler = require("./middleware/error.middleware");

const testRoute = require("./routes/test.routes");
const employeeRoute = require("./routes/employee.routes");

const app = express();
app.use(core());
app.use(express.json());

app.use("/api", testRoute);
app.use("/api/employees", employeeRoute);

app.use(errorHandler);
module.exports = app;
