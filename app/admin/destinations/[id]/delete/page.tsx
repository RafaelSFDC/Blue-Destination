"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { getDestinationById, deleteDestination } from "@/actions/destinations";

export default function DeleteDestinationPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [destination, setDestination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteDestination(params.id);

      toast.success("Destino excluído", {
        description: "O destino foi excluído com sucesso.",
      });

      router.push("/admin/destinations");
    } catch (error: any) {
      toast.error("Erro ao excluir", {
        description: error.message || "Ocorreu um erro ao excluir o destino.",
      });
    } finally {
      setIsDeleting(false);
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
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/destinations">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Excluir Destino</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Confirmação de Exclusão
          </CardTitle>
          <CardDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente o
            destino e todas as informações associadas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Você está prestes a excluir o destino:{" "}
            <strong>{destination.name}</strong>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            ID: {destination.$id}
          </p>
          <p className="mt-4 text-muted-foreground">
            Antes de excluir, verifique se não há pacotes associados a este
            destino. A exclusão de um destino com pacotes associados pode causar
            problemas no sistema.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/admin/destinations">Cancelar</Link>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              "Confirmar Exclusão"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
