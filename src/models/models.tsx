export interface ProdutoPedido {
  id: number;
  categoria: categoria;
  imgUrl: string;
  quantidade: number;
  descricao: string;
  nome?: string;
  preco: number;
}
export interface categoria {
  id: number;
  nome?: string;
}
export interface EnderecoPedido {
  cep: string;
  ufId: number;
  cidadeId: number;
  rua: string;
  numero: string;
  bairro: string;
  complemento: string;
}

export interface UsuarioPedido {
  nome: string;
  telefone: string;
}

// export interface Pedido {
//   id?: number;
//   produtos: ProdutoPedido[];
//   endereco: EnderecoResponse;
//   observacao: string;
//   metodoPagamentoId: number;
//   status?: { id: number; nome: string };
//   usuario: UsuarioPedido;
//   estabelecimento?: EstabelecimentoResponse;
// }
