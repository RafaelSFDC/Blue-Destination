"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { actions } from "@/lib/store";
import { authenticateUser } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const demoLogin = async (type: "user" | "admin") => {
    setIsLoading(true);

    try {
      const email = type === "admin" ? "admin@example.com" : "joao@example.com";
      const result = await authenticateUser(email, "password");

      if (result.success && result.user) {
        actions.login(result.user);

        toast({
          title: "Login de demonstração",
          description: `Logado como ${
            type === "admin" ? "administrador" : "usuário"
          }.`,
        });
      } else {
        toast({
          title: "Erro ao fazer login",
          description: result.message || "Credenciais inválidas",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description:
          "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await authenticateUser(email, password);

      if (result.success && result.user) {
        actions.login(result.user);

        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo(a) de volta, ${result.user.name}!`,
        });
      } else {
        toast({
          title: "Erro ao fazer login",
          description: result.message || "Credenciais inválidas",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description:
          "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
        variant: "destructive",
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
              alt="Login"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-primary/60 p-8 text-white">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Blue Destination</h2>
                  <p className="mt-2">Sua próxima aventura começa aqui</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">
                    "Viajar é a única coisa que você compra que te deixa mais
                    rico."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de login */}
          <div className="p-8">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold">Bem-vindo(a) de volta</h1>
              <p className="mt-2 text-muted-foreground">
                Entre com suas credenciais para acessar sua conta
              </p>
            </div>

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

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>

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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Lembrar de mim
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou continue com
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => demoLogin("user")}
                  disabled={isLoading}
                >
                  Login como Usuário
                </Button>
                <Button
                  variant="outline"
                  onClick={() => demoLogin("admin")}
                  disabled={isLoading}
                >
                  Login como Admin
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center text-sm">
              Não tem uma conta?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Cadastre-se
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
