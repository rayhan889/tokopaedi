import { z } from "zod";

export const CreateDiscountSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(3),
  discountPercent: z.number(),
  active: z.boolean(),
});

export type DiscountSchema = z.infer<typeof CreateDiscountSchema>;
