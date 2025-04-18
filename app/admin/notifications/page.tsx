"use client"

import { useState } from "react"
import { Bell, Check, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useSnapshot } from "valtio"
import { state, actions } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function NotificationsPage() {
  const snap = useSnapshot(state)
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string | null>(null)

  const filteredNotifications = snap.notifications.filter((notification) => {
    const matchesSearch =
      searchQuery === "" ||
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = typeFilter === null || notification.type === typeFilter

    return matchesSearch && matchesType
  })

  const unreadNotifications = filteredNotifications.filter((n) => !n.read)
  const readNotifications = filteredNotifications.filter((n) => n.read)

  const handleMarkAsRead = (id: string) => {
    actions.markNotificationAsRead(id)
    toast({
      title: "Notificação lida",
      description: "A notificação foi marcada como lida.",
    })
  }

  const handleMarkAllAsRead = () => {
    actions.markAllNotificationsAsRead()
    toast({
      title: "Notificações lidas",
      description: "Todas as notificações foram marcadas como lidas.",
    })
  }

  const handleRemoveNotification = (id: string) => {
    actions.removeNotification(id)
    toast({
      title: "Notificação removida",
      description: "A notificação foi removida com sucesso.",
    })
  }

  const handleClearAll = () => {
    actions.clearNotifications()
    toast({
      title: "Notificações limpas",
      description: "Todas as notificações foram removidas.",
    })
  }

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-100 text-blue-800"
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notificações</h2>
          <p className="text-muted-foreground">Gerencie suas notificações e alertas.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleMarkAllAsRead} disabled={unreadNotifications.length === 0}>
            <Check className="mr-2 h-4 w-4" />
            Marcar todas como lidas
          </Button>
          <Button variant="outline" onClick={handleClearAll} disabled={filteredNotifications.length === 0}>
            <Trash2 className="mr-2 h-4 w-4" />
            Limpar todas
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
          <NotificationsList
            notifications={filteredNotifications}
            onMarkAsRead={handleMarkAsRead}
            onRemove={handleRemoveNotification}
            getTypeColor={getNotificationTypeColor}
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="unread" className="mt-6">
          <NotificationsList
            notifications={unreadNotifications}
            onMarkAsRead={handleMarkAsRead}
            onRemove={handleRemoveNotification}
            getTypeColor={getNotificationTypeColor}
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="read" className="mt-6">
          <NotificationsList
            notifications={readNotifications}
            onMarkAsRead={handleMarkAsRead}
            onRemove={handleRemoveNotification}
            getTypeColor={getNotificationTypeColor}
            formatDate={formatDate}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface NotificationsListProps {
  notifications: any[]
  onMarkAsRead: (id: string) => void
  onRemove: (id: string) => void
  getTypeColor: (type: string) => string
  formatDate: (date: Date) => string
}

function NotificationsList({
  notifications,
  onMarkAsRead,
  onRemove,
  getTypeColor,
  formatDate,
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
    )
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card key={notification.id} className={notification.read ? "" : "border-primary/50 bg-primary/5"}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <Badge className={getTypeColor(notification.type)}>
                    {notification.type === "info" && "Informação"}
                    {notification.type === "success" && "Sucesso"}
                    {notification.type === "warning" && "Aviso"}
                    {notification.type === "error" && "Erro"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatDate(notification.date)}</span>
                </div>
                <h3 className="font-medium">{notification.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
              </div>
              <div className="ml-4 flex gap-2">
                {!notification.read && (
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onMarkAsRead(notification.id)}>
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Marcar como lida</span>
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onRemove(notification.id)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remover</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
