"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bell, Globe, Mail, MessageSquare, Phone } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPreferences } from "@/lib/types";

// Schema de validação
const preferencesSchema = z.object({
  newsletter: z.boolean().default(false),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    sms: z.boolean().default(false),
  }),
  currency: z.string().min(1, "Moeda é obrigatória"),
  language: z.string().min(1, "Idioma é obrigatório"),
});

type PreferencesFormValues = z.infer<typeof preferencesSchema>;

interface PreferencesFormProps {
  preferences?: Partial<UserPreferences>;
  onSave: (preferences: PreferencesFormValues) => void;
  isLoading?: boolean;
}

export function PreferencesForm({ preferences, onSave, isLoading = false }: PreferencesFormProps) {
  // Opções de moeda
  const currencies = [
    { value: "BRL", label: "Real Brasileiro (R$)" },
    { value: "USD", label: "Dólar Americano ($)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "GBP", label: "Libra Esterlina (£)" },
  ];

  // Opções de idioma
  const languages = [
    { value: "pt-BR", label: "Português (Brasil)" },
    { value: "en-US", label: "English (US)" },
    { value: "es-ES", label: "Español" },
  ];

  // Configuração do formulário com react-hook-form e zod
  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      newsletter: preferences?.newsletter || false,
      notifications: {
        email: preferences?.notifications?.email || true,
        push: preferences?.notifications?.push || true,
        sms: preferences?.notifications?.sms || false,
      },
      currency: preferences?.currency || "BRL",
      language: preferences?.language || "pt-BR",
    },
  });

  // Função para lidar com o envio do formulário
  function onSubmit(data: PreferencesFormValues) {
    onSave(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Comunicações</h3>
          
          <FormField
            control={form.control}
            name="newsletter"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Newsletter</FormLabel>
                  <FormDescription>
                    Receba novidades, promoções e dicas de viagem
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notificações</h3>
          
          <FormField
            control={form.control}
            name="notifications.email"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Email</FormLabel>
                    <FormDescription>
                      Receba notificações por email
                    </FormDescription>
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="notifications.push"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Push</FormLabel>
                    <FormDescription>
                      Receba notificações no navegador
                    </FormDescription>
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="notifications.sms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">SMS</FormLabel>
                    <FormDescription>
                      Receba notificações por SMS
                    </FormDescription>
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Regionalização</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Moeda</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma moeda" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Moeda utilizada para exibir preços
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Idioma</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um idioma" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language.value} value={language.value}>
                          {language.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Idioma utilizado na interface
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Preferências"}
        </Button>
      </form>
    </Form>
  );
}
