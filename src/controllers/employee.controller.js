const pool = require("../config/db");
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");
const auditLog = require("../utils/auditLog");

const createEmployee = async (req, res, next) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return next(new AppError("Name, Email and Role Required", 400));
    }
    // const hashPassword = await bcrypt.hash(password, 10);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new AppError("Invalid email format", 400));
    }

    const result = await pool.query(
      "INSERT INTO employees (name, email, role) VALUES ($1, $2, $3) RETURNING id, name, email, role",
      [name, email, role],
    );
    await auditLog({
      action: "CREATE",
      tableName: "employees",
      recordId: result.rows[0].id,
      performedBy: req.user.id,
    });
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const getEmployees = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;

    const searchText = search || "";
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 5;
    const offset = (pageNum - 1) * limitNum;

    const dataResult = await pool.query(
      `SELECT * FROM employees 
      WHERE name ILIKE $1
      ORDER BY id DESC
      LIMIT $2 OFFSET $3`,
      [`%${searchText}%`, limitNum, offset],
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM employees WHERE name ILIKE $1`,
      [`%${searchText}%`],
    );

    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limitNum);
    res.json({
      data: dataResult.rows,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    if (!name || !email || !role) {
      return next(new AppError("All fileds are Required", 400));
    }
    const result = await pool.query(
      `UPDATE employees SET name=$1, email=$2, role=$3 Where id=$4 RETURNING *`,
      [name, email, role, id],
    );
    if (result.rows.length === 0) {
      return next(new AppError("Employee Not Found", 404));
    }
    await auditLog({
      action: "UPDATE",
      tableName: "employees",
      recordId: result.rows[0].id,
      performedBy: req.user.id
    });
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `DELETE FROM employees WHERE id=$1 RETURNING *`,
      [id],
    );
    if (result.rows.length === 0) {
      return next(new AppError("Employee Not Found", 404));
    }

    await auditLog({
      action: "DELETE",
      tableName: "employees",
      recordId: result.rows[0].id,
      performedBy: req.user.id,
    });

    res.json({
      message: "Employee deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
};
