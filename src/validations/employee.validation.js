const { z } = require("zod");

const employeeSchema = z.object({
  name: z.string().min(2, "Name must be 2 character"),
  role: z.enum(["admin", "user"]),
  email: z.string().email("Invalid Email Format"),
  password: z.string().min("Password must be 6 cahracter long"),
});

module.exports = { employeeSchema };
