import { Endereco } from "@/src/components/ui/modal/adress-modal";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import Usuario from "../models/Usuario";

type UsuarioState = {
  usuario: Usuario;
  endereco: Endereco;
  set: (usuario: Usuario) => void;
  setNome: (nome: string) => void;
  setTelefone: (telefone: string) => void;
  setEndereco: (endereco: Endereco) => void;
  reset: () => void; // Boa prática para logout
};

export const useUsuario = create<UsuarioState>()(
  persist(
    (set) => ({
      // Inicialize com valores padrão para evitar erros de undefined
      usuario: { nome: "", telefone: "" } as Usuario,
      endereco: {} as Endereco,

      set: (usuario) => set({ usuario }),

      setNome: (nome) =>
        set((state) => ({ usuario: { ...state.usuario, nome } })),

      setTelefone: (telefone) =>
        set((state) => ({ usuario: { ...state.usuario, telefone } })),

      setEndereco: (endereco) => set({ endereco }),

      reset: () => set({ usuario: {} as Usuario, endereco: {} as Endereco }),
    }),
    {
      name: "usuario-storage",
      storage: createJSONStorage(() => localStorage), // Garante o uso do localStorage
    }
  )
);
