import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Produto } from "../models/Produto";

type CarrinhoState = {
  produtos: Produto[];
  add: (product: Produto) => void;
  remove: (product: Produto) => void;
  clear: () => void;
  loadProducts: (list: Produto[]) => void;
};

export const useCarrinho = create<CarrinhoState>()(
  persist(
    (set) => ({
      produtos: [],

      loadProducts: (list) =>
        set({
          produtos: list.map((p) => ({
            ...p,
          })),
        }),

      add: (product) =>
        set((state) => {
          const item = state.produtos.find((p) => p.id === product.id);

          if (item) {
            return {
              produtos: state.produtos.map((p) =>
                p.id === product.id
                  ? { ...p, quantidade: (p.quantidade ?? 0) + 1 }
                  : p
              ),
            };
          }

          return {
            produtos: [
              ...state.produtos,
              { ...product, quantidade: 1, obs: "" },
            ],
          };
        }),

      remove: (product) =>
        set((state) => {
          const item = state.produtos.find((p) => p.id === product.id);
          if (!item) return state;

          if ((item.quantidade ?? 0) <= 1) {
            return {
              produtos: state.produtos.filter((p) => p.id !== product.id),
            };
          }

          return {
            produtos: state.produtos.map((p) =>
              p.id === product.id
                ? { ...p, quantidade: (p.quantidade ?? 0) - 1 }
                : p
            ),
          };
        }),

      clear: () => set({ produtos: [] }),
    }),

    {
      name: "carrinho-storage",
    }
  )
);
