const redisClient = require("../config/redis");

const clearEmployeeCache = async () => {
  try {
    const keys = await redisClient.keys("employees:*");
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log("Employee cache cleared");
    }
  } catch (error) {
    console.error("Cache clear failed:", error.message);
  }
};

module.exports = clearEmployeeCache;
