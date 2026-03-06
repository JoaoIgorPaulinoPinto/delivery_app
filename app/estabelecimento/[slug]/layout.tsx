// app/estabelecimento/[slug]/layout.tsx
import Navbar from "@/src/components/ui/navbar/navbar";
import { API } from "@/src/Services/API";
import { notFound } from "next/navigation";

export default async function EstabelecimentoLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const api = new API();

  try {
    await api.getEstabelecimento(slug);
  } catch {
    notFound();
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
