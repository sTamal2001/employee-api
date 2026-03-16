const express = require("express");
const router = express.Router();

const testRoute = require("../test.routes");
const employeeRoute = require("../employee.routes");
const authRoute = require("../auth.routes");
const audiLogRoute = require("../auditLog.routes");

router.use("/", testRoute);
router.use("/employees", employeeRoute);
router.use("/auth", authRoute);
router.use("/audit-logs", audiLogRoute);

module.exports = router;
