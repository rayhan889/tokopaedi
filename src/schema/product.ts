import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string().min(2),
  price: z.number().min(3),
  description: z.string().min(3),
  image: z.string().nullable(),
  categories: z.array(z.string()).nullable(),
});
