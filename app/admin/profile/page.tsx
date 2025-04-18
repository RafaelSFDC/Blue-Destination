"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useSnapshot } from "valtio"
import { state, actions } from "@/lib/store"
import { Loader2, Save, Upload, User } from "lucide-react"

export default function AdminProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const snap = useSnapshot(state)
  const [isSaving, setIsSaving] = useState(false)

  const [profileData, setProfileData] = useState({
    name: snap.auth.user?.name || "Administrador",
    email: snap.auth.user?.email || "admin@bluedestination.com",
    avatar: snap.auth.user?.avatar || "",
    bio: "Administrador do sistema Blue Destination com experiência em gestão de viagens e turismo.",
    phone: "+55 (11) 98765-4321",
    position: "Administrador",
    department: "Tecnologia",
    location: "São Paulo, Brasil",
  })

  const handleSave = async () => {
    setIsSaving(true)

    try {
      // Simulação de salvamento
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Atualizar o estado global
      actions.login({
        ...snap.auth.user!,
        name: profileData.name,
        email: profileData.email,
        avatar: profileData.avatar,
      })

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as alterações.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleUploadAvatar = () => {
    toast({
      title: "Upload de avatar",
      description: "Funcionalidade em desenvolvimento.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Meu Perfil</h2>
        <p className="text-muted-foreground">Gerencie suas informações pessoais e preferências.</p>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Informações Pessoais</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="preferences">Preferências</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Foto de Perfil</CardTitle>
              <CardDescription>Esta foto será exibida em seu perfil e em todo o sistema.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <div className="relative h-24 w-24 overflow-hidden rounded-full">
                {profileData.avatar ? (
                  <Image src={profileData.avatar || "/placeholder.svg"} alt="Avatar" fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <User className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={handleUploadAvatar}>
                  <Upload className="mr-2 h-4 w-4" />
                  Fazer Upload
                </Button>
                <Button variant="outline" onClick={() => setProfileData({ ...profileData, avatar: "" })}>
                  Remover Foto
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Atualize suas informações pessoais.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Cargo</Label>
                  <Input
                    id="position"
                    value={profileData.position}
                    onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Input
                    id="department"
                    value={profileData.department}
                    onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Localização</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
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

        <TabsContent value="security" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>Atualize sua senha para manter sua conta segura.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => {
                  toast({
                    title: "Senha alterada",
                    description: "Sua senha foi alterada com sucesso.",
                  })
                }}
              >
                Alterar Senha
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Autenticação de Dois Fatores</CardTitle>
              <CardDescription>Adicione uma camada extra de segurança à sua conta.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                A autenticação de dois fatores adiciona uma camada extra de segurança à sua conta, exigindo mais do que
                apenas uma senha para fazer login.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => {
                  toast({
                    title: "Funcionalidade em desenvolvimento",
                    description: "A autenticação de dois fatores será implementada em breve.",
                  })
                }}
              >
                Configurar 2FA
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências do Sistema</CardTitle>
              <CardDescription>Personalize sua experiência no sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                As preferências do sistema serão implementadas em breve. Você poderá personalizar o tema, idioma e
                outras configurações.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => {
                  toast({
                    title: "Funcionalidade em desenvolvimento",
                    description: "As preferências do sistema serão implementadas em breve.",
                  })
                }}
              >
                Configurar Preferências
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
