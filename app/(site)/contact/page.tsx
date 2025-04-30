"use client"

import type React from "react"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from "lucide-react"

export default function ContactPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
    newsletter: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, newsletter: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulação de envio
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Mensagem enviada com sucesso!",
      description: "Agradecemos seu contato. Responderemos em breve.",
    })

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "general",
      message: "",
      newsletter: false,
    })

    setIsSubmitting(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-16 text-white">
          <div className="container text-center">
            <h1 className="mb-4 text-4xl font-bold">Entre em Contato</h1>
            <p className="mx-auto max-w-2xl text-lg">
              Estamos aqui para ajudar! Envie-nos uma mensagem e nossa equipe responderá o mais breve possível.
            </p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="container py-16">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-2xl font-bold">Envie-nos uma mensagem</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Seu nome"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Assunto</Label>
                  <RadioGroup value={formData.subject} onValueChange={handleRadioChange} disabled={isSubmitting}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="general" id="general" />
                      <Label htmlFor="general" className="font-normal">
                        Informações Gerais
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="booking" id="booking" />
                      <Label htmlFor="booking" className="font-normal">
                        Reservas
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="support" id="support" />
                      <Label htmlFor="support" className="font-normal">
                        Suporte
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="partnership" id="partnership" />
                      <Label htmlFor="partnership" className="font-normal">
                        Parcerias
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Como podemos ajudar?"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsletter"
                    checked={formData.newsletter}
                    onCheckedChange={handleCheckboxChange}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="newsletter" className="text-sm font-normal">
                    Desejo receber ofertas e novidades por email
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            </div>

            <div>
              <h2 className="mb-6 text-2xl font-bold">Informações de Contato</h2>

              <div className="mb-8 space-y-4">
                <div className="flex items-start">
                  <MapPin className="mr-3 mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Endereço</h3>
                    <p className="text-muted-foreground">Av. Paulista, 1000, São Paulo - SP, Brasil</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="mr-3 mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Telefone</h3>
                    <p className="text-muted-foreground">+55 (11) 9999-9999</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="mr-3 mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-muted-foreground">contato@bluedestination.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="mr-3 mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Horário de Atendimento</h3>
                    <p className="text-muted-foreground">Segunda a Sexta: 9h às 18h</p>
                    <p className="text-muted-foreground">Sábado: 9h às 13h</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-medium">Mapa</h3>
                <div className="aspect-video w-full rounded-md bg-muted">
                  {/* Aqui seria inserido um mapa real */}
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    Mapa será exibido aqui
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-gray-50 py-16">
          <div className="container">
            <h2 className="mb-8 text-center text-2xl font-bold">Perguntas Frequentes</h2>

            <div className="mx-auto max-w-3xl space-y-4">
              {[
                {
                  question: "Como posso fazer uma reserva?",
                  answer:
                    "Você pode fazer uma reserva diretamente pelo nosso site, selecionando o pacote desejado e seguindo as instruções de pagamento. Também é possível entrar em contato por telefone ou email.",
                },
                {
                  question: "Qual é a política de cancelamento?",
                  answer:
                    "Nossa política de cancelamento varia de acordo com o pacote. Em geral, cancelamentos feitos com mais de 30 dias de antecedência recebem reembolso total. Consulte os termos específicos do seu pacote.",
                },
                {
                  question: "Vocês oferecem seguro viagem?",
                  answer:
                    "Sim, oferecemos diferentes opções de seguro viagem que podem ser adicionadas à sua reserva. Recomendamos fortemente a contratação para garantir sua tranquilidade durante a viagem.",
                },
                {
                  question: "Como funciona o pagamento parcelado?",
                  answer:
                    "Oferecemos parcelamento em até 12x no cartão de crédito, com juros de acordo com a operadora do cartão. Também aceitamos pagamento via PIX ou boleto bancário para pagamento à vista.",
                },
              ].map((faq, index) => (
                <div key={index} className="rounded-lg border bg-white p-4">
                  <h3 className="font-medium">{faq.question}</h3>
                  <p className="mt-2 text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
