"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useSnapshot } from "valtio"
import { state, actions } from "@/lib/store"
import { Camera, Loader2, Save, Lock, Bell, Globe, Trash2 } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const snap = useSnapshot(state)
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    name: snap.auth.user?.name || "",
    email: snap.auth.user?.email || "",
    phone: "+55 (11) 98765-4321",
    bio: "Viajante apaixonado, sempre em busca de novas aventuras e experiências pelo mundo.",
    address: "Av. Paulista, 1000, São Paulo - SP",
    city: "São Paulo",
    state: "SP",
    zipCode: "01310-100",
    country: "Brasil",
    language: "pt-BR",
    currency: "BRL",
    notifications: {
      email: true,
      push: true,
      sms: false,
      promotions: true,
      newsletter: true,
      tripReminders: true,
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (key: string, checked: boolean) => {
    setProfileData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: checked,
      },
    }))
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)

    // Simulação de salvamento
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Atualizar o nome do usuário no estado global
    if (snap.auth.user) {
      actions.login({
        ...snap.auth.user,
        name: profileData.name,
        email: profileData.email,
      })
    }

    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso.",
    })

    setIsLoading(false)
  }

  const handleChangePassword = async () => {
    setIsLoading(true)

    // Simulação de alteração de senha
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Senha alterada",
      description: "Sua senha foi alterada com sucesso.",
    })

    setIsLoading(false)
  }

  const handleDeleteAccount = async () => {
    setIsLoading(true)

    // Simulação de exclusão de conta
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Conta excluída",
      description: "Sua conta foi excluída permanentemente.",
    })

    actions.logout()
    router.push("/")

    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground">Gerencie suas informações pessoais e preferências</p>
      </div>

      <Tabs defaultValue="personal">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
          <TabsTrigger value="preferences">Preferências</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="account">Conta</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Foto de Perfil</CardTitle>
              <CardDescription>Esta foto será exibida em seu perfil e em suas avaliações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative h-24 w-24">
                  <Image
                    src={snap.auth.user?.avatar || "/placeholder.svg?height=100&width=100"}
                    alt="Foto de perfil"
                    fill
                    className="rounded-full object-cover"
                  />
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                    onClick={() => {
                      toast({
                        title: "Funcionalidade em desenvolvimento",
                        description: "A alteração de foto será implementada em breve.",
                      })
                    }}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Funcionalidade em desenvolvimento",
                        description: "A alteração de foto será implementada em breve.",
                      })
                    }}
                  >
                    Alterar Foto
                  </Button>
                  <Button
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      toast({
                        title: "Funcionalidade em desenvolvimento",
                        description: "A remoção de foto será implementada em breve.",
                      })
                    }}
                  >
                    Remover
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Atualize suas informações pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input id="name" name="name" value={profileData.name} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={profileData.email} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" name="phone" value={profileData.phone} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea id="bio" name="bio" rows={3} value={profileData.bio} onChange={handleChange} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
              <CardDescription>Atualize seu endereço de correspondência</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input id="address" name="address" value={profileData.address} onChange={handleChange} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" name="city" value={profileData.city} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input id="state" name="state" value={profileData.state} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input id="zipCode" name="zipCode" value={profileData.zipCode} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Input id="country" name="country" value={profileData.country} onChange={handleChange} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Idioma e Moeda</CardTitle>
              <CardDescription>Defina suas preferências de idioma e moeda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <select
                    id="language"
                    name="language"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={profileData.language}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, language: e.target.value }))}
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (United States)</option>
                    <option value="es-ES">Español</option>
                    <option value="fr-FR">Français</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Moeda</Label>
                  <select
                    id="currency"
                    name="currency"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={profileData.currency}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, currency: e.target.value }))}
                  >
                    <option value="BRL">Real Brasileiro (R$)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Globe className="mr-2 h-4 w-4" />
                    Salvar Preferências
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>Escolha como e quando deseja receber notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Notificações por Email</Label>
                    <p className="text-sm text-muted-foreground">Receba atualizações importantes por email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={profileData.notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Notificações Push</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações em tempo real no seu dispositivo
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={profileData.notifications.push}
                    onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">Notificações por SMS</Label>
                    <p className="text-sm text-muted-foreground">Receba alertas importantes por SMS</p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={profileData.notifications.sms}
                    onCheckedChange={(checked) => handleNotificationChange("sms", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="promo-notifications">Promoções e Ofertas</Label>
                    <p className="text-sm text-muted-foreground">Receba ofertas exclusivas e promoções especiais</p>
                  </div>
                  <Switch
                    id="promo-notifications"
                    checked={profileData.notifications.promotions}
                    onCheckedChange={(checked) => handleNotificationChange("promotions", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="newsletter">Newsletter</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba nossa newsletter com dicas de viagem e novidades
                    </p>
                  </div>
                  <Switch
                    id="newsletter"
                    checked={profileData.notifications.newsletter}
                    onCheckedChange={(checked) => handleNotificationChange("newsletter", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="trip-reminders">Lembretes de Viagem</Label>
                    <p className="text-sm text-muted-foreground">Receba lembretes sobre suas próximas viagens</p>
                  </div>
                  <Switch
                    id="trip-reminders"
                    checked={profileData.notifications.tripReminders}
                    onCheckedChange={(checked) => handleNotificationChange("tripReminders", checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Bell className="mr-2 h-4 w-4" />
                    Salvar Preferências
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>Atualize sua senha para manter sua conta segura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input id="current-password" type="password" placeholder="••••••••" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input id="new-password" type="password" placeholder="••••••••" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <Input id="confirm-password" type="password" placeholder="••••••••" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleChangePassword} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Alterando...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Alterar Senha
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sessões Ativas</CardTitle>
              <CardDescription>Gerencie os dispositivos onde sua conta está conectada</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Este dispositivo</p>
                    <p className="text-sm text-muted-foreground">Windows • Chrome • São Paulo, Brasil</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Sessão Atual
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">iPhone 13</p>
                    <p className="text-sm text-muted-foreground">
                      iOS • Safari • São Paulo, Brasil • Última atividade: 2 dias atrás
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Sessão encerrada",
                        description: "A sessão no iPhone 13 foi encerrada com sucesso.",
                      })
                    }}
                  >
                    Encerrar
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">MacBook Pro</p>
                    <p className="text-sm text-muted-foreground">
                      macOS • Firefox • Rio de Janeiro, Brasil • Última atividade: 1 semana atrás
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Sessão encerrada",
                        description: "A sessão no MacBook Pro foi encerrada com sucesso.",
                      })
                    }}
                  >
                    Encerrar
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => {
                  toast({
                    title: "Sessões encerradas",
                    description: "Todas as outras sessões foram encerradas com sucesso.",
                  })
                }}
              >
                Encerrar Todas as Outras Sessões
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Conta</CardTitle>
              <CardDescription>Gerencie suas informações de conta e preferências</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Exportar Dados</p>
                  <p className="text-sm text-muted-foreground">Baixe uma cópia de todos os seus dados</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Exportação iniciada",
                      description: "Seus dados estão sendo preparados para download.",
                    })
                  }}
                >
                  Exportar
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Histórico de Atividades</p>
                  <p className="text-sm text-muted-foreground">Visualize o histórico de atividades da sua conta</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Funcionalidade em desenvolvimento",
                      description: "O histórico de atividades será implementado em breve.",
                    })
                  }}
                >
                  Visualizar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
              <CardDescription>Ações irreversíveis para sua conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Excluir Conta</p>
                  <p className="text-sm text-muted-foreground">
                    Exclua permanentemente sua conta e todos os seus dados
                  </p>
                </div>
                <Button variant="destructive" onClick={handleDeleteAccount} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Excluindo...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir Conta
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
