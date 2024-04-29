import { z } from "zod";
import { ProductSchema } from "./product";

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  products: z.array(ProductSchema).nullable(),
});
