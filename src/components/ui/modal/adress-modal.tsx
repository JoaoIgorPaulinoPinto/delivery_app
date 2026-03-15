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
  const [ufSearch, setUfSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [showUfList, setShowUfList] = useState(false);
  const [showCityList, setShowCityList] = useState(false);

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

  const selectedUf = estados.find((e) => e.id === ufId);
  const selectedCity = cidades.find((c) => c.id === cidadeId);

  const filteredEstados = useMemo(() => {
    const term = ufSearch.toLowerCase();
    return estados.filter((e) =>
      `${e.sigla} ${e.nome}`.toLowerCase().includes(term),
    );
  }, [estados, ufSearch]);

  const filteredCidades = useMemo(() => {
    const term = citySearch.toLowerCase();
    return cidades.filter((c) => c.nome.toLowerCase().includes(term));
  }, [cidades, citySearch]);

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
              autoComplete="off"
              className={styles.modalInput}
            />
          </div>

          <div className={styles.row}>
            <div className={`${styles.modalInputGroup} ${styles.flex1}`}>
              <label>UF *</label>
              <div className={styles.searchSelect}>
                <input
                  className={styles.searchSelectInput}
                  value={ufSearch}
                  placeholder={selectedUf?.sigla || "Buscar UF"}
                  autoComplete="off"
                  onFocus={() => {
                    setShowUfList(true);
                    setUfSearch("");
                  }}
                  onChange={(e) => setUfSearch(e.target.value)}
                  onBlur={() => setTimeout(() => setShowUfList(false), 120)}
                  disabled={isLoadingEstados}
                />
                {selectedUf && !ufSearch && (
                  <span className={styles.pill}>{selectedUf.sigla}</span>
                )}
                {showUfList && (
                  <div className={styles.searchSelectList}>
                    {isLoadingEstados && (
                      <div className={styles.searchSelectItem}>Carregando...</div>
                    )}
                    {!isLoadingEstados &&
                      (filteredEstados.length ? (
                        filteredEstados.map((estado) => (
                          <div
                            key={estado.id}
                            className={styles.searchSelectItem}
                            onMouseDown={() => {
                              setUfId(estado.id);
                              setCidadeId(0);
                              setUfSearch("");
                              setShowUfList(false);
                            }}
                          >
                            <strong>{estado.sigla}</strong> — {estado.nome}
                          </div>
                        ))
                      ) : (
                        <div className={styles.searchSelectItem}>
                          Nenhum estado encontrado
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className={`${styles.modalInputGroup} ${styles.flex3}`}>
              <label>Cidade *</label>
              <div className={styles.searchSelect}>
                <input
                  className={styles.searchSelectInput}
                  value={citySearch}
                  placeholder={
                    !ufId
                      ? "Selecione a UF"
                      : selectedCity?.nome || "Buscar cidade"
                  }
                  autoComplete="off"
                  onFocus={() => {
                    if (!ufId) return;
                    setShowCityList(true);
                    setCitySearch("");
                  }}
                  onChange={(e) => setCitySearch(e.target.value)}
                  onBlur={() => setTimeout(() => setShowCityList(false), 120)}
                  disabled={!ufId || isLoadingCidades}
                />
                {selectedCity && !citySearch && (
                  <span className={styles.pill}>{selectedCity.nome}</span>
                )}
                {showCityList && (
                  <div className={styles.searchSelectList}>
                    {isLoadingCidades && (
                      <div className={styles.searchSelectItem}>
                        Carregando cidades...
                      </div>
                    )}
                    {!isLoadingCidades &&
                      (filteredCidades.length ? (
                        filteredCidades.map((cidade) => (
                          <div
                            key={cidade.id}
                            className={styles.searchSelectItem}
                            onMouseDown={() => {
                              setCidadeId(cidade.id);
                              setCitySearch("");
                              setShowCityList(false);
                            }}
                          >
                            {cidade.nome}
                          </div>
                        ))
                      ) : (
                        <div className={styles.searchSelectItem}>
                          Nenhuma cidade encontrada
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.modalInputGroup}>
            <label>Rua *</label>
            <input
              type="text"
              value={rua}
              onChange={(e) => setRua(e.target.value)}
              autoComplete="off"
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
              autoComplete="off"
              placeholder="123"
            />
          </div>
          <div className={`${styles.modalInputGroup} ${styles.flex2}`}>
            <label>Bairro *</label>
            <input
              type="text"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              autoComplete="off"
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
              autoComplete="off"
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
