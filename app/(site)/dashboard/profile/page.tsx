"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useUser } from "@/querys/useUser";
import {
  updateUserProfile,
  deleteUserAccount,
  logoutUser,
} from "@/actions/auth";

// Componentes
import { ProfileImageUpload } from "@/components/profile-image-upload";
import { PersonalInfoForm } from "@/components/personal-info-form";
import { AddressForm } from "@/components/address-form";
import { PreferencesForm } from "@/components/preferences-form";
import { SecurityForm } from "@/components/security-form";

// Tipos
import { Address } from "@/lib/types";

export default function ProfilePage() {
  const router = useRouter();
  const { data: user, refetch } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  // Verificar se o usuário está carregando ou não existe
  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>

        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  // Função para atualizar informações pessoais
  const handleUpdatePersonalInfo = async (data: {
    name: string;
    email: string;
    phone?: string;
  }) => {
    try {
      setIsLoading(true);

      await updateUserProfile(user.$id, {
        name: data.name,
        email: data.email,
        phone: data.phone || "",
      });

      await refetch();

      toast.success("Informações atualizadas", {
        description: "Suas informações pessoais foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar informações:", error);
      toast.error("Erro ao atualizar informações", {
        description: "Ocorreu um erro ao atualizar suas informações pessoais.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para atualizar endereço
  const handleUpdateAddress = async (addressData: any) => {
    try {
      setIsLoading(true);

      // Criar um array de endereços
      const addresses =
        user.addresses && user.addresses.length > 0
          ? [{ ...user.addresses[0], ...addressData }] // Atualizar o primeiro endereço
          : [addressData]; // Criar um novo endereço

      await updateUserProfile(user.$id, {
        addresses: addresses as Address[],
      });

      await refetch();

      toast.success("Endereço atualizado", {
        description: "Seu endereço foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar endereço:", error);
      toast.error("Erro ao atualizar endereço", {
        description: "Ocorreu um erro ao atualizar seu endereço.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para atualizar preferências
  const handleUpdatePreferences = async (preferencesData: any) => {
    try {
      setIsLoading(true);

      await updateUserProfile(user.$id, {
        preferences: preferencesData,
      });

      await refetch();

      toast.success("Preferências atualizadas", {
        description: "Suas preferências foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar preferências:", error);
      toast.error("Erro ao atualizar preferências", {
        description: "Ocorreu um erro ao atualizar suas preferências.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para excluir conta
  const handleDeleteAccount = async () => {
    // Confirmar exclusão
    if (
      !confirm(
        "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);

      // Excluir a conta do usuário
      await deleteUserAccount(user.$id);

      toast.success("Conta excluída", {
        description: "Sua conta foi excluída permanentemente.",
      });

      // Fazer logout e redirecionar para a página inicial
      await logoutUser();
      router.push("/");
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      toast.error("Erro ao excluir conta", {
        description: "Ocorreu um erro ao excluir sua conta.",
      });
    } finally {
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
              <ProfileImageUpload user={user} onSuccess={refetch} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PersonalInfoForm
                initialData={{
                  name: user.name,
                  email: user.email,
                  phone: user.phone || "",
                }}
                onSave={handleUpdatePersonalInfo}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
              <CardDescription>
                Atualize seu endereço de correspondência
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddressForm
                address={
                  user.addresses && user.addresses.length > 0
                    ? user.addresses[0]
                    : {}
                }
                onSave={handleUpdateAddress}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências</CardTitle>
              <CardDescription>
                Personalize sua experiência no site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PreferencesForm
                preferences={
                  user.preferences || {
                    newsletter: false,
                    notifications: {
                      email: true,
                      push: true,
                      sms: false,
                    },
                    currency: "BRL",
                    language: "pt-BR",
                  }
                }
                onSave={handleUpdatePreferences}
                isLoading={isLoading}
              />
            </CardContent>
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
            <CardContent>
              <SecurityForm userId={user.$id} />
            </CardContent>
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
                      Navegador • {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Sessão Atual
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
              <CardDescription>
                Ações irreversíveis para sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <p className="font-medium text-destructive">Atenção</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  A exclusão da sua conta é permanente e irá remover todos os
                  seus dados, incluindo reservas, favoritos e preferências. Esta
                  ação não pode ser desfeita.
                </p>
              </div>

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
                  {isLoading ? "Excluindo..." : "Excluir Conta"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
