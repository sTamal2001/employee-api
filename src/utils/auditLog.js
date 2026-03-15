const pool = require("../config/db");

const auditLog = async ({ action, tableName, recordId, performedBy }) => {
  try {
    await pool.query(
      `INSERT INTO audit_logs (action, table_name, record_id, performed_by) VALUES ($1, $2, $3, $4)`,
      [action, tableName, recordId, performedBy],
    );
  } catch (error) {
    console.error("Audit log failed", error.message);
  }
};

module.exports = auditLog;
