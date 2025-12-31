"use client";

import Navbar from "@/src/components/ui/navbar/navbar";
import { API } from "@/src/Services/API";
import { useEstabelecimento } from "@/src/store/Estabelecimento";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function EstabelecimentoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { slug } = useParams<{ slug: string }>();

  const setEstabelecimento = useEstabelecimento(
    (state) => state.setEstabelecimento
  );

  const api = useMemo(() => new API(), []);

  useEffect(() => {
    if (!slug) return;

    api.setStablishment(slug).then((data) => {
      setEstabelecimento(data);
    });
  }, [slug]);

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
