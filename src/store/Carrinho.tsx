import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "../models/Product";

type CarrinhoState = {
  produtos: Product[];
  add: (product: Product) => void;
  remove: (product: Product) => void;
  clear: () => void;
  loadProducts: (list: Product[]) => void;
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
                  ? { ...p, quantity: (p.quantity ?? 0) + 1 }
                  : p
              ),
            };
          }

          return {
            produtos: [...state.produtos, { ...product, quantity: 1, obs: "" }],
          };
        }),

      remove: (product) =>
        set((state) => {
          const item = state.produtos.find((p) => p.id === product.id);
          if (!item) return state;

          if ((item.quantity ?? 0) <= 1) {
            return {
              produtos: state.produtos.filter((p) => p.id !== product.id),
            };
          }

          return {
            produtos: state.produtos.map((p) =>
              p.id === product.id
                ? { ...p, quantity: (p.quantity ?? 0) - 1 }
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
