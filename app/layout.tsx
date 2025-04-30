import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { actions } from "@/lib/store";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";

// Adicionar algumas notificações de exemplo
if (typeof window !== "undefined") {
  // Executar apenas no cliente
  setTimeout(() => {
    actions.addNotification({
      title: "Bem-vindo ao Blue Destination",
      message: "Explore nossos destinos e pacotes para sua próxima viagem!",
      type: "info",
    });

    setTimeout(() => {
      actions.addNotification({
        title: "Promoção Especial",
        message: "Pacotes para Europa com até 30% de desconto. Aproveite!",
        type: "success",
      });
    }, 5000);
  }, 2000);
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blue Destination - Viagens Inesquecíveis",
  description:
    "Descubra destinos incríveis e planeje sua próxima aventura com a Blue Destination.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
