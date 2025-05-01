"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Trash2, Search, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  // Buscar notificações ao carregar a página
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Função para buscar notificações
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await getUserNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      toast.error("Erro ao buscar notificações");
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar notificações com base na busca e no tipo
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      searchQuery === "" ||
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === null || notification.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const unreadNotifications = filteredNotifications.filter((n) => !n.read);
  const readNotifications = filteredNotifications.filter((n) => n.read);

  // Função para marcar uma notificação como lida
  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      
      // Atualizar o estado local
      setNotifications(prev => 
        prev.map(notification => 
          notification.$id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      toast.success("Notificação marcada como lida");
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
      toast.error("Erro ao marcar notificação como lida");
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

  // Função para obter a cor do badge baseado no tipo da notificação
  const getNotificationTypeColor = (type: string) => {
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

  // Função para obter o texto do tipo de notificação
  const getNotificationTypeText = (type: string) => {
    switch (type) {
      case "info":
        return "Informação";
      case "success":
        return "Sucesso";
      case "warning":
        return "Aviso";
      case "error":
        return "Erro";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notificações</h1>
          <p className="text-muted-foreground">Gerencie suas notificações e alertas.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleMarkAllAsRead} 
            disabled={unreadNotifications.length === 0 || isLoading}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Marcar todas como lidas
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar notificações..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={typeFilter || ""} onValueChange={(value) => setTypeFilter(value || null)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os tipos</SelectItem>
            <SelectItem value="info">Informação</SelectItem>
            <SelectItem value="success">Sucesso</SelectItem>
            <SelectItem value="warning">Aviso</SelectItem>
            <SelectItem value="error">Erro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todas ({filteredNotifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Não lidas ({unreadNotifications.length})</TabsTrigger>
          <TabsTrigger value="read">Lidas ({readNotifications.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <LoadingState />
          ) : (
            <NotificationsList
              notifications={filteredNotifications}
              onMarkAsRead={handleMarkAsRead}
              getTypeColor={getNotificationTypeColor}
              getTypeText={getNotificationTypeText}
            />
          )}
        </TabsContent>

        <TabsContent value="unread" className="mt-6">
          {isLoading ? (
            <LoadingState />
          ) : (
            <NotificationsList
              notifications={unreadNotifications}
              onMarkAsRead={handleMarkAsRead}
              getTypeColor={getNotificationTypeColor}
              getTypeText={getNotificationTypeText}
            />
          )}
        </TabsContent>

        <TabsContent value="read" className="mt-6">
          {isLoading ? (
            <LoadingState />
          ) : (
            <NotificationsList
              notifications={readNotifications}
              onMarkAsRead={handleMarkAsRead}
              getTypeColor={getNotificationTypeColor}
              getTypeText={getNotificationTypeText}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LoadingState() {
  return (
    <Card>
      <CardContent className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </CardContent>
    </Card>
  );
}

interface NotificationsListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  getTypeColor: (type: string) => string;
  getTypeText: (type: string) => string;
}

function NotificationsList({
  notifications,
  onMarkAsRead,
  getTypeColor,
  getTypeText,
}: NotificationsListProps) {
  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Bell className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">Nenhuma notificação</h3>
          <p className="mt-2 text-sm text-muted-foreground">Você não tem notificações nesta categoria.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card key={notification.$id} className={notification.read ? "" : "border-primary/50 bg-primary/5"}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <Badge className={getTypeColor(notification.type)}>
                    {getTypeText(notification.type)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDateFns(notification.createdAt, "dd MMM yyyy, HH:mm")}
                  </span>
                </div>
                <h3 className="font-medium">{notification.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
              </div>
              <div className="ml-4 flex gap-2">
                {!notification.read && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => onMarkAsRead(notification.$id)}
                  >
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Marcar como lida</span>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
