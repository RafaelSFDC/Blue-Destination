import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowUpRight,
  Users,
  Package,
  Calendar,
  CreditCard,
  TrendingUp,
  DollarSign,
  Map,
  MessageSquare,
  FileText,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Visualizar Site</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuários Totais</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-muted-foreground">+12% em relação ao mês passado</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pacotes Vendidos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">324</div>
                <p className="text-xs text-muted-foreground">+8% em relação ao mês passado</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reservas Ativas</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">+18% em relação ao mês passado</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 245.680</div>
                <p className="text-xs text-muted-foreground">+14% em relação ao mês passado</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Visão Geral</CardTitle>
                <CardDescription>Vendas e reservas nos últimos 30 dias</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center text-muted-foreground">
                  Gráfico de Vendas
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Destinos Populares</CardTitle>
                <CardDescription>Top destinos mais vendidos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Maldivas", "Santorini", "Tóquio", "Veneza", "Machu Picchu"].map((destination, i) => (
                    <div key={destination} className="flex items-center">
                      <div className="w-[46px] text-sm font-medium">#{i + 1}</div>
                      <div className="flex-1 font-medium">{destination}</div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        {85 - i * 12}%
                        <ArrowUpRight className="ml-1 h-4 w-4 text-green-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/users" className="block">
              <Card className="h-full transition-all hover:border-primary hover:shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Gerenciar Usuários</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Visualize e gerencie os usuários cadastrados no sistema.
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/packages" className="block">
              <Card className="h-full transition-all hover:border-primary hover:shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Gerenciar Pacotes</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">Adicione, edite e remova pacotes de viagem.</div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/destinations" className="block">
              <Card className="h-full transition-all hover:border-primary hover:shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Gerenciar Destinos</CardTitle>
                  <Map className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">Adicione, edite e remova destinos turísticos.</div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/bookings" className="block">
              <Card className="h-full transition-all hover:border-primary hover:shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Gerenciar Reservas</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">Visualize e gerencie as reservas de pacotes.</div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/payments" className="block">
              <Card className="h-full transition-all hover:border-primary hover:shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Gerenciar Pagamentos</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">Visualize e gerencie os pagamentos recebidos.</div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/messages" className="block">
              <Card className="h-full transition-all hover:border-primary hover:shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Gerenciar Mensagens</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">Visualize e responda mensagens dos clientes.</div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/content" className="block">
              <Card className="h-full transition-all hover:border-primary hover:shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Gerenciar Conteúdo</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">Gerencie o conteúdo do site, blog e mídias.</div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/settings" className="block">
              <Card className="h-full transition-all hover:border-primary hover:shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Configurações</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">Configure as opções do sistema.</div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="h-[400px] flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">Análises</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Estatísticas detalhadas e análises de desempenho estarão disponíveis em breve.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="h-[400px] flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">Relatórios</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Relatórios personalizados e exportáveis estarão disponíveis em breve.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
