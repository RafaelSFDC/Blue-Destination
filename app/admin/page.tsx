"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookings } from "@/querys/useBookings";
import useDestinations from "@/querys/useDestinations";
import usePackages from "@/querys/usePackages";
import { useUsers } from "@/querys/useUsers";
import { useMemo } from "react";

// Interface para os destinos populares
interface PopularDestination {
  id: string;
  name: string;
  popularity: number;
}

export default function AdminDashboard() {
  const { data: bookings, isLoading: isBookingsLoading } = useBookings();
  const { data: packages, isLoading: isPackagesLoading } = usePackages();
  const { data: destinations, isLoading: isDestinationsLoading } =
    useDestinations();
  const { data: users, isLoading: isUsersLoading } = useUsers();

  // Calcular estatísticas com base nos dados disponíveis
  const calculatedStats = useMemo(() => {
    if (
      isBookingsLoading ||
      isPackagesLoading ||
      isDestinationsLoading ||
      isUsersLoading
    ) {
      return null;
    }

    // Contagem de usuários
    const usersCount = users?.length || 0;

    // Contagem de reservas
    const bookingsCount = bookings?.length || 0;

    // Reservas ativas (status confirmed)
    const activeBookingsCount =
      bookings?.filter(
        (booking) =>
          booking.status === "confirmed" || booking.status === "active"
      ).length || 0;

    // Receita total (soma dos preços de todas as reservas)
    const totalRevenue =
      bookings?.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0) ||
      0;

    // Destinos populares (baseado nas reservas)
    const destinationCounts: Record<string, number> = {};
    bookings?.forEach((booking) => {
      if (booking.packages?.destinations) {
        booking.packages.destinations.forEach((dest: any) => {
          const destId = typeof dest === "object" ? dest.$id : dest;
          destinationCounts[destId] = (destinationCounts[destId] || 0) + 1;
        });
      }
    });

    // Converter para array e ordenar
    const popularDestinations: PopularDestination[] = Object.entries(
      destinationCounts
    )
      .map(([id, count]) => {
        const destination = destinations?.find(
          (d: any) => d.$id === id || d.id === id
        );
        return {
          id,
          name: destination?.name || "Destino desconhecido",
          popularity: Math.round((count / bookingsCount) * 100) || 0,
        };
      })
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5);

    return {
      usersCount,
      bookingsCount,
      activeBookingsCount,
      totalRevenue,
      popularDestinations,
    };
  }, [
    bookings,
    packages,
    destinations,
    users,
    isBookingsLoading,
    isPackagesLoading,
    isDestinationsLoading,
    isUsersLoading,
  ]);

  // Verificar se qualquer um dos dados está carregando
  const isLoading =
    isBookingsLoading ||
    isPackagesLoading ||
    isDestinationsLoading ||
    isUsersLoading;

  // Usar calculatedStats
  const stats = calculatedStats;

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
                <CardTitle className="text-sm font-medium">
                  Usuários Totais
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {stats?.usersCount || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +12% em relação ao mês passado
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pacotes Vendidos
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {stats?.bookingsCount || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +8% em relação ao mês passado
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Reservas Ativas
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {stats?.activeBookingsCount || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +18% em relação ao mês passado
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Receita Mensal
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {formatCurrency(stats?.totalRevenue || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +14% em relação ao mês passado
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Visão Geral</CardTitle>
                <CardDescription>
                  Vendas e reservas nos últimos 30 dias
                </CardDescription>
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
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center">
                        <Skeleton className="h-4 w-[46px] mr-2" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats?.popularDestinations?.map(
                      (destination: PopularDestination, i) => (
                        <div key={destination.id} className="flex items-center">
                          <div className="w-[46px] text-sm font-medium">
                            #{i + 1}
                          </div>
                          <div className="flex-1 font-medium">
                            {destination.name}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            {destination.popularity}%
                            <ArrowUpRight className="ml-1 h-4 w-4 text-green-500" />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/users" className="block">
              <Card className="h-full transition-all hover:border-primary hover:shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Gerenciar Usuários
                  </CardTitle>
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
                  <CardTitle className="text-sm font-medium">
                    Gerenciar Pacotes
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Adicione, edite e remova pacotes de viagem.
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/destinations" className="block">
              <Card className="h-full transition-all hover:border-primary hover:shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Gerenciar Destinos
                  </CardTitle>
                  <Map className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Adicione, edite e remova destinos turísticos.
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/bookings" className="block">
              <Card className="h-full transition-all hover:border-primary hover:shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Gerenciar Reservas
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Visualize e gerencie as reservas de pacotes.
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/payments" className="block">
              <Card className="h-full transition-all hover:border-primary hover:shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Gerenciar Pagamentos
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Visualize e gerencie os pagamentos recebidos.
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/messages" className="block">
              <Card className="h-full transition-all hover:border-primary hover:shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Gerenciar Mensagens
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Visualize e responda mensagens dos clientes.
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/content" className="block">
              <Card className="h-full transition-all hover:border-primary hover:shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Gerenciar Conteúdo
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Gerencie o conteúdo do site, blog e mídias.
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/settings" className="block">
              <Card className="h-full transition-all hover:border-primary hover:shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Configurações
                  </CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Configure as opções do sistema.
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </TabsContent>

        <TabsContent
          value="analytics"
          className="h-[400px] flex items-center justify-center text-muted-foreground"
        >
          <div className="text-center">
            <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">Análises</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Estatísticas detalhadas e análises de desempenho estarão
              disponíveis em breve.
            </p>
          </div>
        </TabsContent>

        <TabsContent
          value="reports"
          className="h-[400px] flex items-center justify-center text-muted-foreground"
        >
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">Relatórios</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Relatórios personalizados e exportáveis estarão disponíveis em
              breve.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
