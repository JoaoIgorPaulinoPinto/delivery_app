"use client";

import { EnderecoPedido } from "@/src/models/models";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PatternFormat } from "react-number-format";
import styles from "./adress-modal.module.css";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (endereco: EnderecoPedido) => void;
  initialAddress?: EnderecoPedido;
}

export default function AddressModal({
  isOpen,
  onClose,
  onSave,
  initialAddress,
}: AddressModalProps) {
  const [cep, setCep] = useState("");
  const [uf, setUf] = useState(""); // Armazena a UF (ex: "SP")
  const [cidade, setCidade] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [complemento, setComplemento] = useState("");
  const ESTADOS = [
    { id: 1, nome: "Acre", uf: "AC" },
    { id: 2, nome: "São Paulo", uf: "SP" },
    { id: 3, nome: "Rio de Janeiro", uf: "RJ" },
    // Adicione outros conforme necessário
  ];

  const CIDADES = [
    { id: 1, estadoId: 1, nome: "Rio Branco" },
    { id: 2, estadoId: 2, nome: "São Paulo" },
    { id: 3, estadoId: 2, nome: "Tietê" },
    { id: 4, estadoId: 2, nome: "Campinas" },
    { id: 5, estadoId: 3, nome: "Rio de Janeiro" },
    { id: 6, estadoId: 3, nome: "Niterói" },
  ];
  // Filtra as cidades baseadas no estado selecionado
  const cidadesFiltradas = useMemo(() => {
    const estadoSelecionado = ESTADOS.find((e) => e.uf === uf);
    if (!estadoSelecionado) return [];
    return CIDADES.filter((c) => c.estadoId === estadoSelecionado.id);
  }, [uf]);

  useEffect(() => {
    if (initialAddress) {
      setCep(initialAddress.cep);
      setUf(initialAddress.uf);
      setCidade(initialAddress.cidade);
      setRua(initialAddress.rua);
      setNumero(initialAddress.numero);
      setBairro(initialAddress.bairro);
      setComplemento(initialAddress.complemento ?? "");
    } else {
      setUf("SP"); // Valor padrão
    }
  }, [initialAddress, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!rua || !numero || !bairro || !cidade || !uf || !cep) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }
    onSave({ cep, uf, cidade, rua, numero, bairro, complemento });
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

        <div className={styles.title}>Endereço de Entrega</div>

        <div className={styles.scrollableContent}>
          <div className={styles.modalInputGroup}>
            <label>CEP *</label>
            <PatternFormat
              format="##.###-###"
              mask="_"
              value={cep}
              onValueChange={(values) => setCep(values.value)}
              placeholder="00.000-000"
              className={styles.modalInput}
            />
          </div>

          <div className={styles.row}>
            <div className={`${styles.modalInputGroup} ${styles.flex1}`}>
              <label>UF *</label>
              <select
                className={styles.modalSelect}
                value={uf}
                onChange={(e) => {
                  setUf(e.target.value);
                  setCidade(""); // Reseta cidade ao trocar estado
                }}
              >
                <option value="">Selecione</option>
                {ESTADOS.map((e) => (
                  <option key={e.id} value={e.uf}>
                    {e.uf}
                  </option>
                ))}
              </select>
            </div>

            <div className={`${styles.modalInputGroup} ${styles.flex3}`}>
              <label>Cidade *</label>
              <select
                className={styles.modalSelect}
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                disabled={!uf}
              >
                <option value="">
                  {uf ? "Selecione a cidade" : "Selecione a UF primeiro"}
                </option>
                {cidadesFiltradas.map((c) => (
                  <option key={c.id} value={c.nome}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
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

          <div className={styles.row}>
            <div className={`${styles.modalInputGroup} ${styles.flex1}`}>
              <label>Número *</label>
              <input
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="123"
              />
            </div>
            <div className={`${styles.modalInputGroup} ${styles.flex2}`}>
              <label>Bairro *</label>
              <input
                type="text"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Ex: Centro"
              />
            </div>
          </div>

          <div className={styles.modalInputGroup}>
            <label>Complemento</label>
            <input
              type="text"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
              placeholder="Apto, Bloco..."
            />
          </div>
        </div>

        <button className={styles.modalConfirmButton} onClick={handleSave}>
          Salvar Endereço
        </button>
      </div>
    </div>
  );
}
