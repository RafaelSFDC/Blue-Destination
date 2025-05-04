"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { DestinationForm } from "@/components/admin/destination-form";
import { getDestinationById, updateDestination } from "@/actions/destinations";
import { DestinationFormValues } from "@/lib/schemas/destination-form";

export default function EditDestinationPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [destination, setDestination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadDestination = async () => {
      try {
        setIsLoading(true);
        const destinationData = await getDestinationById(params.id);

        if (!destinationData) {
          toast.error("Destino não encontrado");
          router.push("/admin/destinations");
          return;
        }

        setDestination(destinationData);
      } catch (error) {
        console.error("Error loading destination:", error);
        toast.error("Erro ao carregar destino", {
          description: "Ocorreu um erro ao carregar os dados do destino.",
        });
        router.push("/admin/destinations");
      } finally {
        setIsLoading(false);
      }
    };

    loadDestination();
  }, [params.id, router]);

  const handleSubmit = async (data: DestinationFormValues) => {
    try {
      setIsSaving(true);
      await updateDestination(params.id, data);
      
      toast.success("Destino atualizado com sucesso", {
        description: "As alterações foram salvas.",
      });
      
      router.push("/admin/destinations");
    } catch (error) {
      console.error("Error updating destination:", error);
      toast.error("Erro ao atualizar destino", {
        description: "Ocorreu um erro ao atualizar o destino. Tente novamente.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando destino...</span>
      </div>
    );
  }

  return (
    <DestinationForm 
      initialData={destination} 
      onSubmit={handleSubmit} 
      isLoading={isSaving}
      isEditing
    />
  );
}
