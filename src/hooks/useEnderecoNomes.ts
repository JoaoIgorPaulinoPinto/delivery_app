"use client";

import { API, CidadeResponse, EnderecoResponse, EstadoResponse } from "../Services/API";
import { EnderecoPedido } from "../models/models";
import { useEffect, useMemo, useState } from "react";

type EnderecoComIds = Pick<EnderecoPedido, "ufId" | "cidadeId"> | Pick<EnderecoResponse, "ufId" | "cidadeId">;

let estadosCache: EstadoResponse[] | null = null;
const cidadesCache = new Map<number, CidadeResponse[]>();

export function useEnderecoNomes(endereco?: EnderecoComIds | null) {
  const api = useMemo(() => new API(), []);
  const [estadoNome, setEstadoNome] = useState("");
  const [cidadeNome, setCidadeNome] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const ufId = Number(endereco?.ufId ?? 0);
      const cidadeId = Number(endereco?.cidadeId ?? 0);

      if (!ufId || !cidadeId) {
        if (isMounted) {
          setEstadoNome("");
          setCidadeNome("");
        }
        return;
      }

      let estados = estadosCache;
      if (!estados) {
        estados = await api.getEstados();
        estadosCache = estados;
      }

      let cidades = cidadesCache.get(ufId);
      if (!cidades) {
        cidades = await api.getCidades(ufId);
        cidadesCache.set(ufId, cidades);
      }

      if (!isMounted) return;

      const estado = estados.find((e) => e.id === ufId);
      const cidade = cidades.find((c) => c.id === cidadeId);

      setEstadoNome(estado?.nome || "");
      setCidadeNome(cidade?.nome || "");
    }

    load().catch((error) => {
      console.error("Erro ao resolver nomes de localizacao", error);
      if (isMounted) {
        setEstadoNome("");
        setCidadeNome("");
      }
    });

    return () => {
      isMounted = false;
    };
  }, [api, endereco?.cidadeId, endereco?.ufId]);

  return {
    estadoNome,
    cidadeNome,
  };
}
