import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z.string().min(2),
  description: z.string().min(3),
});

export type CategorySchema = z.infer<typeof CreateCategorySchema>;
