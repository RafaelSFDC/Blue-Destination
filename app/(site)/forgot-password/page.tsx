"use client";

import { useState } from "react";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset } from "@/actions/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Campo obrigatório", {
        description: "Por favor, informe seu email.",
      });
      return;
    }

    setIsLoading(true);

    try {
      await requestPasswordReset(email);
      setIsSuccess(true);
      toast.success("Email enviado", {
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    } catch (error: any) {
      toast.error("Erro ao enviar email", {
        description: error.message || "Ocorreu um erro. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex flex-1 items-center justify-center py-12">
        <div className="grid w-full max-w-[900px] grid-cols-1 overflow-hidden rounded-lg border shadow-lg md:grid-cols-2">
          {/* Imagem lateral */}
          <div className="relative hidden md:block">
            <Image
              src="/placeholder.svg?height=800&width=600"
              alt="Recuperar senha"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-primary/60 p-8 text-white">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Blue Destination</h2>
                  <p className="mt-2">Recupere o acesso à sua conta</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">
                    "A jornada de mil milhas começa com um único passo."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de recuperação de senha */}
          <div className="p-8">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold">Recuperar senha</h1>
              <p className="mt-2 text-muted-foreground">
                {isSuccess
                  ? "Verifique seu email para redefinir sua senha"
                  : "Informe seu email para receber instruções de recuperação"}
              </p>
            </div>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <div className="rounded-full bg-primary/10 p-3">
                  <CheckCircle className="h-12 w-12 text-primary" />
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Enviamos um email com instruções para redefinir sua senha.
                  Por favor, verifique sua caixa de entrada e siga as instruções.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => router.push("/login")}
                >
                  Voltar para o login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar instruções"
                  )}
                </Button>

                <div className="mt-4 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center text-sm text-primary hover:underline"
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Voltar para o login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
