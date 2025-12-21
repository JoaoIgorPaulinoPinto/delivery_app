import axios from "axios";
import Cookies from "js-cookie";
import {
  EnderecoPedido,
  Pedido,
  ProdutoPedido,
  UsuarioPedido,
} from "../models/models";
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
  console.log(config);
  return config;
});

export class API {
  /**
   * Obtém os dados do estabelecimento e já salva o ID nos Cookies.
   * Retorna o objeto completo para uso imediato no Store.
   */
  public async setStablishment(slug: string): Promise<Estabelecimento> {
    const response = await api.get("/Estabelecimento", {
      params: { slug },
    });

    const dados: Estabelecimento = response.data;

    // Salva o ID no cookie para as próximas requisições (interceptors)
    Cookies.set("Estabelecimento", dados.id.toString());

    return dados;
  }

  /**
   * Apenas busca os dados do estabelecimento sem side-effects (sem mexer em cookies).
   */
  public async getStablishment(slug: string): Promise<Estabelecimento> {
    const response = await api.get("/Estabelecimento", {
      params: { slug },
    });
    return response.data;
  }

  /**
   * Busca os produtos injetando o ID manualmente para evitar delay de cookies.
   */
  public async getProducts(): Promise<ProdutoPedido[]> {
    const response = await api.get("/Produto");

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

    const pedido: {
      clientKey: string;
      produtos: { produtoId: number; quantidade: number }[];
      endereco: EnderecoPedido | null;
      observacao: string;
      metodoPagamentoId: number;
      usuario: UsuarioPedido;
    } = {
      clientKey: clientKey ?? "",
      produtos: order.produtos.map((p) => ({
        produtoId: p.id,
        quantidade: p.quantidade,
      })),
      endereco: order.endereco,
      observacao: order.observacao,
      metodoPagamentoId: order.metodoPagamentoId, // faltava aqui
      usuario: order.usuario,
    };

    // aqui você faria a chamada para sua API
    // return await api.post("/pedido", pedido);

    console.log(pedido);

    // O segundo parâmetro do post é o BODY (order)
    // O terceiro parâmetro são as CONFIGS (params/headers)
    const response = await api.post("/Pedido", pedido);

    // Salva a nova key se o backend retornar um novo usuário/vínculo
    if (response.data?.pedido?.usuario?.clientKey) {
      Cookies.set("clientKey", response.data.pedido.usuario.clientKey);
    }
    return response;
  }

  public async getPedidos() {
    const clientKey = Cookies.get("clientKey");

    const response = await api.get("/Pedido", {
      params: {
        clientKey: clientKey || "d21b00c604574ee0a0fadbdca6e7721e",
      },
    });

    return response.data;
  }
}
