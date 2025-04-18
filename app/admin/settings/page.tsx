"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, Bell, CreditCard } from "lucide-react"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Blue Destination",
    siteDescription: "Agência de viagens especializada em destinos paradisíacos",
    contactEmail: "contato@bluedestination.com",
    contactPhone: "+55 (11) 3456-7890",
    address: "Av. Paulista, 1000, São Paulo - SP",
  })

  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "smtp.example.com",
    smtpPort: "587",
    smtpUsername: "no-reply@bluedestination.com",
    smtpPassword: "••••••••••••",
    senderName: "Blue Destination",
    senderEmail: "no-reply@bluedestination.com",
  })

  const [paymentSettings, setPaymentSettings] = useState({
    currency: "BRL",
    taxRate: "5",
    paymentMethods: {
      creditCard: true,
      bankTransfer: true,
      paypal: false,
      pix: true,
    },
  })

  const [notificationSettings, setNotificationSettings] = useState({
    newBookingNotification: true,
    bookingStatusChangeNotification: true,
    paymentNotification: true,
    lowInventoryNotification: false,
    marketingNotification: true,
  })

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleEmailSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEmailSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setPaymentSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentMethodToggle = (method: string, checked: boolean) => {
    setPaymentSettings((prev) => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: checked,
      },
    }))
  }

  const handleNotificationToggle = (key: string, checked: boolean) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: checked,
    }))
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)

    // Simulação de salvamento
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Configurações salvas",
      description: "As configurações foram atualizadas com sucesso.",
    })

    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">Gerencie as configurações do sistema.</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="payment">Pagamento</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Site</CardTitle>
              <CardDescription>Configurações gerais do site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nome do Site</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={generalSettings.siteName}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email de Contato</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Descrição do Site</Label>
                <Textarea
                  id="siteDescription"
                  name="siteDescription"
                  rows={3}
                  value={generalSettings.siteDescription}
                  onChange={handleGeneralSettingsChange}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Telefone de Contato</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={generalSettings.contactPhone}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    name="address"
                    value={generalSettings.address}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
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

        <TabsContent value="email" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Email</CardTitle>
              <CardDescription>Configure o servidor de email para envio de notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpServer">Servidor SMTP</Label>
                  <Input
                    id="smtpServer"
                    name="smtpServer"
                    value={emailSettings.smtpServer}
                    onChange={handleEmailSettingsChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPort">Porta SMTP</Label>
                  <Input
                    id="smtpPort"
                    name="smtpPort"
                    value={emailSettings.smtpPort}
                    onChange={handleEmailSettingsChange}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">Usuário SMTP</Label>
                  <Input
                    id="smtpUsername"
                    name="smtpUsername"
                    value={emailSettings.smtpUsername}
                    onChange={handleEmailSettingsChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">Senha SMTP</Label>
                  <Input
                    id="smtpPassword"
                    name="smtpPassword"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={handleEmailSettingsChange}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="senderName">Nome do Remetente</Label>
                  <Input
                    id="senderName"
                    name="senderName"
                    value={emailSettings.senderName}
                    onChange={handleEmailSettingsChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senderEmail">Email do Remetente</Label>
                  <Input
                    id="senderEmail"
                    name="senderEmail"
                    type="email"
                    value={emailSettings.senderEmail}
                    onChange={handleEmailSettingsChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
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

        <TabsContent value="payment" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Pagamento</CardTitle>
              <CardDescription>Configure as opções de pagamento e moeda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Moeda</Label>
                  <select
                    id="currency"
                    name="currency"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={paymentSettings.currency}
                    onChange={handlePaymentSettingsChange}
                  >
                    <option value="BRL">Real Brasileiro (R$)</option>
                    <option value="USD">Dólar Americano ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">Libra Esterlina (£)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxRate">Taxa de Imposto (%)</Label>
                  <Input
                    id="taxRate"
                    name="taxRate"
                    type="number"
                    min="0"
                    max="100"
                    value={paymentSettings.taxRate}
                    onChange={handlePaymentSettingsChange}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Métodos de Pagamento</Label>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="creditCard">Cartão de Crédito</Label>
                      <p className="text-sm text-muted-foreground">Aceitar pagamentos com cartão de crédito</p>
                    </div>
                    <Switch
                      id="creditCard"
                      checked={paymentSettings.paymentMethods.creditCard}
                      onCheckedChange={(checked) => handlePaymentMethodToggle("creditCard", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="bankTransfer">Transferência Bancária</Label>
                      <p className="text-sm text-muted-foreground">Aceitar pagamentos via transferência bancária</p>
                    </div>
                    <Switch
                      id="bankTransfer"
                      checked={paymentSettings.paymentMethods.bankTransfer}
                      onCheckedChange={(checked) => handlePaymentMethodToggle("bankTransfer", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="paypal">PayPal</Label>
                      <p className="text-sm text-muted-foreground">Aceitar pagamentos via PayPal</p>
                    </div>
                    <Switch
                      id="paypal"
                      checked={paymentSettings.paymentMethods.paypal}
                      onCheckedChange={(checked) => handlePaymentMethodToggle("paypal", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="pix">PIX</Label>
                      <p className="text-sm text-muted-foreground">Aceitar pagamentos via PIX</p>
                    </div>
                    <Switch
                      id="pix"
                      checked={paymentSettings.paymentMethods.pix}
                      onCheckedChange={(checked) => handlePaymentMethodToggle("pix", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>Configure quais notificações serão enviadas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="newBookingNotification">Novas Reservas</Label>
                    <p className="text-sm text-muted-foreground">Receber notificações de novas reservas</p>
                  </div>
                  <Switch
                    id="newBookingNotification"
                    checked={notificationSettings.newBookingNotification}
                    onCheckedChange={(checked) => handleNotificationToggle("newBookingNotification", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="bookingStatusChangeNotification">Alterações de Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações de alterações de status de reservas
                    </p>
                  </div>
                  <Switch
                    id="bookingStatusChangeNotification"
                    checked={notificationSettings.bookingStatusChangeNotification}
                    onCheckedChange={(checked) => handleNotificationToggle("bookingStatusChangeNotification", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="paymentNotification">Pagamentos</Label>
                    <p className="text-sm text-muted-foreground">Receber notificações de pagamentos</p>
                  </div>
                  <Switch
                    id="paymentNotification"
                    checked={notificationSettings.paymentNotification}
                    onCheckedChange={(checked) => handleNotificationToggle("paymentNotification", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="lowInventoryNotification">Baixo Estoque</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações quando pacotes estiverem com poucas vagas
                    </p>
                  </div>
                  <Switch
                    id="lowInventoryNotification"
                    checked={notificationSettings.lowInventoryNotification}
                    onCheckedChange={(checked) => handleNotificationToggle("lowInventoryNotification", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketingNotification">Marketing</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações sobre campanhas de marketing e promoções
                    </p>
                  </div>
                  <Switch
                    id="marketingNotification"
                    checked={notificationSettings.marketingNotification}
                    onCheckedChange={(checked) => handleNotificationToggle("marketingNotification", checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Bell className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
