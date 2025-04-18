"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useSnapshot } from "valtio"
import { state, actions } from "@/lib/store"

export function Notifications() {
  const snap = useSnapshot(state)
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = snap.notifications.filter((n) => !n.read).length

  // Marcar todas como lidas quando o dropdown é aberto
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      actions.markAllNotificationsAsRead()
    }
  }, [isOpen, unreadCount])

  const getNotificationTypeStyles = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const formatDate = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return "Data inválida"
    }

    const now = new Date()
    const diff = now.getTime() - date.getTime()

    // Menos de 1 minuto
    if (diff < 60 * 1000) {
      return "Agora mesmo"
    }

    // Menos de 1 hora
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000))
      return `${minutes} ${minutes === 1 ? "minuto" : "minutos"} atrás`
    }

    // Menos de 1 dia
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000))
      return `${hours} ${hours === 1 ? "hora" : "horas"} atrás`
    }

    // Menos de 7 dias
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000))
      return `${days} ${days === 1 ? "dia" : "dias"} atrás`
    }

    // Formato de data normal
    return date.toLocaleDateString("pt-BR")
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 p-0 text-xs text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificações</span>
          {snap.notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs font-normal"
              onClick={() => actions.clearNotifications()}
            >
              Limpar todas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {snap.notifications.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">Nenhuma notificação</div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto">
            {snap.notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="cursor-default p-0">
                <div className={`w-full p-3 ${!notification.read ? "bg-muted/50" : ""}`}>
                  <div className="mb-1 flex items-center justify-between">
                    <Badge className={`${getNotificationTypeStyles(notification.type)}`}>
                      {notification.type === "info" && "Informação"}
                      {notification.type === "success" && "Sucesso"}
                      {notification.type === "warning" && "Aviso"}
                      {notification.type === "error" && "Erro"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(notification.date)}</span>
                  </div>
                  <div className="mb-1 font-medium">{notification.title}</div>
                  <div className="text-sm text-muted-foreground">{notification.message}</div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
