const pool = require("../config/db");

// const testAPI = (req, res) => {
//   res.json({ message: "Working test" });
// };

const testAPI = async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "DB connected Successfully",
      time: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { testAPI };
