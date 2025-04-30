import Link from "next/link"
import { ArrowRight, Calendar, MapPin, CreditCard, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserBookings } from "@/lib/actions"

export default async function Dashboard() {
  // Em um app real, você obteria o ID do usuário da sessão
  const userId = "user-001"
  const bookings = await getUserBookings(userId)

  const upcomingBookings = bookings.filter((b) => b.status === "confirmed")

  return (
    <div className="space-y-8">
      {/* Boas-vindas */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Bem-vindo(a) de volta!</CardTitle>
          <CardDescription>Aqui está um resumo da sua conta e próximas viagens.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center justify-center rounded-lg border p-4 text-center">
              <Calendar className="mb-2 h-8 w-8 text-primary" />
              <h3 className="text-xl font-bold">{upcomingBookings.length}</h3>
              <p className="text-sm text-muted-foreground">Viagens Confirmadas</p>
            </div>

            <div className="flex flex-col items-center justify-center rounded-lg border p-4 text-center">
              <MapPin className="mb-2 h-8 w-8 text-primary" />
              <h3 className="text-xl font-bold">3</h3>
              <p className="text-sm text-muted-foreground">Destinos Visitados</p>
            </div>

            <div className="flex flex-col items-center justify-center rounded-lg border p-4 text-center">
              <CreditCard className="mb-2 h-8 w-8 text-primary" />
              <h3 className="text-xl font-bold">5.250</h3>
              <p className="text-sm text-muted-foreground">Pontos de Fidelidade</p>
            </div>

            <div className="flex flex-col items-center justify-center rounded-lg border p-4 text-center">
              <Bell className="mb-2 h-8 w-8 text-primary" />
              <h3 className="text-xl font-bold">2</h3>
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

        {upcomingBookings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">Nenhuma viagem agendada</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Você ainda não tem nenhuma viagem agendada. Que tal planejar sua próxima aventura?
              </p>
              <Button asChild>
                <Link href="/packages">Explorar Pacotes</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingBookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Pacote para Maldivas</CardTitle>
                  <CardDescription>Reserva #{booking.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <Calendar className="mr-2 mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Data da Viagem</p>
                        <p className="text-muted-foreground">{booking.travelDate}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="mr-2 mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Destino</p>
                        <p className="text-muted-foreground">Maldivas, Ásia</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CreditCard className="mr-2 mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Status do Pagamento</p>
                        <p className="text-muted-foreground capitalize">{booking.paymentStatus}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href={`/dashboard/bookings/${booking.id}`}>Ver Detalhes</Link>
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

        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <div className="relative aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={`/placeholder.svg?height=200&width=400&text=Destino+${i}`}
                  alt={`Destino ${i}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Destino Popular {i}</CardTitle>
                <CardDescription>A partir de R$ {1500 + i * 500}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/packages/pkg-00${i}`}>Ver Detalhes</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
