"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { toggleFavorite, isFavorite } from "@/actions/favorites";
import { useUser } from "@/querys/useUser";

interface FavoriteButtonProps {
  id: string;
  type: "destination" | "package";
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function FavoriteButton({
  id,
  type,
  variant = "ghost",
  size = "icon",
}: FavoriteButtonProps) {
  const { data: user } = useUser();
  const [loading, setLoading] = useState(false);
  const [isFav, setIsFav] = useState(false);

  // Verificar se o item está nos favoritos quando o componente é montado
  useEffect(() => {
    const checkFavorite = async () => {
      if (!user) return;

      try {
        const result = await isFavorite(id, type);
        setIsFav(result);
      } catch (error) {
        console.error("Erro ao verificar favorito:", error);
      }
    };

    checkFavorite();
  }, [id, type, user]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Você precisa estar logado para adicionar favoritos");
      return;
    }

    try {
      setLoading(true);

      // Otimistic UI update
      setIsFav(!isFav);

      // Chamar a API para atualizar o favorito
      await toggleFavorite(id, type);

      toast.success(
        isFav ? "Removido dos favoritos" : "Adicionado aos favoritos",
        {
          description: isFav
            ? "O item foi removido da sua lista de favoritos."
            : "O item foi adicionado à sua lista de favoritos.",
        }
      );
    } catch (error) {
      // Reverter a UI em caso de erro
      setIsFav(isFav);
      toast.error("Erro ao atualizar favoritos", {
        description: "Não foi possível atualizar sua lista de favoritos.",
      });
      console.error("Erro ao atualizar favorito:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`rounded-full ${
        isFav ? "text-red-500 hover:text-red-600" : "text-muted-foreground"
      }`}
      onClick={handleToggleFavorite}
      disabled={loading}
      aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart className={isFav ? "fill-current" : ""} />
    </Button>
  );
}
