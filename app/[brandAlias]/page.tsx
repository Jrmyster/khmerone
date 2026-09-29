import { notFound, permanentRedirect } from "next/navigation";
import { isKhmerOneAlias } from "@/lib/khmerUtils";

export default async function BrandAliasPage({ params }: { params: Promise<{ brandAlias: string }> }) {
  const { brandAlias } = await params;
  if (!isKhmerOneAlias(brandAlias)) notFound();
  permanentRedirect("/");
}
