"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, CheckCheck } from "lucide-react";
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
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/actions/notifications";
import { formatDateFns } from "@/lib/utils";
import { useUser } from "@/querys/useUser";

export function NotificationsDropdown() {
  const router = useRouter();
  const { data: user, isLoading, refetch } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  // Função para marcar uma notificação como lida
  const handleMarkAsRead = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await markNotificationAsRead(notificationId);
      // Atualizar os dados do usuário após marcar como lida
      refetch();
      toast.success("Notificação marcada como lida");
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
      toast.error("Erro ao marcar notificação como lida");
    }
  };

  // Função para marcar todas as notificações como lidas
  const handleMarkAllAsRead = async (e) => {
    e.stopPropagation();
    try {
      await markAllNotificationsAsRead();
      // Atualizar os dados do usuário após marcar todas como lidas
      refetch();
      toast.success("Todas as notificações foram marcadas como lidas");
    } catch (error) {
      console.error("Erro ao marcar todas notificações como lidas:", error);
      toast.error("Erro ao marcar todas notificações como lidas");
    }
  };

  // Função para obter a cor do badge baseado no tipo de notificação
  const getNotificationColor = (type) => {
    switch (type) {
      case "info":
        return "text-blue-600 bg-blue-100";
      case "success":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "error":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Se o usuário não estiver logado ou estiver carregando, não mostrar nada
  if (isLoading || !user) {
    return null;
  }

  const notifications = user.notifications || [];
  const unreadCount = notifications.filter(n => !n.read).length;

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
        
        {notifications.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            <Bell className="mx-auto mb-2 h-8 w-8 opacity-50" />
            <p>Nenhuma notificação</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <DropdownMenuGroup>
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
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
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
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
                    {formatDateFns(notification.date, "dd MMM, HH:mm")}
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

