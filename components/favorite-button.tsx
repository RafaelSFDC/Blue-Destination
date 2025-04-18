"use client"

import type React from "react"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSnapshot } from "valtio"
import { state, actions } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

interface FavoriteButtonProps {
  id: string
  type: "destination" | "package"
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export function FavoriteButton({ id, type, variant = "ghost", size = "icon" }: FavoriteButtonProps) {
  const snap = useSnapshot(state)
  const { toast } = useToast()

  const isFavorite = snap.favorites.some((f) => f.id === id && f.type === type)

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    actions.toggleFavorite(id, type)

    toast({
      title: isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: isFavorite
        ? "O item foi removido da sua lista de favoritos."
        : "O item foi adicionado à sua lista de favoritos.",
      duration: 3000,
    })
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={`rounded-full ${isFavorite ? "text-red-500 hover:text-red-600" : "text-muted-foreground"}`}
      onClick={handleToggleFavorite}
      aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart className={isFavorite ? "fill-current" : ""} />
    </Button>
  )
}
