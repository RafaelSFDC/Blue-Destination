"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { registerUser } from "@/actions/auth"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Campos obrigatórios", {
        description: "Por favor, preencha todos os campos."
      })
      return
    }

    if (password !== confirmPassword) {
      toast.error("Senhas não conferem", {
        description: "A senha e a confirmação de senha devem ser iguais."
      })
      return
    }

    if (!acceptTerms) {
      toast.error("Termos e condições", {
        description: "Você precisa aceitar os termos e condições para continuar."
      })
      return
    }

    setIsLoading(true)

    try {
      const user = await registerUser(email, password, name)
      
      toast.success("Registro realizado com sucesso", {
        description: `Bem-vindo(a), ${name}!`
      })

      // Redirecionar para a página inicial
      router.push("/")
    } catch (error: any) {
      toast.error("Erro ao fazer registro", {
        description: error.message || "Ocorreu um erro ao processar sua solicitação. Tente novamente."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex flex-1 items-center justify-center py-12">
        <div className="grid w-full max-w-[900px] grid-cols-1 overflow-hidden rounded-lg border shadow-lg md:grid-cols-2">
          {/* Imagem lateral */}
          <div className="relative hidden md:block">
            <Image src="/placeholder.svg?height=800&width=600" alt="Register" fill className="object-cover" />
            <div className="absolute inset-0 bg-primary/60 p-8 text-white">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Blue Destination</h2>
                  <p className="mt-2">Crie sua conta e comece a planejar suas viagens</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">"A vida é curta e o mundo é grande. Explore-o enquanto pode."</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de registro */}
          <div className="p-8">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold">Criar uma conta</h1>
              <p className="mt-2 text-muted-foreground">Preencha os campos abaixo para criar sua conta</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

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
                <Label htmlFor="password">Senha</Label>
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
                    <span className="sr-only">{showPassword ? "Esconder senha" : "Mostrar senha"}</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
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
                    <span className="sr-only">{showConfirmPassword ? "Esconder senha" : "Mostrar senha"}</span>
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                  disabled={isLoading}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Eu aceito os{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    termos e condições
                  </Link>
                </label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Criar conta"
                )}
              </Button>

              <div className="mt-4 text-center text-sm">
                Já tem uma conta?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Faça login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

