import { Estabelecimento } from "../store/Estabelecimento";

export interface ProdutoPedido {
  id: number;
  categoria: string;
  imgUrl: string;
  quantidade: number;
  descricao: string;
  nome?: string;
  preco: number;
}

export interface EnderecoPedido {
  cep: string;
  uf: string;
  cidade: string;
  rua: string;
  numero: string;
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
  status?: { id: number; nome: string };
  usuario: UsuarioPedido;
  estabelecimento?: Estabelecimento;
}
