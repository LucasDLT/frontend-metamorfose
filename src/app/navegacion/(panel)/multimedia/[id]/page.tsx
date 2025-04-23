import { EditImage } from "@/components/EditImage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editar Imagen",
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <EditImage id={resolvedParams.id} />;
}
