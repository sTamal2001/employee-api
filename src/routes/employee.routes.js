const router = require("express").Router();
const authMiddleware = require("../middleware/auth.middleware");

const {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employee.controller");
const roleMiddleware = require("../middleware/role.middleware");

router.post("/", authMiddleware, roleMiddleware("admin"), createEmployee);
router.get("/", authMiddleware, getEmployees);

router.put("/:id", authMiddleware, roleMiddleware("admin"), updateEmployee);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteEmployee);

module.exports = router;
