import { create } from "zustand";
import { Product } from "../models/Product";

export type CarrinhoItem = Product & {
  quantidade: number;
  observation: string;
};

type CarrinhoState = {
  produtos: CarrinhoItem[];

  add: (product: Product) => void;
  remove: (product: Product) => void;
  clear: () => void;
};

export const useCarrinho = create<CarrinhoState>((set) => ({
  produtos: [],

  add: (product) =>
    set((state) => {
      const item = state.produtos.find((p) => p.id === product.id);

      if (item) {
        return {
          produtos: state.produtos.map((p) =>
            p.id === product.id ? { ...p, quantidade: p.quantidade + 1 } : p
          ),
        };
      }

      // Adiciona o produto pela primeira vez
      return {
        produtos: [
          ...state.produtos,
          { ...product, quantidade: 1, observation: "" },
        ],
      };
    }),

  remove: (product) =>
    set((state) => {
      const item = state.produtos.find((p) => p.id === product.id);

      if (!item) return state;

      if (item.quantidade <= 1) {
        return {
          produtos: state.produtos.filter((p) => p.id !== product.id),
        };
      }

      return {
        produtos: state.produtos.map((p) =>
          p.id === product.id ? { ...p, quantidade: p.quantidade - 1 } : p
        ),
      };
    }),

  clear: () => set({ produtos: [] }),
}));
