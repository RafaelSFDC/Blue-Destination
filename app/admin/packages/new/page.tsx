"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import useDestinations from "@/querys/useDestinations";
import useTags from "@/querys/useTags";

// Definindo o schema de validação
const packageSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z
    .string()
    .min(10, "A descrição deve ter pelo menos 10 caracteres"),
  imageUrl: z.string().url("URL inválida").optional(),
  price: z.coerce.number().positive("O preço deve ser positivo"),
  duration: z.coerce
    .number()
    .int()
    .positive("A duração deve ser um número inteiro positivo"),
  destinations: z.array(z.string()).min(1, "Selecione pelo menos um destino"),
  tags: z.array(z.string()),
  featured: z.boolean().default(false),
  discount: z.coerce.number().min(0).max(100).optional(),
  inclusions: z.array(z.string()),
  itinerary: z.array(
    z.object({
      day: z.number(),
      title: z.string(),
      description: z.string(),
    })
  ),
});

type PackageFormValues = z.infer<typeof packageSchema>;

export default function NewPackagePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: destinations = [], isLoading: isLoadingDestinations } =
    useDestinations();
  const { data: tags = [], isLoading: isLoadingTags } = useTags();
  const [inclusions, setInclusions] = useState<string[]>([""]);
  const [itinerary, setItinerary] = useState([
    { day: 1, title: "", description: "" },
  ]);

  // Definir valores padrão para o formulário
  const defaultValues: Partial<PackageFormValues> = {
    name: "",
    description: "",
    imageUrl: "",
    price: 0,
    duration: 1,
    destinations: [],
    tags: [],
    featured: false,
    discount: 0,
    inclusions: [""],
    itinerary: [{ day: 1, title: "", description: "" }],
  };

  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues,
  });

  const onSubmit = async (data: PackageFormValues) => {
    try {
      // Simulando envio para API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Pacote criado",
        description: "O pacote foi criado com sucesso.",
      });

      router.push("/admin/packages");
    } catch (error) {
      toast({
        title: "Erro ao criar pacote",
        description: "Ocorreu um erro ao criar o pacote.",
        variant: "destructive",
      });
    }
  };

  // Funções para gerenciar inclusões
  const addInclusion = () => {
    setInclusions([...inclusions, ""]);
    form.setValue("inclusions", [...form.getValues("inclusions"), ""]);
  };

  const removeInclusion = (index: number) => {
    const newInclusions = [...inclusions];
    newInclusions.splice(index, 1);
    setInclusions(newInclusions);
    form.setValue("inclusions", newInclusions);
  };

  const updateInclusion = (index: number, value: string) => {
    const newInclusions = [...inclusions];
    newInclusions[index] = value;
    setInclusions(newInclusions);
    form.setValue("inclusions", newInclusions);
  };

  // Funções para gerenciar itinerário
  const addItineraryDay = () => {
    const newDay = itinerary.length + 1;
    const newItinerary = [
      ...itinerary,
      { day: newDay, title: "", description: "" },
    ];
    setItinerary(newItinerary);
    form.setValue("itinerary", newItinerary);
  };

  const removeItineraryDay = (index: number) => {
    if (itinerary.length <= 1) return;

    const newItinerary = [...itinerary];
    newItinerary.splice(index, 1);

    // Reordenar os dias
    newItinerary.forEach((item, idx) => {
      item.day = idx + 1;
    });

    setItinerary(newItinerary);
    form.setValue("itinerary", newItinerary);
  };

  const updateItineraryDay = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const newItinerary = [...itinerary];
    newItinerary[index][field] = value;
    setItinerary(newItinerary);
    form.setValue("itinerary", newItinerary);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/packages">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Novo Pacote</h2>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Detalhes principais do pacote de viagem
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Pacote</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Paris Romântica" {...field} />
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
                          placeholder="Descreva o pacote..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duração (dias)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input placeholder="https://..." {...field} />
                          <Button type="button" variant="outline" size="icon">
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        URL da imagem principal do pacote
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Configurações e Categorização */}
            <Card>
              <CardHeader>
                <CardTitle>Configurações e Categorização</CardTitle>
                <CardDescription>
                  Defina destinos, tags e configurações adicionais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="destinations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destinos</FormLabel>
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
                            <SelectValue placeholder="Selecione destinos" />
                          </SelectTrigger>
                          <SelectContent>
                            {destinations.map((destination) => (
                              <SelectItem
                                key={destination.$id}
                                value={destination.$id}
                                disabled={field.value?.includes(
                                  destination.$id
                                )}
                              >
                                {destination.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {field.value?.map((destinationId) => {
                          const destination = destinations.find(
                            (d) => d.$id === destinationId
                          );
                          return (
                            <div
                              key={destinationId}
                              className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
                            >
                              {destination?.name}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 rounded-full"
                                onClick={() => {
                                  field.onChange(
                                    field.value?.filter(
                                      (id) => id !== destinationId
                                    )
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
                            {tags.map((tag) => (
                              <SelectItem
                                key={tag.$id}
                                value={tag.$id}
                                disabled={field.value?.includes(tag.$id)}
                              >
                                {tag.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {field.value?.map((tagId) => {
                          const tag = tags.find((t) => t.$id === tagId);
                          return (
                            <div
                              key={tagId}
                              className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
                            >
                              {tag?.name}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 rounded-full"
                                onClick={() => {
                                  field.onChange(
                                    field.value?.filter((id) => id !== tagId)
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

                <div className="grid grid-cols-2 gap-4">
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
                            Exibir este pacote em destaque no site
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Desconto (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Percentual de desconto (0-100)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* O que está incluído */}
          <Card>
            <CardHeader>
              <CardTitle>O que está incluído</CardTitle>
              <CardDescription>
                Adicione os itens incluídos no pacote
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {inclusions.map((inclusion, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={inclusion}
                    onChange={(e) => updateInclusion(index, e.target.value)}
                    placeholder={`Item ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeInclusion(index)}
                    disabled={inclusions.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addInclusion}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Item
              </Button>
            </CardContent>
          </Card>

          {/* Itinerário */}
          <Card>
            <CardHeader>
              <CardTitle>Itinerário</CardTitle>
              <CardDescription>
                Defina o roteiro dia a dia do pacote
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {itinerary.map((day, index) => (
                <div key={index} className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Dia {day.day}</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeItineraryDay(index)}
                      disabled={itinerary.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <FormLabel htmlFor={`day-${index}-title`}>
                        Título
                      </FormLabel>
                      <Input
                        id={`day-${index}-title`}
                        value={day.title}
                        onChange={(e) =>
                          updateItineraryDay(index, "title", e.target.value)
                        }
                        placeholder="Ex: Chegada em Paris"
                      />
                    </div>
                    <div>
                      <FormLabel htmlFor={`day-${index}-description`}>
                        Descrição
                      </FormLabel>
                      <Textarea
                        id={`day-${index}-description`}
                        value={day.description}
                        onChange={(e) =>
                          updateItineraryDay(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Descreva as atividades do dia..."
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addItineraryDay}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Dia
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
