import * as z from "zod";

const Auth = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export { Auth };
export type AuthType = z.infer<typeof Auth>;
