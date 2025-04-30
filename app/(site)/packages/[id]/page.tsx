import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PackageDetails } from "./package-details";
import { getPackageById } from "@/actions/packages";

export default async function PackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const item = await params;
  const packageData = await getPackageById(item.id);

  if (!packageData) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col pb-12">
      <main className="flex-1">
        <Suspense
          fallback={<div className="container py-12">Carregando...</div>}
        >
          <PackageDetails packageItem={packageData} />
        </Suspense>
      </main>
    </div>
  );
}
