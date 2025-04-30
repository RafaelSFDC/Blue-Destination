"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Camera, Loader2, Save, Lock, Bell, Globe, Trash2 } from "lucide-react";
import { useUser } from "@/querys/useUser";
import {
  updateUserProfile,
  deleteUserAccount,
  logoutUser,
} from "@/actions/auth";
import { uploadImage, updateProfileImage } from "@/actions/storage";

// Definindo a interface para o estado do formulário
interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  // Campos de endereço (relacionados a user.addresses[0])
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  // Preferências do usuário
  preferences: {
    newsletter: boolean;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    currency: string;
    language: string;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: user, refetch } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  // Referência para o input de arquivo
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Estado para armazenar os dados do formulário
  const [profileData, setProfileData] = useState<ProfileFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Brasil",
    preferences: {
      newsletter: false,
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      currency: "BRL",
      language: "pt-BR",
    },
  });

  // Atualizar o estado quando os dados do usuário estiverem disponíveis
  useEffect(() => {
    if (user) {
      // Obter o primeiro endereço do usuário, se existir
      const primaryAddress =
        user.addresses && user.addresses.length > 0 ? user.addresses[0] : null;

      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        // Usar os dados do endereço principal, se disponível
        address: primaryAddress?.street || "",
        city: primaryAddress?.city || "",
        state: primaryAddress?.state || "",
        zipCode: primaryAddress?.zipCode || "",
        country: primaryAddress?.country || "Brasil",
        preferences: {
          newsletter: user.preferences?.newsletter || false,
          notifications: {
            email: user.preferences?.notifications?.email || true,
            push: user.preferences?.notifications?.push || true,
            sms: user.preferences?.notifications?.sms || false,
          },
          currency: user.preferences?.currency || "BRL",
          language: user.preferences?.language || "pt-BR",
        },
      });
    }
  }, [user]);

  // Função para lidar com o upload de imagem
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setUploadingImage(true);

      // Fazer upload da imagem
      const imageUrl = await uploadImage(file);

      // Atualizar a imagem de perfil do usuário
      await updateProfileImage(user.$id, imageUrl);

      // Atualizar os dados do usuário
      await refetch();

      toast.success("Imagem atualizada", {
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
    } catch (error) {
      toast.error("Erro ao atualizar imagem", {
        description: "Ocorreu um erro ao atualizar sua foto de perfil.",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  // Função para atualizar os dados do formulário
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Atualizar o estado com base no nome do campo
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Função para atualizar as preferências de notificação
  const handleNotificationChange = (key: string, checked: boolean) => {
    setProfileData((prev) => {
      if (key === "newsletter") {
        return {
          ...prev,
          preferences: {
            ...prev.preferences,
            newsletter: checked,
          },
        };
      } else if (key === "email" || key === "push" || key === "sms") {
        return {
          ...prev,
          preferences: {
            ...prev.preferences,
            notifications: {
              ...prev.preferences.notifications,
              [key]: checked,
            },
          },
        };
      }
      return prev;
    });
  };

  // Função para salvar o perfil
  const handleSaveProfile = async () => {
    setIsLoading(true);

    try {
      if (!user) return;

      // Preparar o objeto de endereço
      const addressData = {
        street: profileData.address,
        city: profileData.city,
        state: profileData.state,
        zipCode: profileData.zipCode,
        country: profileData.country,
      };

      // Criar um array de endereços
      const addresses =
        user.addresses && user.addresses.length > 0
          ? [
              // Atualizar o primeiro endereço
              { ...user.addresses[0], ...addressData },
            ]
          : [addressData]; // Criar um novo endereço se não existir

      // Atualizar o perfil do usuário
      await updateUserProfile(user.$id, {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        // Converter para any para evitar problemas de tipo
        addresses: addresses as any,
        preferences: {
          newsletter: profileData.preferences.newsletter,
          notifications: {
            email: profileData.preferences.notifications.email,
            push: profileData.preferences.notifications.push,
            sms: profileData.preferences.notifications.sms,
          },
          currency: profileData.preferences.currency,
          language: profileData.preferences.language,
        } as any,
      });

      // Atualizar os dados do usuário
      await refetch();

      toast.success("Perfil atualizado", {
        description: "Suas informações foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast.error("Erro ao atualizar perfil", {
        description: "Ocorreu um erro ao atualizar suas informações.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setIsLoading(true);

    try {
      // Simulação de alteração de senha
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Senha alterada", {
        description: "Sua senha foi alterada com sucesso.",
      });
    } catch (error) {
      toast.error("Erro ao alterar senha", {
        description: "Ocorreu um erro ao alterar sua senha.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);

    try {
      // Excluir a conta do usuário
      await deleteUserAccount(user?.$id || "");

      toast.success("Conta excluída", {
        description: "Sua conta foi excluída permanentemente.",
      });

      // Fazer logout e redirecionar para a página inicial
      await logoutUser();
      router.push("/");
    } catch (error) {
      toast.error("Erro ao excluir conta", {
        description: "Ocorreu um erro ao excluir sua conta.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e preferências
        </p>
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
              <CardDescription>
                Esta foto será exibida em seu perfil e em suas avaliações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative h-24 w-24">
                  <Image
                    src={
                      user?.avatar || "/placeholder.svg?height=100&width=100"
                    }
                    alt="Foto de perfil"
                    fill
                    className="rounded-full object-cover"
                  />
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-4 w-4" />
                        Alterar Foto
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={async () => {
                      if (!user || !user.avatar) return;

                      try {
                        setUploadingImage(true);
                        // Atualizar a imagem de perfil do usuário para null
                        await updateProfileImage(user.$id, "");
                        // Atualizar os dados do usuário
                        await refetch();

                        toast.success("Foto removida", {
                          description:
                            "Sua foto de perfil foi removida com sucesso.",
                        });
                      } catch (error) {
                        toast.error("Erro ao remover foto", {
                          description:
                            "Ocorreu um erro ao remover sua foto de perfil.",
                        });
                      } finally {
                        setUploadingImage(false);
                      }
                    }}
                    disabled={uploadingImage || !user?.avatar}
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
              <CardDescription>
                Atualize suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Campo de biografia removido */}
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
              <CardDescription>
                Atualize seu endereço de correspondência
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  name="address"
                  value={profileData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    name="city"
                    value={profileData.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    name="state"
                    value={profileData.state}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={profileData.zipCode}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Input
                    id="country"
                    name="country"
                    value={profileData.country}
                    onChange={handleChange}
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
              <CardDescription>
                Defina suas preferências de idioma e moeda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <select
                    id="language"
                    name="language"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={profileData.preferences.language}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          language: e.target.value,
                        },
                      }))
                    }
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
                    value={profileData.preferences.currency}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          currency: e.target.value,
                        },
                      }))
                    }
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
              <CardDescription>
                Escolha como e quando deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">
                      Notificações por Email
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receba atualizações importantes por email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={profileData.preferences.notifications.email}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("email", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">
                      Notificações Push
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações em tempo real no seu dispositivo
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={profileData.preferences.notifications.push}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("push", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">
                      Notificações por SMS
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receba alertas importantes por SMS
                    </p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={profileData.preferences.notifications.sms}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("sms", checked)
                    }
                  />
                </div>

                <Separator />

                {/* Campo de promoções removido pois não existe no tipo User */}

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="newsletter">Newsletter</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba nossa newsletter com dicas de viagem e novidades
                    </p>
                  </div>
                  <Switch
                    id="newsletter"
                    checked={profileData.preferences.newsletter}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("newsletter", checked)
                    }
                  />
                </div>

                <Separator />

                {/* Campo de lembretes de viagem removido pois não existe no tipo User */}
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
              <CardDescription>
                Atualize sua senha para manter sua conta segura
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                />
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
              <CardDescription>
                Gerencie os dispositivos onde sua conta está conectada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Este dispositivo</p>
                    <p className="text-sm text-muted-foreground">
                      Windows • Chrome • São Paulo, Brasil
                    </p>
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
                      iOS • Safari • São Paulo, Brasil • Última atividade: 2
                      dias atrás
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast.success("Sessão encerrada", {
                        description:
                          "A sessão no iPhone 13 foi encerrada com sucesso.",
                      });
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
                      macOS • Firefox • Rio de Janeiro, Brasil • Última
                      atividade: 1 semana atrás
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast.success("Sessão encerrada", {
                        description:
                          "A sessão no MacBook Pro foi encerrada com sucesso.",
                      });
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
                  toast.success("Sessões encerradas", {
                    description:
                      "Todas as outras sessões foram encerradas com sucesso.",
                  });
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
              <CardDescription>
                Gerencie suas informações de conta e preferências
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Exportar Dados</p>
                  <p className="text-sm text-muted-foreground">
                    Baixe uma cópia de todos os seus dados
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    toast.info("Exportação iniciada", {
                      description:
                        "Seus dados estão sendo preparados para download.",
                    });
                  }}
                >
                  Exportar
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Histórico de Atividades</p>
                  <p className="text-sm text-muted-foreground">
                    Visualize o histórico de atividades da sua conta
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    toast.info("Funcionalidade em desenvolvimento", {
                      description:
                        "O histórico de atividades será implementado em breve.",
                    });
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
              <CardDescription>
                Ações irreversíveis para sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Excluir Conta</p>
                  <p className="text-sm text-muted-foreground">
                    Exclua permanentemente sua conta e todos os seus dados
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                >
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
  );
}
