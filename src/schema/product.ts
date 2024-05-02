import { z } from "zod";
import { CreateCategorySchema } from "./category";

export const CreateProductSchema = z.object({
  name: z.string().min(2),
  price: z.number().min(3),
  sku: z.string().min(3).max(12),
  description: z.string().min(3),
  image: z.string().nullable(),
  categories: z.array(CreateCategorySchema).nullable(),
});
