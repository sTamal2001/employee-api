const { z } = require("zod");

const loginSchema = z.object({
  email: z.string().email("Invalid Email Format"),
  password: z.string().min(5,"Password must be 6 cahracter long"),
});

module.exports = { loginSchema };
