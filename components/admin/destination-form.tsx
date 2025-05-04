"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useTags } from "@/querys/useTags";
import { destinationFormSchema, DestinationFormValues } from "@/lib/schemas/destination-form";

interface DestinationFormProps {
  initialData?: Partial<DestinationFormValues>;
  onSubmit: (data: DestinationFormValues) => Promise<void>;
  isLoading?: boolean;
  isEditing?: boolean;
}

export function DestinationForm({
  initialData,
  onSubmit,
  isLoading = false,
  isEditing = false,
}: DestinationFormProps) {
  const router = useRouter();
  const { data: tags = [], isLoading: isLoadingTags } = useTags();
  const [gallery, setGallery] = useState<string[]>(initialData?.gallery || []);

  // Definir valores padrão para o formulário
  const defaultValues: Partial<DestinationFormValues> = {
    name: "",
    location: "",
    description: "",
    imageUrl: "",
    price: 0,
    rating: 0,
    reviewCount: 0,
    featured: false,
    popular: false,
    region: "",
    tags: [],
    gallery: [],
    coordinates: {
      latitude: 0,
      longitude: 0,
    },
    ...initialData,
  };

  const form = useForm<DestinationFormValues>({
    resolver: zodResolver(destinationFormSchema),
    defaultValues,
  });

  // Adicionar campo para galeria
  const addGalleryField = () => {
    setGallery([...gallery, ""]);
  };

  // Remover campo da galeria
  const removeGalleryField = (index: number) => {
    const updatedGallery = [...gallery];
    updatedGallery.splice(index, 1);
    setGallery(updatedGallery);
    
    // Atualizar o valor no formulário
    const currentGallery = form.getValues("gallery") || [];
    currentGallery.splice(index, 1);
    form.setValue("gallery", currentGallery);
  };

  // Atualizar campo da galeria
  const updateGalleryField = (index: number, value: string) => {
    const updatedGallery = [...gallery];
    updatedGallery[index] = value;
    setGallery(updatedGallery);
    
    // Atualizar o valor no formulário
    const currentGallery = form.getValues("gallery") || [];
    currentGallery[index] = value;
    form.setValue("gallery", currentGallery);
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (data: DestinationFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Erro ao salvar destino", {
        description: "Ocorreu um erro ao salvar o destino. Tente novamente.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/admin/destinations">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Voltar</span>
              </Link>
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">
              {isEditing ? "Editar Destino" : "Novo Destino"}
            </h2>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Destino"
            )}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Detalhes principais do destino
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Destino</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Praias de Maldivas" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localização</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Maldivas, Ásia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Região</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Ásia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o destino..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Preço e Avaliações */}
          <Card>
            <CardHeader>
              <CardTitle>Preço e Avaliações</CardTitle>
              <CardDescription>
                Defina o preço base e avaliações do destino
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço Base (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Preço base para visitar este destino
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avaliação</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          placeholder="0.0"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Avaliação de 0 a 5 estrelas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reviewCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Avaliações</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Imagens */}
          <Card>
            <CardHeader>
              <CardTitle>Imagens</CardTitle>
              <CardDescription>
                Adicione imagens para o destino
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagem Principal (URL)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://exemplo.com/imagem.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      URL da imagem principal do destino
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Galeria de Imagens</FormLabel>
                <FormDescription>
                  Adicione URLs para imagens adicionais do destino
                </FormDescription>

                {gallery.map((url, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="https://exemplo.com/imagem.jpg"
                      value={url}
                      onChange={(e) => updateGalleryField(index, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeGalleryField(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addGalleryField}
                  className="mt-2"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Imagem
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Configurações e Categorização */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações e Categorização</CardTitle>
              <CardDescription>
                Defina tags e configurações adicionais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          const currentValues = field.value || [];
                          if (!currentValues.includes(value)) {
                            field.onChange([...currentValues, value]);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione tags" />
                        </SelectTrigger>
                        <SelectContent>
                          {tags
                            .filter((tag) => tag.type === "destination")
                            .map((tag) => (
                              <SelectItem key={tag.$id} value={tag.$id}>
                                {tag.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {field.value?.map((tagId) => {
                        const tag = tags.find((t) => t.$id === tagId);
                        return (
                          <div
                            key={tagId}
                            className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs"
                          >
                            {tag?.name || tagId}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0"
                              onClick={() => {
                                field.onChange(
                                  field.value?.filter((id) => id !== tagId) || []
                                );
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Destaque</FormLabel>
                        <FormDescription>
                          Mostrar este destino na seção de destaques
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="popular"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Popular</FormLabel>
                        <FormDescription>
                          Marcar este destino como popular
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Coordenadas */}
          <Card>
            <CardHeader>
              <CardTitle>Coordenadas</CardTitle>
              <CardDescription>
                Defina as coordenadas geográficas do destino (opcional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="coordinates.latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.000001"
                          placeholder="0.000000"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coordinates.longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.000001"
                          placeholder="0.000000"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
}
