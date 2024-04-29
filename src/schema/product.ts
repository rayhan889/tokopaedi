import { z } from "zod";
import { CategorySchema } from "./category";

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  price: z.number().min(3),
  description: z.string().min(3),
  image: z.string().nullable(),
  categories: z.array(CategorySchema).nullable(),
});
