import { Estabelecimento } from "../store/Estabelecimento";

export interface ProdutoPedido {
  id: number;
  categoria: string;
  imgUrl: string;
  quantidade: number;
  descricao: string;
  // Opcional: Incluir nome e preco se o seu backend já fizer o Join
  nome?: string;
  preco: number;
}

export interface EnderecoPedido {
  cep: number;
  uf: string;
  cidade: string;
  rua: string;
  numero: number;
  bairro: string;
  complemento: string;
}

export interface UsuarioPedido {
  nome: string;
  telefone: string;
}

export interface Pedido {
  id?: number;
  produtos: ProdutoPedido[];
  endereco: EnderecoPedido | null;
  observacao: string;
  metodoPagamentoId: number;
  status?: string;
  usuario: UsuarioPedido;
  estabelecimento?: Estabelecimento;
}
