"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Clock,
  Download,
  Printer,
  Mail,
  Phone,
  MessageSquare,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { getBookingById, getPackageById } from "@/lib/actions";
import { useToast } from "@/components/ui/use-toast";

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const item = await params;

  // Em um app real, estes dados viriam do servidor
  const bookingData = await getBookingById(item.id);
  const packageData = bookingData
    ? await getPackageById(bookingData.packageId)
    : null;

  if (!bookingData || !packageData) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "refunded":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const handleDownloadVoucher = () => {
    setIsLoading(true);

    // Simulação de download
    setTimeout(() => {
      toast({
        title: "Voucher baixado com sucesso",
        description: "O voucher foi baixado para o seu dispositivo.",
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleSendEmail = () => {
    setIsLoading(true);

    // Simulação de envio de email
    setTimeout(() => {
      toast({
        title: "Email enviado com sucesso",
        description: "Os detalhes da reserva foram enviados para o seu email.",
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/bookings">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Detalhes da Reserva</h1>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSendEmail}
            disabled={isLoading}
          >
            <Mail className="mr-2 h-4 w-4" />
            Enviar por Email
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadVoucher}
            disabled={isLoading}
          >
            <Download className="mr-2 h-4 w-4" />
            Baixar Voucher
          </Button>
          <Button variant="outline" size="sm" disabled={isLoading}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="itinerary">Itinerário</TabsTrigger>
              <TabsTrigger value="payment">Pagamento</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 pt-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Informações da Reserva</CardTitle>
                      <CardDescription>
                        Detalhes da sua reserva #{bookingData.id}
                      </CardDescription>
                    </div>
                    <Badge
                      className={`capitalize ${getStatusColor(
                        bookingData.status
                      )}`}
                    >
                      {bookingData.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Pacote
                      </p>
                      <p className="font-medium">{packageData.name}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Destino
                      </p>
                      <p className="font-medium">Maldivas, Ásia</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Data da Reserva
                      </p>
                      <p className="font-medium">{bookingData.bookingDate}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Data da Viagem
                      </p>
                      <p className="font-medium">{bookingData.travelDate}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Duração
                      </p>
                      <p className="font-medium">{packageData.duration} dias</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Viajantes
                      </p>
                      <p className="font-medium">
                        {bookingData.travelers} pessoas
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-2 text-sm font-medium">Inclui</h3>
                    <ul className="grid gap-1 sm:grid-cols-2">
                      {packageData.inclusions.map((inclusion, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{inclusion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Nome
                      </p>
                      <p className="font-medium">João Pereira</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Email
                      </p>
                      <p className="font-medium">joao@example.com</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Telefone
                      </p>
                      <p className="font-medium">+55 (11) 98765-4321</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Endereço
                      </p>
                      <p className="font-medium">
                        Av. Paulista, 1000, São Paulo - SP
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Suporte 24/7</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Em caso de emergência ou dúvidas durante sua viagem, entre
                    em contato com nossa equipe de suporte:
                  </p>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-primary" />
                      <span>+55 (11) 9999-9999</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      <span>suporte@bluedestination.com</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <span>Chat no aplicativo</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="itinerary" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Itinerário da Viagem</CardTitle>
                  <CardDescription>
                    Roteiro detalhado do seu pacote
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {packageData.itinerary.map((day) => (
                      <div key={day.day} className="flex gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            Dia {day.day}: {day.title}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {day.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Detalhes do Pagamento</CardTitle>
                      <CardDescription>
                        Informações sobre seu pagamento
                      </CardDescription>
                    </div>
                    <Badge
                      className={`capitalize ${getPaymentStatusColor(
                        bookingData.paymentStatus
                      )}`}
                    >
                      {bookingData.paymentStatus}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Método de Pagamento
                      </p>
                      <p className="font-medium">Cartão de Crédito</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Data do Pagamento
                      </p>
                      <p className="font-medium">10/05/2023</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Número do Cartão
                      </p>
                      <p className="font-medium">**** **** **** 1234</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Titular do Cartão
                      </p>
                      <p className="font-medium">João Pereira</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Preço por pessoa</p>
                      <p>{formatCurrency(packageData.price)}</p>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Viajantes</p>
                      <p>x {bookingData.travelers}</p>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Taxas e impostos</p>
                      <p>{formatCurrency(500)}</p>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Seguro viagem</p>
                      <p>{formatCurrency(800)}</p>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-bold">
                      <p>Total</p>
                      <p>{formatCurrency(bookingData.totalPrice)}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    disabled={bookingData.paymentStatus !== "pending"}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pagar Agora
                  </Button>
                  <Button
                    variant="outline"
                    disabled={bookingData.paymentStatus !== "paid"}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Recibo
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Política de Cancelamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                      <span className="text-sm">
                        Cancelamento gratuito até 30 dias antes da viagem
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 text-yellow-500" />
                      <span className="text-sm">
                        Cancelamento com 70% de reembolso entre 30 e 15 dias
                        antes da viagem
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 text-orange-500" />
                      <span className="text-sm">
                        Cancelamento com 50% de reembolso entre 14 e 7 dias
                        antes da viagem
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="mt-0.5 h-4 w-4 text-red-500" />
                      <span className="text-sm">
                        Sem reembolso para cancelamentos com menos de 7 dias de
                        antecedência
                      </span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={bookingData.status === "cancelled"}
                  >
                    Solicitar Cancelamento
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader className="pb-2">
              <CardTitle>{packageData.name}</CardTitle>
              <CardDescription>Resumo da reserva</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video overflow-hidden rounded-md">
                <img
                  src={packageData.imageUrl || "/placeholder.svg"}
                  alt={packageData.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Data da Viagem</p>
                    <p className="text-sm text-muted-foreground">
                      {bookingData.travelDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Duração</p>
                    <p className="text-sm text-muted-foreground">
                      {packageData.duration} dias
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Destino</p>
                    <p className="text-sm text-muted-foreground">
                      Maldivas, Ásia
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Users className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Viajantes</p>
                    <p className="text-sm text-muted-foreground">
                      {bookingData.travelers} pessoas
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CreditCard className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Valor Total</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(bookingData.totalPrice)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full" asChild>
                <Link href={`/packages/${packageData.id}`}>
                  Ver Detalhes do Pacote
                </Link>
              </Button>
              <Button variant="outline" className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Suporte
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
