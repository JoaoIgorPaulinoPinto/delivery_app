"use client";

import {
  API,
  EstabelecimentoResponse,
  HorarioFuncionamentoResponse,
} from "@/src/Services/API";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export function useNavbarLogic() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [open, setOpen] = useState(false);
  const [estabelecimento, setEstabelecimento] =
    useState<EstabelecimentoResponse | null>(null);

  useEffect(() => {
    if (!slug) return;
    const api = new API();
    api.getEstabelecimento(slug).then(setEstabelecimento);
  }, [slug]);

  const {
    nome,
    horarioFuncionamento,
    telefone,
    whatsapp,
    taxaEntrega,
    pedidoMinimo,
    endereco,
    status,
  } = estabelecimento || {};

  const diasSemana = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  const horarioHoje = useMemo(() => {
    if (!horarioFuncionamento) return null;
    const hoje = new Date().getDay();
    const diaAtual = diasSemana[hoje];
    return horarioFuncionamento.find(
      (h: HorarioFuncionamentoResponse) => h.dia === diaAtual,
    );
  }, [horarioFuncionamento]);

  const handleGoHome = () => {
    if (!slug) return;
    router.push(`/estabelecimento/${slug}`);
  };

  const handleGoToOrders = () => {
    if (!slug) return;
    router.push(`/estabelecimento/${slug}/pedidos`);
  };

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        open &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function maskWhatsApp(value: string) {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length === 11)
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    if (numbers.length === 10)
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    return value;
  }

  return {
    open,
    setOpen,
    buttonRef,
    dropdownRef,
    nome,
    endereco,
    horarioHoje,
    telefone,
    whatsapp,
    taxaEntrega,
    pedidoMinimo,
    status,
    handleGoHome,
    handleGoToOrders,
    maskWhatsApp,
  };
}
