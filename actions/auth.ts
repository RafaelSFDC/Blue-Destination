"use server";

import { createSessionClient, COLLECTIONS } from "@/lib/appwrite";
import type { User } from "@/lib/types";
import { userSchema } from "@/lib/schemas/user";

/**
 * Autentica um usuário com email e senha
 */
export async function authenticateUser(email: string, password: string) {
  const client = await createSessionClient();

  try {
    // Tentar login
    const session = await client.account.createEmailPasswordSession(
      email,
      password
    );
    const accountDetails = await client.account.get();

    // Buscar informações adicionais do usuário no banco de dados
    const userDoc = await client.databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.USERS,
      accountDetails.$id
    );

    // Preparar dados para validação
    const userData = {
      ...userDoc,
      $id: accountDetails.$id,
      email: accountDetails.email,
      name: userDoc.name || accountDetails.name,
      role: userDoc.role || "user",
      avatar: userDoc.avatar || null,
    };

    // Validar com o schema
    const user = userSchema.parse(userData);

    return user;
  } catch (error) {
    console.error("Authentication error:", error);
    throw new Error("Credenciais inválidas ou usuário não encontrado");
  }
}

/**
 * Registra um novo usuário
 */
export async function registerUser(
  email: string,
  password: string,
  name: string
) {
  const client = await createSessionClient();

  try {
    // Criar novo usuário
    const newUser = await client.account.create(
      "unique()",
      email,
      password,
      name
    );

    // Fazer login automaticamente
    await client.account.createEmailPasswordSession(email, password);

    // Criar documento do usuário no banco de dados
    const userDoc = await client.databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.USERS,
      newUser.$id,
      {
        email: email,
        name: name,
        role: "user",
        createdAt: new Date().toISOString(),
      }
    );

    const user = userSchema.parse({
      ...userDoc,
      ...newUser,
      $id: newUser.$id,
      email: newUser.email,
      name: newUser.name,
      role: "user",
      avatar: null,
    });

    return user;
  } catch (error: any) {
    console.error("Registration error:", error);

    // Verificar se o erro é de usuário já existente
    if (error.code === 409) {
      throw new Error("Este email já está em uso. Tente fazer login.");
    }

    throw new Error("Erro ao criar conta. Tente novamente.");
  }
}

/**
 * Encerra a sessão do usuário atual
 */
export async function logoutUser() {
  const client = await createSessionClient();

  try {
    await client.account.deleteSession("current");
    return "Logout realizado com sucesso";
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error("Erro ao encerrar sessão. Tente novamente.");
  }
}

/**
 * Obtém o usuário atual
 */
export async function getCurrentUser() {
  const client = await createSessionClient();

  try {
    const account = await client.account.get();

    // Buscar informações adicionais do usuário no banco de dados
    const userDoc = await client.databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.USERS,
      account.$id
    );

    const user = userSchema.parse({
      ...userDoc,
      $id: account.$id,
      email: account.email,
      name: userDoc.name || account.name,
      role: userDoc.role || "user",
      avatar: userDoc.avatar || null,
    });

    return user;
  } catch (error) {
    console.error("Get current user error:", error);
    throw new Error("Erro ao obter usuário atual. Tente novamente.");
  }
}

/**
 * Atualiza os dados do usuário
 */
export async function updateUserProfile(userId: string, data: Partial<User>) {
  const client = await createSessionClient();

  try {
    // Atualizar documento do usuário no banco de dados
    const updatedUser = await client.databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.USERS,
      userId,
      {
        name: data.name,
        avatar: data.avatar,
      }
    );

    const user = userSchema.parse(updatedUser);

    return user;
  } catch (error) {
    console.error("Update user error:", error);
    throw new Error("Erro ao atualizar perfil. Tente novamente.");
  }
}
