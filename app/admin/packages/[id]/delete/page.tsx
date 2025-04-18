"use client";

import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";

export default async function DeletePackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const packageId = await params;

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      // Simulação de exclusão
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Pacote excluído",
        description: "O pacote foi excluído com sucesso.",
      });

      router.push("/admin/packages");
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o pacote.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/admin/packages/${packageId.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Excluir Pacote</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Confirmação de Exclusão
          </CardTitle>
          <CardDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente o
            pacote e todas as informações associadas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Você está prestes a excluir o pacote com ID:{" "}
            <strong>{packageId.id}</strong>
          </p>
          <p className="mt-4 text-muted-foreground">
            Antes de excluir, verifique se não há reservas ativas para este
            pacote. A exclusão de um pacote com reservas ativas pode causar
            problemas no sistema.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`/admin/packages/${packageId.id}`}>Cancelar</Link>
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
