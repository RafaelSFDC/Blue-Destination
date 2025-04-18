"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Search, User, LogOut, Settings, UserCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useSnapshot } from "valtio"
import { state, actions } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function AdminHeader() {
  const router = useRouter()
  const snap = useSnapshot(state)
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [showNotifications, setShowNotifications] = useState(false)

  const unreadNotifications = snap.notifications.filter((n) => !n.read).length

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault()
    actions.logout()

    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    })

    router.push("/login")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      toast({
        title: "Pesquisa iniciada",
        description: `Pesquisando por "${searchQuery}"...`,
      })
      // Em um sistema real, redirecionaria para uma página de resultados
      setSearchQuery("")
    }
  }

  const handleViewProfile = () => {
    router.push("/admin/profile")
  }

  const handleSettings = () => {
    router.push("/admin/settings")
  }

  const handleMarkAllAsRead = () => {
    actions.markAllNotificationsAsRead()
    toast({
      title: "Notificações lidas",
      description: "Todas as notificações foram marcadas como lidas.",
    })
  }

  return (
    <header className="flex h-16 items-center border-b px-4 bg-white">
      <SidebarTrigger className="mr-4" />

      <div className="relative hidden w-96 md:block">
        <form onSubmit={handleSearch}>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white">
                  {unreadNotifications > 9 ? "9+" : unreadNotifications}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Notificações</DialogTitle>
              <DialogDescription>
                {snap.notifications.length === 0
                  ? "Você não tem notificações."
                  : `Você tem ${snap.notifications.length} notificação(ões), ${unreadNotifications} não lida(s).`}
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto">
              {snap.notifications.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground">
                  <Bell className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2">Nenhuma notificação</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {snap.notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`rounded-lg border p-4 ${!notification.read ? "bg-muted/50" : ""}`}
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <Badge
                          className={`${
                            notification.type === "info"
                              ? "bg-blue-100 text-blue-800"
                              : notification.type === "success"
                                ? "bg-green-100 text-green-800"
                                : notification.type === "warning"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {notification.type === "info" && "Informação"}
                          {notification.type === "success" && "Sucesso"}
                          {notification.type === "warning" && "Aviso"}
                          {notification.type === "error" && "Erro"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(notification.date).toLocaleString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="mb-1 font-medium">{notification.title}</div>
                      <div className="text-sm text-muted-foreground">{notification.message}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {snap.notifications.length > 0 && (
              <div className="mt-4 flex justify-between">
                <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                  Marcar todas como lidas
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    actions.clearNotifications()
                    toast({
                      title: "Notificações limpas",
                      description: "Todas as notificações foram removidas.",
                    })
                  }}
                >
                  Limpar todas
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={snap.auth.user?.avatar || ""} alt={snap.auth.user?.name || ""} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{snap.auth.user?.name || "Administrador"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {snap.auth.user?.email || "admin@bluedestination.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleViewProfile}>
              <UserCircle className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettings}>
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/admin/content")}>
              <FileText className="mr-2 h-4 w-4" />
              Conteúdo
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
