import { z } from "zod";

export const AddToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number(),
});

export type AddToCartSchemaType = z.infer<typeof AddToCartSchema>;
