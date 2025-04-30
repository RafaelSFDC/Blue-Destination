"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadImage, updateProfileImage } from "@/actions/storage";
import { User } from "@/lib/types";

interface ProfileImageUploadProps {
  user: User;
  onSuccess: () => void;
}

export function ProfileImageUpload({ user, onSuccess }: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Função para lidar com o upload de imagem
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsUploading(true);

      // Fazer upload da imagem
      const imageUrl = await uploadImage(file);

      // Atualizar a imagem de perfil do usuário
      await updateProfileImage(user.$id, imageUrl);

      // Notificar o componente pai
      onSuccess();

      toast.success("Imagem atualizada", {
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar imagem:", error);
      toast.error("Erro ao atualizar imagem", {
        description: "Ocorreu um erro ao atualizar sua foto de perfil.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Função para remover a imagem de perfil
  const handleRemoveImage = async () => {
    if (!user || !user.avatar) return;

    try {
      setIsUploading(true);
      
      // Atualizar a imagem de perfil do usuário para string vazia
      await updateProfileImage(user.$id, "");
      
      // Notificar o componente pai
      onSuccess();

      toast.success("Foto removida", {
        description: "Sua foto de perfil foi removida com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao remover foto:", error);
      toast.error("Erro ao remover foto", {
        description: "Ocorreu um erro ao remover sua foto de perfil.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-6">
      <div className="relative h-24 w-24">
        <Image
          src={user?.avatar || "/placeholder.svg?height=100&width=100"}
          alt="Foto de perfil"
          fill
          className="rounded-full object-cover"
        />
        <Button
          size="icon"
          className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="flex gap-2">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              Alterar Foto
            </>
          )}
        </Button>
        <Button
          variant="outline"
          className="text-destructive hover:text-destructive"
          onClick={handleRemoveImage}
          disabled={isUploading || !user?.avatar}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Remover
        </Button>
      </div>
    </div>
  );
}
