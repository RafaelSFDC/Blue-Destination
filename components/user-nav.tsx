"use client";

import type React from "react";
import Link from "next/link";
import { useSnapshot } from "valtio";
import { state, actions } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Heart, BookMarked, Settings } from "lucide-react";

export function UserNav() {
  const snap = useSnapshot(state);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    actions.logout();
  };

  if (!snap.auth.user?.isLoggedIn) {
    return (
      <>
        <Button variant="ghost" asChild>
          <Link href="/login">Entrar</Link>
        </Button>
        <Button asChild>
          <Link href="/register">Cadastrar</Link>
        </Button>
      </>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={snap.auth.user?.avatar || "/placeholder.svg"}
                alt={snap.auth.user?.name || "User avatar"}
              />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {snap.auth.user?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {snap.auth.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard">Meu Painel</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/bookings">
              <BookMarked className="mr-2 h-4 w-4" />
              Minhas Reservas
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/favorites">
              <Heart className="mr-2 h-4 w-4" />
              Meus Favoritos
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile">
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Link>
          </DropdownMenuItem>
          {snap.auth.user?.role === "admin" && (
            <DropdownMenuItem asChild>
              <Link href="/admin">Administração</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
