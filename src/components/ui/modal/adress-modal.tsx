"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./adress-modal.module.css";

/* =======================
   TYPES
======================= */
export interface Endereco {
  cep: number;
  uf: string;
  cidade: string;
  rua: string;
  numero: number;
  bairro: string;
  complemento?: string;
}

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (endereco: Endereco) => void;
  initialAddress?: Endereco;
}

/* =======================
   COMPONENT
======================= */
export default function AddressModal({
  isOpen,
  onClose,
  onSave,
  initialAddress,
}: AddressModalProps) {
  const [cep, setCep] = useState<number>(0);
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState<number>(0);
  const [bairro, setBairro] = useState("");
  const [complemento, setComplemento] = useState("");

  /* =======================
     LOAD INITIAL DATA
  ======================= */
  useEffect(() => {
    if (initialAddress) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCep(initialAddress.cep);
      setUf(initialAddress.uf);
      setCidade(initialAddress.cidade);
      setRua(initialAddress.rua);
      setNumero(initialAddress.numero);
      setBairro(initialAddress.bairro);
      setComplemento(initialAddress.complemento ?? "");
    }
  }, [initialAddress]);

  if (!isOpen) return null;

  /* =======================
     SAVE
  ======================= */
  const handleSave = () => {
    if (!rua || !numero || !bairro || !cidade || !uf || !cep) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    onSave({
      cep,
      uf,
      cidade,
      rua,
      numero,
      bairro,
      complemento,
    });
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <div className={styles.confirmationOverlay} onClick={onClose}>
      <div
        className={styles.confirmationContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.modalCloseButton} onClick={onClose}>
          <X size={20} />
        </button>

        <div className={styles.title}>Endereço de Entrega</div>

        <div className={styles.modalInputGroup}>
          <label>CEP *</label>
          <input
            type="number"
            value={cep || ""}
            onChange={(e) => setCep(Number(e.target.value))}
            placeholder="Ex: 18530000"
          />
        </div>

        <div className={styles.modalInputGroup}>
          <label>UF *</label>
          <input
            type="text"
            value={uf}
            maxLength={2}
            onChange={(e) => setUf(e.target.value.toUpperCase())}
            placeholder="Ex: SP"
          />
        </div>

        <div className={styles.modalInputGroup}>
          <label>Cidade *</label>
          <input
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Ex: Tietê"
          />
        </div>

        <div className={styles.modalInputGroup}>
          <label>Rua *</label>
          <input
            type="text"
            value={rua}
            onChange={(e) => setRua(e.target.value)}
            placeholder="Ex: Rua João Martins"
          />
        </div>

        <div className={styles.modalInputGroup}>
          <label>Número *</label>
          <input
            type="number"
            value={numero || ""}
            onChange={(e) => setNumero(Number(e.target.value))}
            placeholder="Ex: 120"
          />
        </div>

        <div className={styles.modalInputGroup}>
          <label>Bairro *</label>
          <input
            type="text"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            placeholder="Ex: Centro"
          />
        </div>

        <div className={styles.modalInputGroup}>
          <label>Complemento</label>
          <input
            type="text"
            value={complemento}
            onChange={(e) => setComplemento(e.target.value)}
            placeholder="Apto, Bloco, Casa..."
          />
        </div>

        <button className={styles.modalConfirmButton} onClick={handleSave}>
          Salvar Endereço
        </button>
      </div>
    </div>
  );
}
