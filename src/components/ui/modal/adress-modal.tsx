"use client";

import { API, CidadeResponse, EstadoResponse } from "@/src/Services/API";
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
  const api = useMemo(() => new API(), []);
  const [cep, setCep] = useState(() => initialAddress?.cep || "");
  const [ufId, setUfId] = useState(() => initialAddress?.ufId || 0);
  const [cidadeId, setCidadeId] = useState(() => initialAddress?.cidadeId || 0);
  const [rua, setRua] = useState(() => initialAddress?.rua || "");
  const [numero, setNumero] = useState(() => initialAddress?.numero || "");
  const [bairro, setBairro] = useState(() => initialAddress?.bairro || "");
  const [complemento, setComplemento] = useState(
    () => initialAddress?.complemento || "",
  );
  const [estados, setEstados] = useState<EstadoResponse[]>([]);
  const [cidades, setCidades] = useState<CidadeResponse[]>([]);
  const [isLoadingEstados, setIsLoadingEstados] = useState(false);
  const [isLoadingCidades, setIsLoadingCidades] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadEstados() {
      setIsLoadingEstados(true);
      try {
        const data = await api.getEstados();
        if (isMounted) {
          setEstados(data);
        }
      } catch (error) {
        console.error("Erro ao carregar estados", error);
      } finally {
        if (isMounted) {
          setIsLoadingEstados(false);
        }
      }
    }

    loadEstados();

    return () => {
      isMounted = false;
    };
  }, [api]);

  useEffect(() => {
    let isMounted = true;

    if (!ufId) {
      setCidades([]);
      return () => {
        isMounted = false;
      };
    }

    async function loadCidades() {
      setIsLoadingCidades(true);
      try {
        const data = await api.getCidades(ufId);
        if (isMounted) {
          setCidades(data);
        }
      } catch (error) {
        console.error("Erro ao carregar cidades", error);
      } finally {
        if (isMounted) {
          setIsLoadingCidades(false);
        }
      }
    }

    loadCidades();

    return () => {
      isMounted = false;
    };
  }, [api, ufId]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!rua || !numero || !bairro || !cidadeId || !ufId || !cep) {
      alert("Preencha todos os campos obrigatorios!");
      return;
    }

    onSave({
      cep,
      ufId,
      cidadeId,
      rua,
      numero,
      bairro,
      complemento,
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

        <div className={styles.title}>Endereco de Entrega</div>

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
                value={ufId}
                onChange={(e) => {
                  const selectedUfId = Number(e.target.value);
                  setUfId(selectedUfId);
                  setCidadeId(0);
                }}
                disabled={isLoadingEstados}
              >
                <option value={0}>Selecione</option>
                {estados.map((estado) => (
                  <option key={estado.id} value={estado.id}>
                    {estado.sigla || estado.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className={`${styles.modalInputGroup} ${styles.flex3}`}>
              <label>Cidade *</label>
              <select
                className={styles.modalSelect}
                value={cidadeId}
                onChange={(e) => setCidadeId(Number(e.target.value))}
                disabled={!ufId || isLoadingCidades}
              >
                <option value={0}>
                  {!ufId
                    ? "Selecione a UF primeiro"
                    : isLoadingCidades
                      ? "Carregando cidades..."
                      : "Selecione a cidade"}
                </option>
                {cidades.map((cidade) => (
                  <option key={cidade.id} value={cidade.id}>
                    {cidade.nome}
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
              placeholder="Ex: Rua Joao Martins"
            />
          </div>

          <div className={styles.row}>
            <div className={`${styles.modalInputGroup} ${styles.flex1}`}>
              <label>Numero *</label>
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
          Salvar Endereco
        </button>
      </div>
    </div>
  );
}
