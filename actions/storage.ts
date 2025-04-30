"use server";

import { createSessionClient, COLLECTIONS } from "@/lib/appwrite";
import { ID } from "appwrite";

/**
 * Faz upload de uma imagem para o storage
 */
export async function uploadImage(file: File): Promise<string> {
  const client = await createSessionClient();

  try {
    // Criar um ID único para o arquivo
    const fileId = ID.unique();

    // Fazer upload do arquivo
    const result = await client.storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID!,
      fileId,
      file
    );

    // Obter a URL do arquivo
    const fileUrl = client.storage.getFileView(
      process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID!,
      result.$id
    );

    return fileUrl;
  } catch (error) {
    console.error("Upload image error:", error);
    throw new Error("Erro ao fazer upload da imagem. Tente novamente.");
  }
}

/**
 * Remove uma imagem do storage
 */
export async function deleteImage(fileId: string): Promise<boolean> {
  const client = await createSessionClient();

  try {
    // Remover o arquivo
    await client.storage.deleteFile(
      process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID!,
      fileId
    );

    return true;
  } catch (error) {
    console.error("Delete image error:", error);
    throw new Error("Erro ao remover a imagem. Tente novamente.");
  }
}

/**
 * Atualiza a imagem de perfil do usuário
 */
export async function updateProfileImage(
  userId: string,
  imageUrl: string
): Promise<boolean> {
  const client = await createSessionClient();

  try {
    // Atualizar o documento do usuário
    await client.databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.USERS,
      userId,
      {
        avatar: imageUrl,
        updatedAt: new Date().toISOString(),
      }
    );

    return true;
  } catch (error) {
    console.error("Update profile image error:", error);
    throw new Error("Erro ao atualizar a imagem de perfil. Tente novamente.");
  }
}
