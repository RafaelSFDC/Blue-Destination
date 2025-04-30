"use server";

import { ID, Query } from "appwrite";
import { createSessionClient, COLLECTIONS } from "@/lib/appwrite";
import { getCurrentUser } from "./auth";

/**
 * Cria uma nova notificação para o usuário
 */
export async function createNotification({
  title,
  message,
  type = "info",
  userId,
}: {
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  userId?: string;
}) {
  try {
    const client = await createSessionClient();
    
    // Se não foi fornecido um ID de usuário, usar o usuário atual
    let targetUserId = userId;
    if (!targetUserId) {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        throw new Error("Usuário não autenticado");
      }
      targetUserId = currentUser.$id;
    }
    
    // Criar nova notificação
    const notification = await client.databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.NOTIFICATIONS,
      ID.unique(),
      {
        user: targetUserId,
        title,
        message,
        type,
        read: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );
    
    return { success: true, notificationId: notification.$id };
  } catch (error) {
    console.error("Error creating notification:", error);
    throw new Error("Erro ao criar notificação. Tente novamente.");
  }
}

/**
 * Obtém as notificações do usuário atual
 */
export async function getUserNotifications() {
  try {
    const client = await createSessionClient();
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    const notifications = await client.databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.NOTIFICATIONS,
      [
        Query.equal("user", user.$id),
        Query.orderDesc("createdAt")
      ]
    );
    
    return notifications.documents;
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    throw new Error("Erro ao buscar notificações. Tente novamente.");
  }
}

/**
 * Marca uma notificação como lida
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    const client = await createSessionClient();
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    // Verificar se a notificação pertence ao usuário atual
    const notification = await client.databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.NOTIFICATIONS,
      notificationId
    );
    
    if (notification.user !== user.$id) {
      throw new Error("Acesso não autorizado");
    }
    
    // Atualizar a notificação
    await client.databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.NOTIFICATIONS,
      notificationId,
      {
        read: true,
        updatedAt: new Date().toISOString()
      }
    );
    
    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw new Error("Erro ao marcar notificação como lida. Tente novamente.");
  }
}

/**
 * Marca todas as notificações do usuário como lidas
 */
export async function markAllNotificationsAsRead() {
  try {
    const client = await createSessionClient();
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    // Buscar todas as notificações não lidas do usuário
    const notifications = await client.databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.NOTIFICATIONS,
      [
        Query.equal("user", user.$id),
        Query.equal("read", false)
      ]
    );
    
    // Atualizar cada notificação
    const updatePromises = notifications.documents.map(notification => 
      client.databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        COLLECTIONS.NOTIFICATIONS,
        notification.$id,
        {
          read: true,
          updatedAt: new Date().toISOString()
        }
      )
    );
    
    await Promise.all(updatePromises);
    
    return { success: true, count: notifications.documents.length };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw new Error("Erro ao marcar notificações como lidas. Tente novamente.");
  }
}
