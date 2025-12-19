import { EnderecoData } from "../components/ui/modal/adress-modal";
import { pedidoProduto } from "./PedidoProduto";
import { Usuario } from "./Usuario";

export interface Pedido {
  usuario: Usuario;
  produtos: pedidoProduto[];
  observacao: string;
  endereco: EnderecoData | string;
  MetodoPagamentoId: number;
}
