import { z } from "zod";

export const destinationFormSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  location: z.string().min(3, "A localização deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  price: z.coerce.number().positive("O preço deve ser positivo"),
  rating: z.coerce.number().min(0, "A avaliação deve ser no mínimo 0").max(5, "A avaliação deve ser no máximo 5"),
  reviewCount: z.coerce.number().int().nonnegative("O número de avaliações deve ser não negativo"),
  imageUrl: z.string().url("URL inválida"),
  gallery: z.array(z.string().url("URL inválida")).optional(),
  featured: z.boolean().default(false),
  popular: z.boolean().default(false),
  region: z.string().optional(),
  tags: z.array(z.string()),
  coordinates: z
    .object({
      latitude: z.coerce.number(),
      longitude: z.coerce.number(),
    })
    .optional(),
});

export type DestinationFormValues = z.infer<typeof destinationFormSchema>;
