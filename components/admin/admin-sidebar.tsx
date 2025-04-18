"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSnapshot } from "valtio"
import { state } from "@/lib/store"
import {
  BarChart3,
  Package,
  Users,
  Calendar,
  Settings,
  Globe,
  CreditCard,
  MessageSquare,
  FileText,
  Home,
  LogOut,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { actions } from "@/lib/store"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: BarChart3,
  },
  {
    title: "Pacotes",
    href: "/admin/packages",
    icon: Package,
  },
  {
    title: "Destinos",
    href: "/admin/destinations",
    icon: Globe,
  },
  {
    title: "Usuários",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Reservas",
    href: "/admin/bookings",
    icon: Calendar,
  },
  {
    title: "Pagamentos",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Mensagens",
    href: "/admin/messages",
    icon: MessageSquare,
  },
  {
    title: "Conteúdo",
    href: "/admin/content",
    icon: FileText,
  },
  {
    title: "Configurações",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const snap = useSnapshot(state)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = () => {
    actions.logout()
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    })
    router.push("/login")
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Home className="h-5 w-5" />
          <span>Blue Destination</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {sidebarItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>
              {snap.auth.user?.name || "Administrador"} ({snap.auth.user?.email || "admin@bluedestination.com"})
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
