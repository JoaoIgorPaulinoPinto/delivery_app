import axios from "axios";
import Cookies from "js-cookie";
import { Pedido, ProdutoPedido } from "../models/models";
import { Estabelecimento } from "../store/Estabelecimento"; // Certifique-se de exportar a interface do store

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const estId = Cookies.get("Estabelecimento");
  const clientKey = Cookies.get("clientKey");
  if (estId) {
    config.headers.estabelecimentoId = estId;
  }
  if (clientKey) {
    config.headers.clientKey = clientKey;
  }
  return config;
});

export class API {
  public async setStablishment(slug: string): Promise<Estabelecimento> {
    const response = await api.get("/Estabelecimento", {
      params: { slug },
    });

    const dados: Estabelecimento = response.data;

    Cookies.set("Estabelecimento", dados.id.toString());

    return dados;
  }

  public async getStablishment(slug: string): Promise<Estabelecimento> {
    const response = await api.get("/Estabelecimento", {
      params: { slug },
    });
    return response.data;
  }

  public async getProducts(): Promise<ProdutoPedido[]> {
    const response = await api.get("/Produto");

    console.log("REPOSTA DA API: " + response.data);
    return response.data.map(
      (item: ProdutoPedido): ProdutoPedido => ({
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

  public async GetCategories() {
    return await api.get("/Categoria");
  }

  public async GetPaymentMeth() {
    return await api.get("/MetodoPagamento");
  }

  public async CreatePedido(order: Pedido) {
    const clientKey = Cookies.get("clientKey");

    const pedido = {
      produtos: order.produtos.map((p) => ({
        produtoId: p.id,
        quantidade: p.quantidade,
      })),
      endereco: order.endereco,
      observacao: order.observacao,
      metodoPagamentoId: order.metodoPagamentoId,
      usuario: order.usuario,
    };
    const response = await api.post("/Pedido", pedido, {
      params: { clientKey },
    });
    console.log("Resposta da API: " + response.data);
    console.log("Resposta da API: " + order);

    if (response.data?.pedido?.usuario?.clientKey) {
      Cookies.set("clientKey", response.data.pedido.usuario.clientKey);
    }

    return response;
  }

  public async getPedidos() {
    const clientKey = Cookies.get("clientKey");
    console.log("client key " + clientKey);

    const response = await api.get("/Pedido", {
      params: {
        clientKey: clientKey ?? null,
      },
    });
    console.log("Resposta da API: " + response.data);
    return response.data;
  }
}
