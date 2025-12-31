"use client";

import { useEstabelecimento } from "@/src/store/Estabelecimento";
import { ChevronDown, Clock, Hamburger, MapPin, Settings } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import styles from "./navbar.module.css";

export default function Navbar() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const [open, setOpen] = useState(false);

  const estabelecimento = useEstabelecimento((state) => state.estabelecimento);

  const nomeFantasia = estabelecimento?.nomeFantasia;
  const endereco = estabelecimento?.endereco;
  const horarioFuncionamento = estabelecimento?.horarioFuncionamento;
  const telefone = estabelecimento?.telefone;
  const whatsapp = estabelecimento?.whatsapp;
  const taxaEntrega = estabelecimento?.taxaEntrega;
  const pedidoMinimo = estabelecimento?.pedidoMinimo;
  const status = estabelecimento?.status; // string: "Aberto" | "Fechado"

  // horário de hoje (seguro)
  const horarioHoje = useMemo(() => {
    return horarioFuncionamento?.[0];
  }, [horarioFuncionamento]);

  const handleGoHome = () => {
    if (!slug) return;
    router.push(`/${slug}`);
  };

  const handleGoToOrders = () => {
    if (!slug) return;
    router.push(`/${slug}/pedidos`);
  };

  const handleGoToSettings = () => {
    if (!slug) return;
    router.push(`/${slug}/configuracoes`);
  };
  function maskWhatsApp(value: string) {
    const numbers = value.replace(/\D/g, "");

    if (numbers.length === 11) {
      // (11) 91234-5678
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }

    if (numbers.length === 10) {
      // (11) 1234-5678
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }

    return value;
  }
  return (
    <nav className={styles.navbar}>
      {/* BOTÃO SETA */}
      <button
        className={styles.chevronButton}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Mais informações"
      >
        <ChevronDown size={20} className={open ? styles.chevronOpen : ""} />
      </button>

      {/* LADO ESQUERDO */}
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

          {horarioHoje && (
            <div className={styles.infoItem}>
              <Clock size={14} />
              <span>
                {horarioHoje.abertura.slice(0, 5)} às{" "}
                {horarioHoje.fechamento.slice(0, 5)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* LADO DIREITO */}
      <div className={styles.right_side}>
        <button
          aria-label="Pedidos"
          onClick={handleGoToOrders}
          className={styles.iconButton}
        >
          <Hamburger size={20} />
        </button>

        <button
          aria-label="Configurações"
          onClick={handleGoToSettings}
          className={styles.iconButton}
        >
          <Settings size={20} />
        </button>
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className={styles.dropdown}>
          {/* STATUS */}
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

          {/* ENDEREÇO */}
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

          {/* HORÁRIO */}
          {horarioHoje && (
            <div className={styles.dropdownItem}>
              <Clock size={16} />
              <span>
                {horarioHoje.diaSemana}: {horarioHoje.abertura.slice(0, 5)} às
                {horarioHoje.fechamento.slice(0, 5)}
              </span>
            </div>
          )}

          {/* TELEFONE */}
          {telefone && (
            <div className={styles.dropdownItem}>
              📞 <span>Telefone: {maskWhatsApp(telefone)}</span>
            </div>
          )}

          {/* WHATSAPP */}
          {whatsapp && (
            <div className={styles.dropdownItem}>
              💬 <span>💬 WhatsApp: {maskWhatsApp(whatsapp)}</span>
            </div>
          )}

          {/* TAXA */}
          {taxaEntrega !== undefined && (
            <div className={styles.dropdownItem}>
              🚚
              <span>
                Taxa de entrega:
                {taxaEntrega === 0 ? "Grátis" : `R$ ${taxaEntrega.toFixed(2)}`}
              </span>
            </div>
          )}

          {/* PEDIDO MÍNIMO */}
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
