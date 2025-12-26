import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { EnderecoPedido } from "../models/models";

// Interfaces baseadas no seu Schema
interface StatusEstabelecimento {
  id: number;
  nome: string;
}

export interface Estabelecimento {
  id: number;
  slug: string;
  nomeFantasia: string;
  telefone: string;
  email: string;
  whatsapp: string;
  endereco: EnderecoPedido;
  abertura: string;
  fechamento: string;
  taxaEntrega: number;
  pedidoMinimo: number;
  status: StatusEstabelecimento;
}

type EstabelecimentoState = {
  estabelecimento: Estabelecimento | null;
  setEstabelecimento: (estabelecimento: Estabelecimento) => void;
  clear: () => void;
};

export const useEstabelecimento = create<EstabelecimentoState>()(
  persist(
    (set) => ({
      estabelecimento: null,

      setEstabelecimento: (estabelecimento) => set({ estabelecimento }),

      clear: () => set({ estabelecimento: null }),
    }),
    {
      name: "estabelecimento-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
