"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { cn, formatCurrency } from "@/lib/utils";
import { createBooking } from "@/actions/bookings";
import { useUser } from "@/querys/useUser";
import { LoginDialog } from "@/components/login-dialog";

// Schema de validação
const bookingSchema = z.object({
  travelDate: z.date({
    required_error: "Selecione a data da viagem",
  }).refine(date => date > new Date(), {
    message: "A data deve ser no futuro",
  }),
  travelers: z.coerce.number().min(1, "Mínimo de 1 viajante").max(10, "Máximo de 10 viajantes"),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  packageId: string;
  packageName: string;
  price: number;
  minDate?: Date;
  maxDate?: Date;
}

export function BookingForm({
  packageId,
  packageName,
  price,
  minDate,
  maxDate,
}: BookingFormProps) {
  const router = useRouter();
  const { data: user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  
  // Configuração do formulário com react-hook-form e zod
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      travelers: 1,
    },
  });

  // Calcular preço total
  const travelers = form.watch("travelers") || 1;
  const totalPrice = price * travelers;

  // Função para lidar com o envio do formulário
  async function onSubmit(data: BookingFormValues) {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    try {
      setIsLoading(true);
      
      const result = await createBooking({
        packageId,
        travelDate: data.travelDate.toISOString(),
        travelers: data.travelers,
      });
      
      if (result.success) {
        toast.success("Reserva realizada com sucesso", {
          description: "Você será redirecionado para a página de detalhes da reserva.",
        });
        
        // Redirecionar para a página de detalhes da reserva
        router.push(`/dashboard/bookings/${result.bookingId}`);
      }
    } catch (error) {
      console.error("Erro ao fazer reserva:", error);
      toast.error("Falha ao fazer reserva", {
        description: "Ocorreu um erro ao processar sua reserva. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Função para lidar com o sucesso do login
  const handleLoginSuccess = () => {
    // Apenas fechar o dialog, o usuário pode continuar o processo de reserva
    toast.success("Login realizado com sucesso", {
      description: "Agora você pode continuar com sua reserva.",
    });
  };

  return (
    <>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-xl font-semibold">Reservar Pacote</h3>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="travelDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data da Viagem</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            new Date(field.value).toLocaleDateString("pt-BR")
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          
                          // Desabilitar datas passadas
                          if (date < today) return true;
                          
                          // Aplicar minDate e maxDate se fornecidos
                          if (minDate && date < minDate) return true;
                          if (maxDate && date > maxDate) return true;
                          
                          return false;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Selecione a data de início da sua viagem.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="travelers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Viajantes</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        className="pl-9"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Informe quantas pessoas irão viajar.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="rounded-lg bg-muted p-4">
              <div className="mb-2 flex items-center justify-between">
                <span>Preço por pessoa:</span>
                <span>{formatCurrency(price)}</span>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <span>Número de viajantes:</span>
                <span>{travelers}</span>
              </div>
              <div className="mt-2 border-t pt-2">
                <div className="flex items-center justify-between font-medium">
                  <span>Total:</span>
                  <span className="text-lg text-primary">{formatCurrency(totalPrice)}</span>
                </div>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processando..." : "Reservar Agora"}
            </Button>
          </form>
        </Form>
      </div>
      
      {/* Dialog de login */}
      <LoginDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}
