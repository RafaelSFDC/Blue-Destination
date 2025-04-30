"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin, CreditCard, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/querys/useUser";
import { usePackages } from "@/querys/usePackages";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: user, isLoading: isLoadingUser } = useUser();

  // Usando as reservas que já vêm nos dados do usuário
  const bookings = user?.bookings || [];
  const isLoadingBookings = isLoadingUser;

  // Buscar todos os pacotes
  const { data: packages = [], isLoading: isLoadingAllPackages } =
    usePackages();

  // Filtrar pacotes recomendados com base nos interesses do usuário ou popularidade
  const recommendedPackages = useMemo(() => {
    if (!packages.length) return [];

    // Se o usuário tiver reservas anteriores, usar para recomendações
    if (bookings.length) {
      // Extrair destinos das reservas anteriores
      const previousDestinations = bookings
        .filter((booking) => booking.package?.destinations)
        .flatMap((booking) =>
          booking.package.destinations.map((dest) => dest.$id)
        )
        .filter(Boolean);

      // Filtrar pacotes que correspondam aos destinos similares
      const relatedPackages = packages
        .filter((pkg) => {
          // Verificar se o pacote tem destinos similares aos já visitados
          return previousDestinations.some((destId) =>
            pkg.destinations?.some((dest) => dest.$id === destId)
          );
        })
        .slice(0, 3);

      if (relatedPackages.length > 0) {
        return relatedPackages;
      }
    }

    // Caso contrário, mostrar pacotes em destaque ou com desconto
    return packages
      .filter(
        (pkg) => pkg.featured || (pkg.discounts && pkg.discounts.length > 0)
      )
      .slice(0, 3);
  }, [packages, bookings]);

  const isLoadingPackages = isLoadingAllPackages;

  const upcomingBookings = bookings.filter((b) => b.status === "confirmed");
  const unreadNotifications =
    user?.notifications?.filter((n) => !n.read).length || 0;

  return (
    <div className="space-y-8">
      {/* Boas-vindas */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>
            Bem-vindo(a) de volta{user?.name ? `, ${user.name}` : ""}!
          </CardTitle>
          <CardDescription>
            Aqui está um resumo da sua conta e próximas viagens.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center justify-center rounded-lg border p-4 text-center">
              <Calendar className="mb-2 h-8 w-8 text-primary" />
              {isLoadingBookings ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <h3 className="text-xl font-bold">{upcomingBookings.length}</h3>
              )}
              <p className="text-sm text-muted-foreground">
                Viagens Confirmadas
              </p>
            </div>

            <div className="flex flex-col items-center justify-center rounded-lg border p-4 text-center">
              <MapPin className="mb-2 h-8 w-8 text-primary" />
              <h3 className="text-xl font-bold">3</h3>
              <p className="text-sm text-muted-foreground">
                Destinos Visitados
              </p>
            </div>

            <div className="flex flex-col items-center justify-center rounded-lg border p-4 text-center">
              <CreditCard className="mb-2 h-8 w-8 text-primary" />
              <h3 className="text-xl font-bold">5.250</h3>
              <p className="text-sm text-muted-foreground">
                Pontos de Fidelidade
              </p>
            </div>

            <div className="flex flex-col items-center justify-center rounded-lg border p-4 text-center">
              <Bell className="mb-2 h-8 w-8 text-primary" />
              {isLoadingUser ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <h3 className="text-xl font-bold">{unreadNotifications}</h3>
              )}
              <p className="text-sm text-muted-foreground">Notificações</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Próximas Viagens */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Próximas Viagens</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/bookings">
              Ver todas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoadingBookings ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : upcomingBookings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">
                Nenhuma viagem agendada
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Você ainda não tem nenhuma viagem agendada. Que tal planejar sua
                próxima aventura?
              </p>
              <Button asChild>
                <Link href="/packages">Explorar Pacotes</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingBookings.map((booking) => (
              <Card key={booking.$id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {booking.package.name || "Pacote de Viagem"}
                  </CardTitle>
                  <CardDescription>Reserva #{booking.$id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <Calendar className="mr-2 mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Data da Viagem</p>
                        <p className="text-muted-foreground">
                          {booking.travelDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="mr-2 mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Destino</p>
                        <p className="text-muted-foreground">
                          {booking.package.destinations?.[0]?.name ||
                            "Não especificado"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CreditCard className="mr-2 mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Status do Pagamento</p>
                        <p className="text-muted-foreground capitalize">
                          {booking.payments?.[0]?.status || "Não especificado"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <Link href={`/dashboard/bookings/${booking.$id}`}>
                      Ver Detalhes
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recomendações */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Recomendados para Você</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/packages">
              Ver mais
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoadingPackages ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <div className="relative aspect-video overflow-hidden rounded-t-lg">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {recommendedPackages.map((pkg) => (
              <Card key={pkg.$id}>
                <div className="relative aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={
                      pkg.imageUrl ||
                      `/placeholder.svg?height=200&width=400&text=${pkg.name}`
                    }
                    alt={pkg.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{pkg.name}</CardTitle>
                  <CardDescription>A partir de R$ {pkg.price}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <Link href={`/packages/${pkg.$id}`}>Ver Detalhes</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
