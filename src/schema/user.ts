import { z } from "zod";
import validator from "validator";

export const RegisterSchema = z.object({
  username: z.string().min(2).max(12),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email("This is not an valid email"),
  password: z.string().min(3).max(20),
  phone: z.string().min(2).refine(validator.isMobilePhone).nullable(),
});

export const LoginSchema = z.object({
  email: z.string().email("This is not an valid email"),
  password: z.string(),
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
