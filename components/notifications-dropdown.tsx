"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, CheckCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/actions/notifications";
import { formatDateFns } from "@/lib/utils";

interface Notification {
  $id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

export function NotificationsDropdown() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Buscar notificações quando o dropdown for aberto
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Função para buscar notificações
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await getUserNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para marcar uma notificação como lida
  const handleMarkAsRead = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await markNotificationAsRead(notificationId);
      
      // Atualizar o estado local
      setNotifications(prev => 
        prev.map(notification => 
          notification.$id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  };

  // Função para marcar todas as notificações como lidas
  const handleMarkAllAsRead = async () => {
    try {
      const result = await markAllNotificationsAsRead();
      
      if (result.success) {
        // Atualizar o estado local
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, read: true }))
        );
        
        toast.success(`${result.count} notificações marcadas como lidas`);
      }
    } catch (error) {
      console.error("Erro ao marcar todas notificações como lidas:", error);
      toast.error("Erro ao marcar notificações como lidas");
    }
  };

  // Contar notificações não lidas
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Função para obter a cor do badge baseado no tipo da notificação
  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary p-0 text-xs text-primary-foreground" 
              variant="default"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificações</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs" 
              onClick={handleMarkAllAsRead}
            >
              <CheckCheck className="mr-1 h-3 w-3" />
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            <Bell className="mx-auto mb-2 h-8 w-8 opacity-50" />
            <p>Nenhuma notificação</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <DropdownMenuGroup>
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.$id}
                  className={`flex flex-col items-start p-3 ${!notification.read ? 'bg-muted/50' : ''}`}
                  onClick={() => router.push('/dashboard/notifications')}
                >
                  <div className="flex w-full items-start justify-between">
                    <div className="flex items-center">
                      <Badge 
                        variant="outline" 
                        className={`mr-2 ${getNotificationColor(notification.type)}`}
                      >
                        {notification.type}
                      </Badge>
                      <span className="font-medium">{notification.title}</span>
                    </div>
                    
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => handleMarkAsRead(notification.$id, e)}
                      >
                        <Check className="h-3 w-3" />
                        <span className="sr-only">Marcar como lida</span>
                      </Button>
                    )}
                  </div>
                  
                  <p className="mt-1 text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                  
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDateFns(notification.createdAt, "dd MMM, HH:mm")}
                  </p>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </ScrollArea>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="justify-center text-center"
          onClick={() => router.push('/dashboard/notifications')}
        >
          Ver todas as notificações
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
