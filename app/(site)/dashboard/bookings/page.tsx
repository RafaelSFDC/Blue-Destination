"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, Download, Calendar, MapPin, Users, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { useUser } from "@/querys/useUser"
import { usePackages } from "@/querys/usePackages"
import { Booking } from "@/lib/types"

export default function BookingsPage() {
  const { data: user, isLoading: isLoadingUser } = useUser()
  
  // Obter reservas do usuário
  const bookings = user?.bookings || []
  const isLoading = isLoadingUser
  
  // Buscar todos os pacotes para obter detalhes
  const { data: allPackages = [], isLoading: isLoadingPackages } = usePackages()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "refunded":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Minhas Reservas</CardTitle>
          <CardDescription>Gerencie todas as suas reservas e viagens em um só lugar.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">Nenhuma reserva encontrada</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Você ainda não tem nenhuma reserva. Que tal planejar sua próxima aventura?
              </p>
              <Button asChild>
                <Link href="/packages">Explorar Pacotes</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reserva</TableHead>
                    <TableHead>Data da Viagem</TableHead>
                    <TableHead>Viajantes</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.$id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>#{booking.$id}</span>
                          <span className="text-xs text-muted-foreground">Reservado em {booking.bookingDate}</span>
                        </div>
                      </TableCell>
                      <TableCell>{booking.travelDate}</TableCell>
                      <TableCell>{booking.travelers}</TableCell>
                      <TableCell>{formatCurrency(booking.totalPrice)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`capitalize ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`capitalize ${getPaymentStatusColor(booking.payments?.[0]?.status || "pending")}`}
                        >
                          {booking.payments?.[0]?.status || "pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="icon" variant="ghost" asChild>
                            <Link href={`/dashboard/bookings/${booking.$id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Ver detalhes</span>
                            </Link>
                          </Button>
                          <Button size="icon" variant="ghost">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Baixar voucher</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {!isLoading && bookings.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => {
            // Encontrar o pacote correspondente à reserva
            const packageItem = allPackages.find(pkg => pkg.$id === booking.package?.$id) || booking.package
            
            return (
              <Card key={booking.$id} className="overflow-hidden">
                <div className="relative h-40 w-full">
                  <Image 
                    src={packageItem?.imageUrl || "/placeholder.svg?height=200&width=400"} 
                    alt={packageItem?.name || "Destino"} 
                    fill 
                    className="object-cover"
                  />
                  <Badge className={`absolute right-2 top-2 capitalize ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{packageItem?.name || "Pacote de Viagem"}</CardTitle>
                  <CardDescription>Reserva #{booking.$id}</CardDescription>
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
                        <p className="text-muted-foreground">
                          {packageItem?.destinations?.[0]?.name || "Múltiplos destinos"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Users className="mr-2 mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Viajantes</p>
                        <p className="text-muted-foreground">{booking.travelers} pessoas</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CreditCard className="mr-2 mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Valor Total</p>
                        <p className="text-muted-foreground">{formatCurrency(booking.totalPrice)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/dashboard/bookings/${booking.$id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Detalhes
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      Voucher
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
