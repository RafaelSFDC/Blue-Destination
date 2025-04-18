import Link from "next/link"
import { Edit, Eye, Calendar, User, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

// Dados mockados para reservas
const mockBookings = [
  {
    id: "booking-001",
    userId: "user-001",
    userName: "João Silva",
    packageId: "pkg-001",
    packageName: "Pacote para Maldivas",
    bookingDate: "2023-05-10",
    travelDate: "2023-07-15",
    returnDate: "2023-07-22",
    status: "confirmed",
    paymentStatus: "paid",
    totalPrice: 12500,
    travelers: 2,
  },
  {
    id: "booking-002",
    userId: "user-002",
    userName: "Maria Oliveira",
    packageId: "pkg-003",
    packageName: "Pacote para Santorini",
    bookingDate: "2023-05-12",
    travelDate: "2023-08-05",
    returnDate: "2023-08-12",
    status: "confirmed",
    paymentStatus: "paid",
    totalPrice: 15800,
    travelers: 2,
  },
  {
    id: "booking-003",
    userId: "user-003",
    userName: "Carlos Santos",
    packageId: "pkg-005",
    packageName: "Pacote para Tóquio",
    bookingDate: "2023-05-14",
    travelDate: "2023-09-10",
    returnDate: "2023-09-20",
    status: "pending",
    paymentStatus: "pending",
    totalPrice: 18200,
    travelers: 1,
  },
  {
    id: "booking-004",
    userId: "user-004",
    userName: "Ana Pereira",
    packageId: "pkg-002",
    packageName: "Pacote para Veneza",
    bookingDate: "2023-05-08",
    travelDate: "2023-06-20",
    returnDate: "2023-06-27",
    status: "cancelled",
    paymentStatus: "refunded",
    totalPrice: 9800,
    travelers: 3,
  },
  {
    id: "booking-005",
    userId: "user-005",
    userName: "Pedro Costa",
    packageId: "pkg-004",
    packageName: "Pacote para Machu Picchu",
    bookingDate: "2023-05-15",
    travelDate: "2023-08-15",
    returnDate: "2023-08-22",
    status: "confirmed",
    paymentStatus: "paid",
    totalPrice: 11200,
    travelers: 2,
  },
]

export default function AdminBookingsPage() {
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-")
    return `${day}/${month}/${year}`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Confirmada
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pendente
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Cancelada
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Concluída
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Desconhecido
          </Badge>
        )
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Pago
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pendente
          </Badge>
        )
      case "refunded":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Reembolsado
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Desconhecido
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reservas</h2>
          <p className="text-muted-foreground">Gerencie as reservas de pacotes de viagem.</p>
        </div>
        <Button asChild>
          <Link href="/admin/bookings/new">
            <Calendar className="mr-2 h-4 w-4" />
            Nova Reserva
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas as Reservas</CardTitle>
          <CardDescription>
            Total de {mockBookings.length} reserva{mockBookings.length !== 1 && "s"} cadastrada
            {mockBookings.length !== 1 && "s"}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reserva</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Pacote</TableHead>
                  <TableHead>Data da Viagem</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="font-medium">#{booking.id}</div>
                      <div className="text-xs text-muted-foreground">
                        Reservado em {formatDate(booking.bookingDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.userName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.packageName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {formatDate(booking.travelDate)} - {formatDate(booking.returnDate)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {booking.travelers} viajante{booking.travelers !== 1 && "s"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatCurrency(booking.totalPrice)}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell>{getPaymentStatusBadge(booking.paymentStatus)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/bookings/${booking.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Ver</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/bookings/${booking.id}/edit`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Reservas Confirmadas</CardTitle>
            <CardDescription>Reservas com status confirmado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {mockBookings.filter((booking) => booking.status === "confirmed").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (mockBookings.filter((booking) => booking.status === "confirmed").length / mockBookings.length) * 100,
              )}
              % do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Reservas Pendentes</CardTitle>
            <CardDescription>Reservas com status pendente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {mockBookings.filter((booking) => booking.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (mockBookings.filter((booking) => booking.status === "pending").length / mockBookings.length) * 100,
              )}
              % do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pagamentos Confirmados</CardTitle>
            <CardDescription>Reservas com pagamento confirmado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {mockBookings.filter((booking) => booking.paymentStatus === "paid").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (mockBookings.filter((booking) => booking.paymentStatus === "paid").length / mockBookings.length) * 100,
              )}
              % do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Receita Total</CardTitle>
            <CardDescription>Valor total das reservas confirmadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(
                mockBookings
                  .filter((booking) => booking.status === "confirmed")
                  .reduce((sum, booking) => sum + booking.totalPrice, 0),
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockBookings.filter((booking) => booking.status === "confirmed").length} reservas
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
