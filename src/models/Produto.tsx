export interface Produto {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
  descricao: string;
  imgUrl: string;
  quantidade: number | 0;
}
