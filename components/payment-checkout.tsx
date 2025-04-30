"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { createStripeCheckoutSession, checkPaymentStatus } from "@/actions/payment";

interface PaymentCheckoutProps {
  bookingId: string;
  packageName: string;
  totalPrice: number;
  travelers: number;
}

export function PaymentCheckout({ bookingId, packageName, totalPrice, travelers }: PaymentCheckoutProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Função para iniciar o checkout com Stripe
  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      
      // Verificar se já existe uma sessão de pagamento
      const paymentStatus = await checkPaymentStatus(bookingId);
      
      if (paymentStatus.status === "paid") {
        toast.success("Pagamento já realizado", {
          description: "Esta reserva já foi paga com sucesso.",
        });
        return;
      }
      
      // Se já existe uma sessão, redirecionar para ela
      if (paymentStatus.status !== "not_started" && paymentStatus.url) {
        window.location.href = paymentStatus.url;
        return;
      }
      
      // Criar nova sessão de checkout
      const result = await createStripeCheckoutSession(bookingId);
      
      if (result.success && result.url) {
        // Redirecionar para a página de checkout do Stripe
        window.location.href = result.url;
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      toast.error("Erro ao processar pagamento", {
        description: "Não foi possível iniciar o processo de pagamento. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Pagamento</CardTitle>
        <CardDescription>Revise os detalhes antes de prosseguir com o pagamento</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4">
          <h3 className="mb-2 font-medium">{packageName}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Preço por pessoa:</span>
              <span>{formatCurrency(totalPrice / travelers)}</span>
            </div>
            <div className="flex justify-between">
              <span>Número de viajantes:</span>
              <span>{travelers}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span className="text-lg">{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-medium">Métodos de Pagamento</h3>
          <p className="text-sm text-muted-foreground">
            Processamos pagamentos de forma segura através do Stripe. Você poderá escolher entre:
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            <li className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span>Cartão de crédito</span>
            </li>
            <li className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span>Cartão de débito</span>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleCheckout} 
          disabled={isLoading} 
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pagar {formatCurrency(totalPrice)}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
