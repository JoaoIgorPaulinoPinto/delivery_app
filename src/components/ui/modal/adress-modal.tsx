"use client";

import { X } from "lucide-react";
import { useState } from "react";
import styles from "./adress-modal.module.css";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: AddressData) => void;
  initialAddress?: AddressData; // <- endereço já salvo para edição
}

export interface AddressData {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  complement?: string;
}

export default function AddressModal({
  isOpen,
  onClose,
  onSave,
  initialAddress,
}: AddressModalProps) {
  const [street, setStreet] = useState(initialAddress?.street || "");
  const [number, setNumber] = useState(initialAddress?.number || "");
  const [neighborhood, setNeighborhood] = useState(
    initialAddress?.neighborhood || ""
  );
  const [city, setCity] = useState(initialAddress?.city || "");
  const [complement, setComplement] = useState(
    initialAddress?.complement || ""
  );

  if (!isOpen) return null;

  const handleSave = () => {
    if (!street || !number || !neighborhood || !city) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    onSave({
      street,
      number,
      neighborhood,
      city,
      complement,
    });
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

        <div className={styles.title}>Editar Endereço</div>

        <div className={styles.modalInputGroup}>
          <label>Rua *</label>
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Ex: Rua João Martins"
          />
        </div>

        <div className={styles.modalInputGroup}>
          <label>Número *</label>
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Ex: 120"
          />
        </div>

        <div className={styles.modalInputGroup}>
          <label>Bairro *</label>
          <input
            type="text"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            placeholder="Ex: Centro"
          />
        </div>

        <div className={styles.modalInputGroup}>
          <label>Cidade *</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ex: Belo Horizonte"
          />
        </div>

        <div className={styles.modalInputGroup}>
          <label>Complemento (opcional)</label>
          <input
            type="text"
            value={complement}
            onChange={(e) => setComplement(e.target.value)}
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
