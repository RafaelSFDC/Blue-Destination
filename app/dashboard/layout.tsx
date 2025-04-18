import type React from "react"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Removido qualquer verificação de autenticação que poderia causar redirecionamento

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Meu Painel</h1>
          <p className="mt-2 text-muted-foreground">Gerencie suas reservas, preferências e informações pessoais</p>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <div className="mb-8 border-b">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <Link href="/dashboard" passHref legacyBehavior>
                <TabsTrigger
                  value="dashboard"
                  className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  Visão Geral
                </TabsTrigger>
              </Link>
              <Link href="/dashboard/bookings" passHref legacyBehavior>
                <TabsTrigger
                  value="bookings"
                  className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  Minhas Reservas
                </TabsTrigger>
              </Link>
              <Link href="/dashboard/favorites" passHref legacyBehavior>
                <TabsTrigger
                  value="favorites"
                  className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  Favoritos
                </TabsTrigger>
              </Link>
              <Link href="/dashboard/profile" passHref legacyBehavior>
                <TabsTrigger
                  value="profile"
                  className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  Meu Perfil
                </TabsTrigger>
              </Link>
            </TabsList>
          </div>

          {children}
        </Tabs>
      </div>

      <div className="mt-auto">
        <SiteFooter />
      </div>
    </div>
  )
}
