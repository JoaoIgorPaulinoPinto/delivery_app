"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { Endereco } from "./adress-modal";
import styles from "./confirmation-modal.module.css";

interface ConfirmationModalProps {
  endereco?: Endereco;
  total: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, phone: string, obs: string) => void;
}

export default function ConfirmationModal({
  endereco,
  total,
  isOpen,
  onClose,
  onConfirm,
}: ConfirmationModalProps) {
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [obs, setobs] = useState("");

  if (!isOpen) return null;

  const handleConfirmOrder = () => {
    if (!userName || !userPhone) {
      alert("Preencha seu nome e telefone!");
      return;
    }
    onConfirm(userName, userPhone, obs);
  };

  return (
    <div className={styles.confirmationOverlay} onClick={onClose}>
      <div
        className={styles.confirmationContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.modalCloseButton} onClick={onClose}>
          <X size={20} />
        </button>

        <div className={styles.title}>Confirmação do Pedido</div>

        <div className={styles.totalBox}>
          <span>Total:</span>
          <strong>{total}</strong>
        </div>

        <div className={styles.addressBox}>
          <div className={styles.addressTitle}>Endereço de Entrega</div>
          <div className={styles.addressText}>
            {endereco
              ? `${endereco.rua}, ${endereco.numero} - ${endereco.cidade}/${endereco.uf}`
              : "Nenhum endereço selecionado"}
          </div>
        </div>

        <div className={styles.modalInputGroup}>
          <label>Seu Nome</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Seu nome completo"
          />
        </div>

        <div className={styles.modalInputGroup}>
          <label>Telefone (WhatsApp)</label>
          <input
            type="tel"
            value={userPhone}
            onChange={(e) => setUserPhone(e.target.value)}
            placeholder="(99) 99999-9999"
          />
        </div>
        <div className={styles.modalInputGroup}>
          <label>Observação</label>
          <input
            type="text"
            value={obs}
            onChange={(e) => setobs(e.target.value)}
            placeholder="Sem cebola, por favor!"
          />
        </div>

        <div className={styles.warningText}>
          ⚠️ Confira seus dados antes de confirmar. Seu pedido será enviado após
          clicar em <b>Confirmar Pedido</b>.
        </div>
        <button
          className={styles.modalConfirmButton}
          onClick={handleConfirmOrder}
        >
          Confirmar Pedido
        </button>
      </div>
    </div>
  );
}
