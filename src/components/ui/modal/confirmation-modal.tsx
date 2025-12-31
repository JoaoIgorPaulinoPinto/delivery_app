"use client";
import { EnderecoPedido } from "@/src/models/models";
import { useUsuario } from "@/src/store/Usuario";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PatternFormat } from "react-number-format";

import styles from "./confirmation-modal.module.css";

interface ConfirmationModalProps {
  endereco?: EnderecoPedido | null;
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
  const { usuario, setUsuario } = useUsuario();

  const [userName, setUserName] = useState(usuario.nome || "");
  const [userPhone, setUserPhone] = useState(usuario.telefone || "");
  const [obs, setObs] = useState("");

  /* =================== PREFILL DO USUÁRIO =================== */
  const initializedRef = useRef(false);

  useEffect(() => {
    if (isOpen && !initializedRef.current) {
      initializedRef.current = true;
    }

    if (!isOpen) {
      initializedRef.current = false;
    }
  }, [isOpen, usuario]);

  if (!isOpen) return null;

  const handleConfirmOrder = () => {
    if (!userName || !userPhone) {
      alert("Preencha seu nome e telefone!");
      return;
    }

    // 💾 Salva os dados do usuário no store (persistente)
    setUsuario({
      nome: userName,
      telefone: userPhone,
    });

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

        {endereco && (
          <div className={styles.addressBox}>
            <div className={styles.addressTitle}>Endereço de Entrega</div>
            <div className={styles.addressText}>
              {`${endereco.rua}, ${endereco.numero} - ${endereco.cidade}/${endereco.uf}`}
            </div>
          </div>
        )}

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
          <PatternFormat
            format="(##) #####-####"
            mask="_"
            value={userPhone}
            onValueChange={(values) => {
              setUserPhone(values.value); // só números
            }}
          />
        </div>

        <div className={styles.modalInputGroup}>
          <label>Observação</label>
          <input
            type="text"
            value={obs}
            onChange={(e) => setObs(e.target.value)}
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
