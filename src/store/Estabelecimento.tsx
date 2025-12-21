import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Interfaces baseadas no seu Schema
interface EnderecoEstabelecimento {
  id: number;
  cep: number;
  uf: string;
  cidade: string;
  rua: string;
  numero: number;
  bairro: string;
  complemento: string;
}

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
  endereco: EnderecoEstabelecimento;
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
