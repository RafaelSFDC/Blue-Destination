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
import { deletePackage } from "@/actions/packages";
import { toast as sonnerToast } from "sonner";

export default function DeletePackagePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deletePackage(params.id);

      sonnerToast.success("Pacote excluído com sucesso");

      router.push("/admin/packages");
    } catch (error) {
      sonnerToast.error("Erro ao excluir pacote", {
        description: "Ocorreu um erro ao excluir o pacote. Tente novamente.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/admin/packages/${params.id}`}>
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
            <strong>{params.id}</strong>
          </p>
          <p className="mt-4 text-muted-foreground">
            Antes de excluir, verifique se não há reservas ativas para este
            pacote. A exclusão de um pacote com reservas ativas pode causar
            problemas no sistema.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`/admin/packages/${params.id}`}>Cancelar</Link>
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
