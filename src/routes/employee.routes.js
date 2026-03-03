const router = require("express").Router();

const {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee
} = require("../controllers/employee.controller");

router.post("/", createEmployee);
router.get("/", getEmployees);

router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);


module.exports = router;