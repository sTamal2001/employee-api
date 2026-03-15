const express = require("express");
const { auditLogs } = require("../controllers/audiLog.controller");
const roleMiddleware = require("../middleware/role.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/", authMiddleware, roleMiddleware("admin"), auditLogs);

module.exports = router;
