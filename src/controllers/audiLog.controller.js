const pool = require("../config/db");

const auditLogs = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT audit_logs.id, audit_logs.action, audit_logs.table_name,
      audit_logs.record_id, audit_logs.created_at,
      users.email AS performed_by
      FROM audit_logs
      INNER JOIN 
      users on users.id = audit_logs.performed_by
      ORDER BY audit_logs.created_at DESC`,
    );
    const data = result.rows;
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

module.exports = { auditLogs };
