import { z } from "zod";

export const tagSchema = z.object({
  $id: z.string(),
  name: z.string(),
  slug: z.string(),
  type: z.string(),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  createdAt: z.string(), // Aceita qualquer string de data
  updatedAt: z.string(), // Aceita qualquer string de data
});

export const tagArraySchema = z.array(tagSchema);

export type Tag = z.infer<typeof tagSchema>;

