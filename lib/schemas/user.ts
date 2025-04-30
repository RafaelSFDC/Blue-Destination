import { z } from "zod";
import { UserRole } from "@/lib/types";

// Criando schema baseado na interface User existente
export const userSchema = z.object({
  $id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(UserRole),
  avatar: z.string().nullable(),
  phone: z.string().optional(),
  addresses: z.array(z.any()).optional(),
  favorites: z.array(z.any()).optional(),
  bookings: z.array(z.any()).default([]),
  notifications: z.array(z.any()).optional(),
  testimonials: z.array(z.any()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  preferences: z.any().optional()
});

export type UserSchema = z.infer<typeof userSchema>;