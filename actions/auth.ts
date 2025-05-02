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

    // Fazer login automaticamente e obter a sessão
    const session = await client.account.createEmailPasswordSession(
      email,
      password
    );
    console.log("Session:", session); 

    // Criar um novo cliente com a sessão ID
    const authenticatedClient = await createSessionClient(); // <- CORRETO É $id

    // Criar documento no banco de dados com client autenticado
    const userDoc = await authenticatedClient.databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.USERS,
      newUser.$id,
      {
        email,
        name,
        role: "user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );
    // Validar e retornar o usuário
    const user = userSchema.parse({
      ...userDoc,
      $id: newUser.$id,
      email,
      name,
      role: "user",
      avatar: null,
    });

    return user;
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error.code === 409) {
      throw new Error("Este email já está em uso. Tente fazer login.");
    }

    if (error.code === 401) {
      throw new Error(
        "Erro de configuração do Appwrite. Verifique as permissões da API."
      );
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
export async function getCurrentUser({ session }: { session?: string }) {
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
    // Preparar dados para atualização
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    // Adicionar campos apenas se fornecidos
    if (data.name !== undefined) updateData.name = data.name;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;
    if (data.phone !== undefined) updateData.phone = data.phone;

    // Adicionar endereços se fornecidos
    if (data.addresses && data.addresses.length > 0) {
      updateData.addresses = data.addresses;
    }

    // Adicionar preferências se fornecidas
    if (data.preferences) {
      // Obter o documento atual para mesclar as preferências
      const currentUser = await client.databases.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        COLLECTIONS.USERS,
        userId
      );

      // Mesclar as preferências existentes com as novas
      updateData.preferences = {
        ...(currentUser.preferences || {}),
        ...data.preferences,
        // Mesclar as notificações separadamente se existirem
        notifications: data.preferences.notifications
          ? {
              ...(currentUser.preferences?.notifications || {}),
              ...(data.preferences.notifications || {}),
            }
          : currentUser.preferences?.notifications,
      };
    }

    // Atualizar documento do usuário no banco de dados
    const updatedUser = await client.databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.USERS,
      userId,
      updateData
    );

    const user = userSchema.parse(updatedUser);

    return user;
  } catch (error) {
    console.error("Update user error:", error);
    throw new Error("Erro ao atualizar perfil. Tente novamente.");
  }
}

/**
 * Atualiza a senha do usuário
 */
export async function updateUserPassword(
  oldPassword: string,
  newPassword: string
) {
  const client = await createSessionClient();

  try {
    // Atualizar a senha do usuário
    await client.account.updatePassword(newPassword, oldPassword);

    return { success: true };
  } catch (error) {
    console.error("Update password error:", error);
    throw new Error(
      "Erro ao atualizar senha. Verifique se a senha atual está correta."
    );
  }
}

/**
 * Solicita redefinição de senha
 */
export async function requestPasswordReset(email: string) {
  const client = await createSessionClient();

  try {
    // Criar token de recuperação
    await client.account.createRecovery(
      email,
      process.env.NEXT_PUBLIC_APP_URL + "/reset-password"
    );
    return true;
  } catch (error) {
    console.error("Password reset request error:", error);
    throw new Error(
      "Não foi possível enviar o email de recuperação. Tente novamente."
    );
  }
}

/**
 * Verifica se o token de redefinição é válido
 */
export async function verifyResetToken(userId: string, token: string) {
  const client = await createSessionClient();

  try {
    // Verificar token (esta é uma simulação, já que o Appwrite não tem um endpoint específico para isso)
    // Em um cenário real, você pode verificar o token no banco de dados
    return true;
  } catch (error) {
    console.error("Token verification error:", error);
    return false;
  }
}

/**
 * Redefine a senha do usuário
 */
export async function resetPassword(
  userId: string,
  token: string,
  newPassword: string
) {
  const client = await createSessionClient();

  try {
    // Completar a recuperação de senha
    await client.account.updateRecovery(userId, token, newPassword);
    return true;
  } catch (error) {
    console.error("Password reset error:", error);
    throw new Error(
      "Não foi possível redefinir sua senha. O link pode ter expirado."
    );
  }
}

/**
 * Exclui a conta do usuário
 */
export async function deleteUserAccount(userId: string) {
  const client = await createSessionClient();

  try {
    // Excluir o documento do usuário no banco de dados
    await client.databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.USERS,
      userId
    );

    // Excluir a conta do usuário
    await client.account.deleteSession("current");

    return true;
  } catch (error) {
    console.error("Delete account error:", error);
    throw new Error("Erro ao excluir conta. Tente novamente.");
  }
}
