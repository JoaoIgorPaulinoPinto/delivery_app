import axios from "axios";
import Cookies from "js-cookie";
import { Pedido } from "../models/Pedido";
import { Produto } from "../models/Produto";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    estabelecimentoId: Cookies.get("Estabelecimento"),
  },
});
export class API {
  public async getProducts(): Promise<Produto[]> {
    const response = await api.get("/Produto");
    console.log(response);
    return response.data.map(
      (item: Produto): Produto => ({
        id: item.id,
        nome: item.nome,
        preco: item.preco,
        descricao: item.descricao,
        imgUrl: item.imgUrl,
        categoria: item.categoria,
        quantidade: item.quantidade,
      })
    );
  }

  public async setStablishment(slug: string) {
    const response = await api.get("/Estabelecimento", {
      params: { slug },
    });
    Cookies.set("Estabelecimento", response.data);
  }
  public async GetCategories() {
    const response = await api.get("/Categoria");
    return response;
  }
  public async GetPaymentMeth() {
    const response = await api.get("/MetodoPagamento");
    return response;
  }
  public async CreatePedido(order: Pedido) {
    const response = await api.post("/Pedido", order);
    return response;
  }
}
