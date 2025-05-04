"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DestinationForm } from "@/components/admin/destination-form";
import { createDestination } from "@/actions/destinations";
import { DestinationFormValues } from "@/lib/schemas/destination-form";

export default function NewDestinationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: DestinationFormValues) => {
    try {
      setIsLoading(true);
      await createDestination(data);
      
      toast.success("Destino criado com sucesso", {
        description: "O destino foi adicionado ao sistema.",
      });
      
      router.push("/admin/destinations");
    } catch (error) {
      console.error("Error creating destination:", error);
      toast.error("Erro ao criar destino", {
        description: "Ocorreu um erro ao criar o destino. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DestinationForm 
      onSubmit={handleSubmit} 
      isLoading={isLoading} 
    />
  );
}
