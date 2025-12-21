import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { EnderecoPedido, UsuarioPedido } from "../models/models";

// Definimos o estado inicial para reutilizar no reset
const initialUsuario: UsuarioPedido = { nome: "", telefone: "" };
const initialEndereco: EnderecoPedido = {
  cep: 0,
  uf: "",
  cidade: "",
  rua: "",
  numero: 0,
  bairro: "",
  complemento: "",
};

type UsuarioState = {
  usuario: UsuarioPedido;
  endereco: EnderecoPedido;
  setUsuario: (usuario: UsuarioPedido) => void;
  setNome: (nome: string) => void;
  setTelefone: (telefone: string) => void;
  setEndereco: (endereco: EnderecoPedido) => void;
  reset: () => void;
};

export const useUsuario = create<UsuarioState>()(
  persist(
    (set) => ({
      usuario: initialUsuario,
      endereco: initialEndereco,

      // Atualiza o objeto usuario inteiro
      setUsuario: (usuario) => set({ usuario }),

      // Atualiza apenas o nome dentro do objeto usuario
      setNome: (nome) =>
        set((state) => ({
          usuario: { ...state.usuario, nome },
        })),

      // Atualiza apenas o telefone dentro do objeto usuario
      setTelefone: (telefone) =>
        set((state) => ({
          usuario: { ...state.usuario, telefone },
        })),

      // Atualiza o endereço
      setEndereco: (endereco) => set({ endereco }),

      // Limpa os dados (útil para logout ou após finalizar pedido)
      reset: () =>
        set({
          usuario: initialUsuario,
          endereco: initialEndereco,
        }),
    }),
    {
      name: "usuario-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
