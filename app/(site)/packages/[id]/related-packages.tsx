'use client'

import { useQuery } from "@tanstack/react-query";
import { PackageCard } from "@/components/package-card";
import { Package } from "@/lib/types";
import { usePackages } from "@/querys/usePackages";

export function RelatedPackages({ 
  packageId, 
  tagIds 
}: { 
  packageId: string, 
  tagIds: string[]
}) {
  const { data: allPackages = [], isLoading } = usePackages();

  // Filtrar pacotes que compartilham pelo menos uma tag com o pacote atual
  const relatedPackages = allPackages
    .filter(pkg => {
      // Não incluir o pacote atual
      if (pkg.$id === packageId) return false;
      
      // Verificar se há pelo menos uma tag em comum
      return Array.isArray(pkg.tags) && pkg.tags.some((tag: any) => {
        // Se tag for um objeto com propriedade $id
        if (typeof tag === 'object' && tag?.$id) {
          return tagIds.includes(tag.$id);
        }
        // Se tag for uma string (ID direto)
        if (typeof tag === 'string') {
          return tagIds.includes(tag);
        }
        return false;
      });
    })
    .slice(0, 3); // Limitar a 3 pacotes relacionados

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-lg bg-gray-200"></div>
        ))}
      </div>
    );
  }

  if (relatedPackages.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          Não há pacotes relacionados disponíveis no momento.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {relatedPackages.map((pkg: Package) => (
        <PackageCard key={pkg.$id || pkg.$id} package={pkg} />
      ))}
    </div>
  );
}


