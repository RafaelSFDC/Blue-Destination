"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword, verifyResetToken } from "@/actions/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  const token = searchParams.get("token");
  const userId = searchParams.get("userId");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token || !userId) {
        toast.error("Link inválido", {
          description: "O link de redefinição de senha é inválido ou expirou.",
        });
        setIsVerifying(false);
        return;
      }

      try {
        const isValid = await verifyResetToken(userId, token);
        setIsValidToken(isValid);
      } catch (error) {
        setIsValidToken(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Campos obrigatórios", {
        description: "Por favor, preencha todos os campos.",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Senhas não conferem", {
        description: "A senha e a confirmação de senha devem ser iguais.",
      });
      return;
    }

    if (password.length < 8) {
      toast.error("Senha muito curta", {
        description: "A senha deve ter pelo menos 8 caracteres.",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (!token || !userId) throw new Error("Token inválido");
      
      await resetPassword(userId, token, password);
      setIsSuccess(true);
      toast.success("Senha redefinida", {
        description: "Sua senha foi redefinida com sucesso.",
      });
    } catch (error: any) {
      toast.error("Erro ao redefinir senha", {
        description: error.message || "Ocorreu um erro. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isVerifying) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-center text-sm text-muted-foreground">
            Verificando link de redefinição de senha...
          </p>
        </div>
      );
    }

    if (!isValidToken) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <p className="text-center text-sm text-muted-foreground">
            O link de redefinição de senha é inválido ou expirou.
            Por favor, solicite um novo link.
          </p>
          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() => router.push("/forgot-password")}
          >
            Solicitar novo link
          </Button>
        </div>
      );
    }

    if (isSuccess) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="rounded-full bg-primary/10 p-3">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Sua senha foi redefinida com sucesso.
            Agora você pode fazer login com sua nova senha.
          </p>
          <Button
            className="mt-4 w-full"
            onClick={() => router.push("/login")}
          >
            Ir para o login
          </Button>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Nova senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="sr-only">
                {showPassword ? "Esconder senha" : "Mostrar senha"}
              </span>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="sr-only">
                {showConfirmPassword ? "Esconder senha" : "Mostrar senha"}
              </span>
            </Button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redefinindo...
            </>
          ) : (
            "Redefinir senha"
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
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex flex-1 items-center justify-center py-12">
        <div className="grid w-full max-w-[900px] grid-cols-1 overflow-hidden rounded-lg border shadow-lg md:grid-cols-2">
          {/* Imagem lateral */}
          <div className="relative hidden md:block">
            <Image
              src="/placeholder.svg?height=800&width=600"
              alt="Redefinir senha"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-primary/60 p-8 text-white">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Blue Destination</h2>
                  <p className="mt-2">Redefina sua senha</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">
                    "Segurança é a chave para uma jornada tranquila."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de redefinição de senha */}
          <div className="p-8">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold">Redefinir senha</h1>
              <p className="mt-2 text-muted-foreground">
                Crie uma nova senha para sua conta
              </p>
            </div>

            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}