import { Endereco } from "../components/ui/modal/adress-modal";
import pedidoProduto from "./PedidoProduto";
import Usuario from "./Usuario";

export default interface Pedido {
  usuario: Usuario;
  produtos: pedidoProduto[];
  observacao: string;
  endereco: Endereco | string;
  MetodoPagamentoId: number;
}
