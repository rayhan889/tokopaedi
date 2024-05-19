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

export const UserAddressSchema = z.object({
  id: z.string().nullable().optional(),
  addressLine1: z.string().min(5),
  addressLine2: z.string().min(5),
  postalCode: z.string().min(5),
  city: z.string().min(2),
  country: z.string().min(2),
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type UserAddressSchemaType = z.infer<typeof UserAddressSchema>;
