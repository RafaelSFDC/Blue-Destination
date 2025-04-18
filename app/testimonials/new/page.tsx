"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Star, Loader2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { getPackages } from "@/lib/actions"

export default function NewTestimonialPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [packages, setPackages] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    packageId: "",
    rating: 5,
    comment: "",
    travelDate: "",
    allowPublish: true,
  })

  // Carregar pacotes
  useState(() => {
    const fetchPackages = async () => {
      try {
        const allPackages = await getPackages()
        setPackages(allPackages)
      } catch (error) {
        console.error("Erro ao buscar pacotes:", error)
      }
    }

    fetchPackages()
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRatingChange = (value: string) => {
    setFormData((prev) => ({ ...prev, rating: Number.parseInt(value) }))
  }

  const handlePackageChange = (value: string) => {
    setFormData((prev) => ({ ...prev, packageId: value }))
  }

  const handleAllowPublishChange = (value: string) => {
    setFormData((prev) => ({ ...prev, allowPublish: value === "yes" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.packageId || !formData.comment) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulação de envio
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Avaliação enviada com sucesso!",
      description: "Agradecemos por compartilhar sua experiência conosco.",
    })

    router.push("/testimonials")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="container flex-1 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/testimonials">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Voltar</span>
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Deixe sua Avaliação</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 rounded-lg border p-6">
              <h2 className="text-xl font-medium">Informações Pessoais</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo *</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-6">
              <h2 className="text-xl font-medium">Detalhes da Viagem</h2>

              <div className="space-y-2">
                <Label htmlFor="package">Pacote que você adquiriu *</Label>
                <Select value={formData.packageId} onValueChange={handlePackageChange} required>
                  <SelectTrigger id="package">
                    <SelectValue placeholder="Selecione um pacote" />
                  </SelectTrigger>
                  <SelectContent>
                    {packages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="travelDate">Data da viagem</Label>
                <Input
                  id="travelDate"
                  name="travelDate"
                  type="date"
                  value={formData.travelDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-6">
              <h2 className="text-xl font-medium">Sua Avaliação</h2>

              <div className="space-y-2">
                <Label>Como você avalia sua experiência? *</Label>
                <div className="flex items-center gap-2">
                  <RadioGroup value={formData.rating.toString()} onValueChange={handleRatingChange} className="flex">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value} className="flex flex-col items-center gap-1">
                        <RadioGroupItem value={value.toString()} id={`rating-${value}`} className="peer sr-only" />
                        <Label
                          htmlFor={`rating-${value}`}
                          className="flex h-12 w-12 cursor-pointer flex-col items-center justify-center rounded-full border peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              value <= formData.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                            }`}
                          />
                          <span className="sr-only">{value} estrelas</span>
                        </Label>
                        <span className="text-xs">{value}</span>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Conte-nos sobre sua experiência *</Label>
                <Textarea
                  id="comment"
                  name="comment"
                  rows={5}
                  placeholder="O que você achou do pacote, destino, atendimento, etc."
                  value={formData.comment}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Podemos publicar sua avaliação em nosso site?</Label>
                <RadioGroup value={formData.allowPublish ? "yes" : "no"} onValueChange={handleAllowPublishChange}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="allow-yes" />
                    <Label htmlFor="allow-yes">Sim, podem publicar minha avaliação</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="allow-no" />
                    <Label htmlFor="allow-no">Não, prefiro manter anônimo</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Avaliação"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
