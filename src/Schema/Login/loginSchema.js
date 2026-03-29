import * as z from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email or Username is required")
    .refine(
      (val) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || /^[a-z0-9_]{3,30}$/.test(val),
      "Enter valid email or username",
    ),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(25, "Password must be at most 25 characters"),
});
export default loginSchema;
