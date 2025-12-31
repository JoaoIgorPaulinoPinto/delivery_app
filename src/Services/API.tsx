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
  const clientKey = Cookies.get("clientKey");

  if (clientKey) {
    config.headers.clientKey = clientKey;
  }
  return config;
});

export class API {
  public async setStablishment(slug: string): Promise<Estabelecimento | null> {
    try {
      const response = await api.get("/Estabelecimento", {
        params: { slug },
      });

      const dados: Estabelecimento = response.data;

      if (dados) {
        // Use dados.slug se for string, ou garanta a conversão
        Cookies.set("Estabelecimento", String(dados.slug));
        return dados;
      }

      return null;
    } catch (error: unknown) {
      // Se a API retornar 404 ou 500 porque o slug não existe
      console.error("Erro ao buscar estabelecimento:", error);
      return null;
    }
  }

  public async getStablishment(slug: string): Promise<Estabelecimento> {
    const response = await api.get("/Estabelecimento", {
      params: { slug },
    });
    return response.data;
  }

  public async getProducts(slug: string): Promise<ProdutoPedido[]> {
    const response = await api.get("/Produto", {
      headers: {
        slug: slug,
      },
    });
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

  public async GetCategories(slug: string) {
    return await api.get("/Categoria", {
      headers: {
        slug: slug,
      },
    });
  }

  public async GetPaymentMeth(slug: string) {
    return await api.get("/MetodoPagamento", {
      headers: {
        slug: slug,
      },
    });
  }

  public async CreatePedido(order: Pedido, slug: string) {
    const clientKey = Cookies.get("clientKey");

    const pedido = {
      usuario: order.usuario,
      endereco: {
        rua: order.endereco?.rua,
        numero: String(order.endereco!.numero),
        bairro: order.endereco!.bairro,
        cidade: order.endereco!.cidade,
        uf: order.endereco!.uf,
        cep: String(order.endereco!.cep),
        complemento: order.endereco!.complemento,
      },
      produtos: order.produtos.map((p) => ({
        produtoId: p.id,
        quantidade: p.quantidade,
      })),
      metodoPagamentoId: order.metodoPagamentoId,
      observacao: order.observacao || "",
    };
    const response = await api.post("/Pedido/Criar", pedido, {
      headers: {
        slug: slug,
      },
      params: { clientKey: clientKey ?? null },
    });

    if (response.data?.pedido?.usuario?.clientKey) {
      Cookies.set("clientKey", response.data.pedido.usuario.clientKey);
    }
    return response;
  }

  public async getPedidos(slug: string): Promise<Pedido[]> {
    const clientKey = Cookies.get("clientKey");
    try {
      const response = await api.get("/Pedido/Cliente", {
        headers: {
          slug: slug,
        },
        params: {
          clientKey: clientKey ?? null,
        },
      });
      return response.data;
    } catch {
      return [];
    }
  }
}
