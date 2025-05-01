"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  notFound,
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
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
  AlertTriangle,
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
import { toast } from "sonner";
import { useUser } from "@/querys/useUser";
import { BookingStatus, PaymentStatus, Booking, Package } from "@/lib/types";
import { PaymentCheckout } from "@/components/payment-checkout";
import { createStripeCheckoutSession } from "@/actions/payment";
import { cancelBooking } from "@/actions/bookings";

export default function BookingDetailsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentCancelled, setPaymentCancelled] = useState(false);
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = params.id as string;

  // Buscar dados do usuário e suas reservas usando React Query
  const { data: userData, isLoading: isLoadingUser } = useUser();

  // Encontrar a reserva específica pelo ID
  const bookingData = userData?.bookings?.find(
    (booking) => booking.$id === bookingId
  ) as Booking | undefined;

  // O pacote já está incluído na reserva
  const packageData = bookingData?.package as Package | undefined;

  const isPageLoading = isLoadingUser;

  // Verificar parâmetros de URL para status de pagamento
  useEffect(() => {
    const paymentSuccess = searchParams.get("payment_success");
    const paymentCancelled = searchParams.get("payment_cancelled");

    if (paymentSuccess === "true") {
      setPaymentSuccess(true);
      toast.success("Pagamento realizado com sucesso", {
        description: "Sua reserva foi confirmada. Obrigado pela sua compra!",
      });

      // Remover parâmetros da URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }

    if (paymentCancelled === "true") {
      setPaymentCancelled(true);
      toast.error("Pagamento cancelado", {
        description:
          "Você cancelou o processo de pagamento. Tente novamente quando estiver pronto.",
      });

      // Remover parâmetros da URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

  // Redirecionamento se não encontrar dados
  if (!isPageLoading && (!bookingData || !packageData)) {
    return notFound();
  }

  // Definir tipos para os dados que podem não estar no formato esperado
  const passengers = bookingData?.Passengers || [];
  const itinerary = packageData?.itinerarys || [];
  const payments = bookingData?.payments || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case BookingStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case BookingStatus.CANCELLED:
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case BookingStatus.COMPLETED:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case PaymentStatus.PAID:
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case PaymentStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case PaymentStatus.REFUNDED:
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case PaymentStatus.FAILED:
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  // Função para processar o pagamento
  const handlePayment = async () => {
    try {
      setIsLoading(true);

      // Criar sessão de checkout do Stripe
      const result = await createStripeCheckoutSession(bookingId);

      if (result.success && result.url) {
        // Redirecionar para a página de checkout do Stripe
        window.location.href = result.url;
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      toast.error("Erro ao processar pagamento", {
        description:
          "Não foi possível iniciar o processo de pagamento. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para cancelar a reserva
  const handleCancelBooking = async () => {
    if (!confirm("Tem certeza que deseja cancelar esta reserva?")) {
      return;
    }

    try {
      setIsLoading(true);
      await cancelBooking(bookingId);

      toast.success("Reserva cancelada com sucesso", {
        description:
          "Sua reserva foi cancelada. Se você realizou algum pagamento, o reembolso será processado em breve.",
      });

      // Atualizar a página
      router.refresh();
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
      toast.error("Erro ao cancelar reserva", {
        description: "Não foi possível cancelar sua reserva. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadVoucher = () => {
    setIsLoading(true);

    // Simulação de download
    setTimeout(() => {
      toast.success("Voucher baixado com sucesso", {
        description: "O voucher foi baixado para o seu dispositivo.",
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleSendEmail = () => {
    setIsLoading(true);

    // Simulação de envio de email
    setTimeout(() => {
      toast.success("Email enviado com sucesso", {
        description: "Os detalhes da reserva foram enviados para o seu email.",
      });
      setIsLoading(false);
    }, 1500);
  };

  if (isPageLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

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
                        Detalhes da sua reserva #{bookingData?.$id}
                      </CardDescription>
                    </div>
                    <Badge
                      className={`capitalize ${getStatusColor(
                        bookingData?.status || BookingStatus.PENDING
                      )}`}
                    >
                      {bookingData?.status || BookingStatus.PENDING}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Pacote
                      </p>
                      <p className="font-medium">
                        {packageData?.name || "Pacote não encontrado"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Viajantes
                      </p>
                      <p className="font-medium">
                        {bookingData?.travelers || 0} pessoas
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Contato de Emergência
                      </p>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">+55 11 99999-9999</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Endereço
                      </p>
                      <p className="font-medium">
                        {"Av. Paulista, 1000, São Paulo - SP"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Passageiros</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {passengers.map((passenger, index) => (
                      <div
                        key={passenger.$id || index}
                        className="rounded-lg border p-4"
                      >
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">
                              Nome Completo
                            </p>
                            <p className="font-medium">{passenger.name}</p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">
                              Documento
                            </p>
                            <p className="font-medium">
                              {passenger.document || "CPF"}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">
                              Data de Nascimento
                            </p>
                            <p className="font-medium">{passenger.birthDate}</p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">
                              Tipo
                            </p>
                            <p className="font-medium capitalize">{"Adulto"}</p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {passengers.length === 0 && (
                      <div className="rounded-lg border border-dashed p-6 text-center">
                        <p className="text-sm text-muted-foreground">
                          Nenhum passageiro adicionado ainda. Adicione os
                          detalhes dos passageiros para completar sua reserva.
                        </p>
                        <Button variant="outline" className="mt-4">
                          Adicionar Passageiros
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="itinerary" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Itinerário da Viagem</CardTitle>
                  <CardDescription>
                    Detalhes do seu roteiro de {packageData?.duration || 0} dias
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {itinerary.map((day: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <h3 className="font-medium">
                        Dia {index + 1}: {day.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {day.description}
                      </p>
                      {day.activities && (
                        <ul className="ml-6 list-disc text-sm">
                          {day.activities.map(
                            (activity: string, actIndex: number) => (
                              <li key={actIndex}>{activity}</li>
                            )
                          )}
                        </ul>
                      )}
                      {index < itinerary.length - 1 && <Separator />}
                    </div>
                  ))}
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
                        Informações sobre o pagamento da sua reserva
                      </CardDescription>
                    </div>
                    <Badge
                      className={`capitalize ${getPaymentStatusColor(
                        payments[0]?.status || "pending"
                      )}`}
                    >
                      {payments[0]?.status === "paid"
                        ? "Pago"
                        : payments[0]?.status === "pending"
                        ? "Pendente"
                        : payments[0]?.status === "refunded"
                        ? "Reembolsado"
                        : payments[0]?.status === "failed"
                        ? "Falhou"
                        : "Pendente"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {payments[0]?.status === "paid" ? (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 text-green-600 dark:text-green-400" />
                        <div>
                          <h3 className="font-medium text-green-800 dark:text-green-300">
                            Pagamento confirmado
                          </h3>
                          <p className="mt-1 text-sm text-green-700 dark:text-green-400">
                            Seu pagamento foi processado com sucesso. Você
                            receberá um email com os detalhes da sua reserva.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : payments[0]?.status === "failed" ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
                      <div className="flex items-start gap-3">
                        <XCircle className="mt-0.5 h-5 w-5 text-red-600 dark:text-red-400" />
                        <div>
                          <h3 className="font-medium text-red-800 dark:text-red-300">
                            Pagamento falhou
                          </h3>
                          <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                            Houve um problema ao processar seu pagamento. Por
                            favor, tente novamente ou use outro método de
                            pagamento.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        <div>
                          <h3 className="font-medium text-yellow-800 dark:text-yellow-300">
                            Pagamento pendente
                          </h3>
                          <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
                            Sua reserva está aguardando pagamento. Complete o
                            pagamento para confirmar sua reserva.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Método de Pagamento
                      </p>
                      <p className="font-medium">
                        {payments[0]?.method || "Cartão de Crédito"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Data do Pagamento
                      </p>
                      <p className="font-medium">
                        {payments[0]?.status === "paid"
                          ? new Date(
                              payments[0]?.updatedAt || Date.now()
                            ).toLocaleDateString()
                          : "Pendente"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Número da Transação
                      </p>
                      <p className="font-medium">
                        {payments[0]?.providerPaymentId
                          ? payments[0].providerPaymentId.substring(0, 8) +
                            "..."
                          : "N/A"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Parcelas
                      </p>
                      <p className="font-medium">
                        1x de {formatCurrency(bookingData?.totalPrice || 0)}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Preço por pessoa</p>
                      <p>{formatCurrency(packageData?.price || 0)}</p>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Viajantes</p>
                      <p>x {bookingData?.travelers || 0}</p>
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
                      <p>{formatCurrency(bookingData?.totalPrice || 0)}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant={
                      payments[0]?.status === "paid" ? "outline" : "default"
                    }
                    disabled={
                      payments[0]?.status === "paid" ||
                      bookingData?.status === BookingStatus.CANCELLED ||
                      isLoading
                    }
                    onClick={handlePayment}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {isLoading
                      ? "Processando..."
                      : payments[0]?.status === "paid"
                      ? "Pago"
                      : "Pagar Agora"}
                  </Button>
                  <Button
                    variant="outline"
                    disabled={payments[0]?.status !== "paid"}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Recibo
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Política de Cancelamento</CardTitle>
                  <CardDescription>
                    Informações sobre cancelamento e reembolso
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bookingData?.status === BookingStatus.CANCELLED ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
                      <div className="flex items-start gap-3">
                        <XCircle className="mt-0.5 h-5 w-5 text-red-600 dark:text-red-400" />
                        <div>
                          <h3 className="font-medium text-red-800 dark:text-red-300">
                            Reserva cancelada
                          </h3>
                          <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                            Esta reserva foi cancelada em{" "}
                            {new Date(
                              bookingData?.updatedAt || Date.now()
                            ).toLocaleDateString()}
                            .
                            {payments[0]?.status === "refunded"
                              ? " O reembolso foi processado e será creditado em sua conta em até 7 dias úteis."
                              : " Se você realizou algum pagamento, o reembolso será processado em breve."}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
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
                          Sem reembolso para cancelamentos com menos de 7 dias
                          de antecedência
                        </span>
                      </li>
                    </ul>
                  )}
                </CardContent>
                <CardFooter>
                  {bookingData?.status !== BookingStatus.CANCELLED ? (
                    <Button
                      variant="outline"
                      className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                      disabled={isLoading}
                      onClick={handleCancelBooking}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        "Solicitar Cancelamento"
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push("/packages")}
                    >
                      Ver outros pacotes
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader className="pb-2">
              <CardTitle>{packageData?.name || "Pacote"}</CardTitle>
              <CardDescription>Resumo da reserva</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video overflow-hidden rounded-md">
                <img
                  src={packageData?.imageUrl || "/placeholder.svg"}
                  alt={packageData?.name || "Pacote"}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Data da Viagem</p>
                    <p className="text-sm text-muted-foreground">
                      {bookingData?.travelDate || "Data não definida"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Duração</p>
                    <p className="text-sm text-muted-foreground">
                      {packageData?.duration || 0} dias
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
                      {bookingData?.travelers || 0} pessoas
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CreditCard className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Valor Total</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(bookingData?.totalPrice || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full" asChild>
                <Link href={`/packages/${packageData?.$id || ""}`}>
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
