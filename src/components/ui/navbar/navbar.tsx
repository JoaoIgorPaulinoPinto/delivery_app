"use client";

import { useEnderecoNomes } from "@/src/hooks/useEnderecoNomes";
import { Clock, InfoIcon, MapPin, ShoppingBasket } from "lucide-react";
import styles from "./navbar.module.css";
import { useNavbarLogic } from "./useNavbarLogic";

export default function Navbar() {
  const {
    open,
    setOpen,
    buttonRef,
    dropdownRef,
    nomeFantasia,
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
  } = useNavbarLogic();
  const localizacao = useEnderecoNomes(endereco);

  return (
    <nav className={styles.navbar}>
      <button
        ref={buttonRef}
        className={styles.chevronButton}
        onClick={() => setOpen((p) => !p)}
      >
        <InfoIcon size={20} className={open ? styles.chevronOpen : ""} />
      </button>

      <div className={styles.left_side}>
        <div className={styles.brandButton} onClick={handleGoHome}>
          <span className={styles.brandName}>{nomeFantasia ?? "Inicio"}</span>
        </div>

        <div className={styles.infoContainer}>
          {endereco && (
            <div className={styles.infoItem}>
              <MapPin size={14} />
              <span>
                {endereco.bairro} -{" "}
                {localizacao.cidadeNome || endereco.cidadeId}/
                {localizacao.estadoNome || endereco.ufId}
              </span>
            </div>
          )}

          <div className={styles.infoItem}>
            <Clock size={14} />
            {horarioHoje ? (
              <span>
                {horarioHoje.abre?.substring(0, 5)} as{" "}
                {horarioHoje.fecha?.substring(0, 5)}
              </span>
            ) : (
              <span>{status ?? "Fechado"} hoje</span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.right_side}>
        <button onClick={handleGoToOrders} className={styles.iconButton}>
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
                {endereco.rua}, {endereco.numero} - {endereco.bairro}
                <br />
                {localizacao.cidadeNome || endereco.cidadeId}/
                {localizacao.estadoNome || endereco.ufId}
              </span>
            </div>
          )}

          <div className={styles.dropdownItem}>
            <Clock size={16} />
            {horarioHoje ? (
              <span>
                {horarioHoje.dia}: {horarioHoje.abre?.substring(0, 5)} as{" "}
                {horarioHoje.fecha?.substring(0, 5)}
              </span>
            ) : (
              <span>Fechado hoje</span>
            )}
          </div>

          {telefone && (
            <div className={styles.dropdownItem}>
              <span>Telefone: {maskWhatsApp(telefone)}</span>
            </div>
          )}

          {whatsapp && (
            <div className={styles.dropdownItem}>
              <span>WhatsApp: {maskWhatsApp(whatsapp)}</span>
            </div>
          )}

          {taxaEntrega !== undefined && (
            <div className={styles.dropdownItem}>
              <span>
                Taxa de entrega:{" "}
                {taxaEntrega === 0 ? "Gratis" : `R$ ${taxaEntrega.toFixed(2)}`}
              </span>
            </div>
          )}

          {pedidoMinimo !== undefined && (
            <div className={styles.dropdownItem}>
              <span>Pedido minimo: R$ {pedidoMinimo.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
