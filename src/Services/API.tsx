import axios from "axios";
import { EnderecoPedido } from "../models/models";

const isDev = process.env.NODE_NODE_ENV === "development";

export const api = axios.create({
  baseURL: "http://localhost:5000/api/", // Note: .NET HTTPS is usually 5001
  headers: {
    "Content-Type": "application/json",
  },
  // This bypasses the self-signed certificate error in Node.js
});
export interface EnderecoResponse {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  complemento?: string;
}

export interface CategoriaResponse {
  id: number;
  nome: string;
}
export interface MetodoPagamentoResponse {
  id: number;
  nome: string;
}
export interface ProdutosResponse {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imgUrl: string;
  categoria: CategoriaResponse;
}
export interface HorarioFuncionamentoResponse {
  dia: string;
  abre: string;
  fecha: string;
}
export interface EstabelecimentoResponse {
  nomeFantasia?: string;
  horarioFuncionamento?: HorarioFuncionamentoResponse[];
  taxaEntrega: number;
  pedidoMinimo: number;
  telefone?: string;
  whatsapp?: string;
  endereco: EnderecoResponse;
  status?: string;
  email?: string;
}
export interface CreatePedidoDTO {
  nomeCliente?: string;
  telefoneCliente?: string;
  metodoPagamento: number;
  produtoPedidos?: CreateProdutoPedidoDTO[];
  observacao?: string;
  endereco: CreateEnderecoDTO;
  sessionToken?: string;
}
export interface PedidoResponse {
  id: number;
  nomeCliente?: string;
  telefoneCliente?: string;
  metodoPagamento: string;
  produtoPedidos?: { produto: string; preco: number; quantidade: number }[];
  observacao?: string;
  endereco: EnderecoPedido;
  status: string;
}

export interface CreateProdutoPedidoDTO {
  // Complete de acordo com a definição real desse DTO
  produtoId: number;
  quantidade: number;
}

export interface CreateEnderecoDTO {
  ufId: number;
  cidadeId: number;
  bairro?: string;
  numero?: string;
  cep?: string;
  rua?: string;
  complemento?: string;
}

export class API {
  public async getEstabelecimento(
    slug: string,
  ): Promise<EstabelecimentoResponse> {
    const response = await api.get("Estabelecimento", {
      params: {
        slug: slug,
      },
    });
    console.log(response.data);
    return response.data;
  }

  public async getCategorias(
    estabelecimentoSlug: string,
  ): Promise<CategoriaResponse[]> {
    const response = await api.get("/Categoria", {
      params: {
        slug: estabelecimentoSlug,
      },
    });
    return response.data;
  }
  public async getMetodosPagamento(
    estabelecimentoSlug: string,
  ): Promise<MetodoPagamentoResponse[]> {
    const response = await api.get("/MetodoPagamento", {
      params: {
        slug: estabelecimentoSlug,
      },
    });
    console.log(response.data);
    return response.data;
  }

  public async getProdutos(
    estabelecimentoSlug: string,
  ): Promise<ProdutosResponse[]> {
    const response = await api.get("/Produto", {
      params: {
        slug: estabelecimentoSlug,
      },
    });
    console.log(response.data);
    return response.data;
  }

  public async CriarPedidos(
    pedido: CreatePedidoDTO,
    estabalecimentoSlug: string,
  ): Promise<string> {
    const pedidoMapeado: CreatePedidoDTO = {
      nomeCliente: pedido.nomeCliente,
      telefoneCliente: pedido.telefoneCliente,
      metodoPagamento: pedido.metodoPagamento,
      observacao: pedido.observacao,
      endereco: {
        ufId: pedido.endereco.ufId,
        cidadeId: pedido.endereco.cidadeId,
        bairro: pedido.endereco.bairro,
        numero: pedido.endereco.numero,
        cep: pedido.endereco.cep,
        rua: pedido.endereco.rua,
        complemento: pedido.endereco.complemento,
      },
      produtoPedidos: pedido.produtoPedidos!.map((p) => ({
        produtoId: p.produtoId, // ou p.id, depende do seu modelo
        quantidade: p.quantidade,
      })),
      sessionToken: localStorage.getItem("sessionToken") || "",
    };

    console.log(pedidoMapeado);
    const response = await api.post(
      "/Pedido",
      pedidoMapeado, // body
      {
        headers: {
          sessionToken: pedidoMapeado.sessionToken || "",
        },
        params: {
          estabelecimentoSlug: estabalecimentoSlug,
        },
      },
    );

    localStorage.setItem("sessionToken", response.data.sessionToken);
    console.log(response.data);
    return "Pedido criado com sucesso";
  }

  public async getPedidos(): Promise<PedidoResponse[]> {
    const response = await api.get("/Pedido", {
      headers: {
        token: localStorage.getItem("sessionToken") || "",
      },
    });
    const produtosResponse: PedidoResponse[] = [];
    for (const pedido of response.data) {
      produtosResponse.push({
        id: pedido.id,
        nomeCliente: pedido.nomeCliente,
        produtoPedidos: pedido.produtos,
        endereco: pedido.endereco,
        observacao: pedido.observacao,
        metodoPagamento: pedido.metodoPagamentoId,
        status: pedido.status,
      });
    }

    return produtosResponse;
  }
}
