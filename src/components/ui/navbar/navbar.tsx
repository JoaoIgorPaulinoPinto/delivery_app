"use client";

import {
  API,
  EstabelecimentoResponse,
  HorarioFuncionamentoResponse,
} from "@/src/Services/API";
import { Clock, InfoIcon, MapPin, ShoppingBasket } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./navbar.module.css";

export default function Navbar() {
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

  const nomeFantasia = estabelecimento?.nome;
  const horariosFuncionamento = estabelecimento?.horarioFuncionamento;
  const telefone = estabelecimento?.telefone;
  const whatsapp = estabelecimento?.whatsapp;
  const taxaEntrega = estabelecimento?.taxaEntrega;
  const pedidoMinimo = estabelecimento?.pedidoMinimo;
  const endereco = estabelecimento?.endereco;
  const status = estabelecimento?.status;

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
    if (!horariosFuncionamento) return null;
    const hoje = new Date().getDay();
    const diaAtual = diasSemana[hoje];
    return horariosFuncionamento.find(
      (h: HorarioFuncionamentoResponse) => h.dia === diaAtual,
    );
  }, [horariosFuncionamento]);

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
    if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    if (numbers.length === 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return value;
  }

  return (
    <nav className={styles.navbar}>
      <button
        ref={buttonRef}
        className={styles.chevronButton}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Mais informações"
      >
        <InfoIcon size={20} className={open ? styles.chevronOpen : ""} />
      </button>

      <div className={styles.left_side}>
        <button
          className={styles.brandButton}
          onClick={handleGoHome}
          aria-label="Página inicial"
        >
          <span className={styles.brandName}>{nomeFantasia ?? "Início"}</span>
        </button>

        <div className={styles.infoContainer}>
          {endereco && (
            <div className={styles.infoItem}>
              <MapPin size={14} />
              <span>
                {endereco.bairro} • {endereco.cidade}/{endereco.uf}
              </span>
            </div>
          )}

          <div className={styles.infoItem}>
            <Clock size={14} />
            {horarioHoje ? (
              <span>
                {horarioHoje.abre?.substring(0, 5)} às{" "}
                {horarioHoje.fecha?.substring(0, 5)}
              </span>
            ) : (
              <span>{status ?? "Fechado"} hoje</span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.right_side}>
        <button
          aria-label="Pedidos"
          onClick={handleGoToOrders}
          className={styles.iconButton}
        >
          0<ShoppingBasket size={20} />
        </button>
      </div>

      {open && (
        <div ref={dropdownRef} className={styles.dropdown}>
          {status && (
            <div className={styles.statusRow}>
              <span
                className={
                  status === "Aberto" ? styles.statusOpen : styles.statusClosed
                }
              />
              <strong>{status}</strong>
            </div>
          )}

          {endereco && (
            <div className={styles.dropdownItem}>
              <MapPin size={16} />
              <span>
                {endereco.rua}, {endereco.numero} – {endereco.bairro}
                <br />
                {endereco.cidade}/{endereco.uf}
              </span>
            </div>
          )}

          <div className={styles.dropdownItem}>
            <Clock size={16} />
            {horarioHoje ? (
              <span>
                {horarioHoje.dia}: {horarioHoje.abre?.substring(0, 5)} às{" "}
                {horarioHoje.fecha?.substring(0, 5)}
              </span>
            ) : (
              <span>Fechado hoje</span>
            )}
          </div>

          {telefone && (
            <div className={styles.dropdownItem}>
              📞 <span>Telefone: {maskWhatsApp(telefone)}</span>
            </div>
          )}

          {whatsapp && (
            <div className={styles.dropdownItem}>
              💬 <span>WhatsApp: {maskWhatsApp(whatsapp)}</span>
            </div>
          )}

          {taxaEntrega !== undefined && (
            <div className={styles.dropdownItem}>
              🚚{" "}
              <span>
                Taxa de entrega:{" "}
                {taxaEntrega === 0 ? "Grátis" : `R$ ${taxaEntrega.toFixed(2)}`}
              </span>
            </div>
          )}

          {pedidoMinimo !== undefined && (
            <div className={styles.dropdownItem}>
              💰 <span>Pedido mínimo: R$ {pedidoMinimo.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
