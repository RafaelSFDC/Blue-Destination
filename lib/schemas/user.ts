import { z } from "zod";
import type { User } from "@/lib/types";

// Usando z.custom para garantir que o schema seja idêntico ao type User
export const userSchema = z.custom<User>();
export const userArraySchema = z.array(userSchema);

// Se precisar de validações específicas em alguns campos, pode usar z.custom<User>().superRefine()
// para adicionar validações personalizadas sem redefinir a estrutura

export type UserSchema = z.infer<typeof userSchema>;
export type UsersSchema = z.infer<typeof userSchema>[];
