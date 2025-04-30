import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PackageDetails } from "./package-details";
import { getPackageById } from "@/actions/packages";

export default async function PackagePage({
  params,
}: {
  params: { id: string };
}) {
  const packageData = await getPackageById(params.id);

  if (!packageData) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col pb-12">
      <SiteHeader />
      <main className="flex-1">
        <Suspense
          fallback={<div className="container py-12">Carregando...</div>}
        >
          <PackageDetails packageItem={packageData} />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
