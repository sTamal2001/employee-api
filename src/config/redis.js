const redis = require("redis");

const client = redis.createClient({ url: process.env.REDIS_URL });

client.on("error", (err) => {
  console.error("Redis Error", err.message);
});

client.on("connect", () => {
  console.log("Redis conneted");
});

client.connect();

module.exports = client;
