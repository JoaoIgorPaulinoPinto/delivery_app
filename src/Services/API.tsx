import axios from "axios";

function buildApiPath(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "").toLowerCase();
  const hasApiPrefix =
    baseUrl.endsWith("/api") || baseUrl.endsWith("/api/");

  return hasApiPrefix ? normalizedPath : `/api${normalizedPath}`;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface EnderecoResponse {
  rua: string;
  numero: string;
  bairro: string;
  cidadeId: number;
  ufId: number;
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

interface CreatePedidoRequestBody {
  usuario: {
    nome: string;
    telefone: string;
  };
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidadeId: number;
    ufId: number;
    cep: string;
    complemento: string;
    cidade?: number;
    uf?: number;
  };
  produtos: {
    produtoId: number;
    quantidade: number;
  }[];
  metodoPagamentoId: number;
  observacao: string;
  clientKey?: string;
}

export interface PedidoResponse {
  id: number;
  nomeCliente?: string;
  telefoneCliente?: string;
  metodoPagamento: string;
  produtoPedidos?: { produto: string; preco: number; quantidade: number }[];
  observacao?: string;
  endereco: EnderecoResponse;
  status: string;
}

export interface CreateProdutoPedidoDTO {
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

export interface EstadoResponse {
  id: number;
  nome: string;
  sigla?: string;
}

export interface CidadeResponse {
  id: number;
  nome: string;
  estadoId?: number;
}

export class API {
  private mapEndereco(data: unknown): EnderecoResponse {
    const endereco = (data ?? {}) as Record<string, unknown>;

    return {
      rua: String(endereco.rua ?? ""),
      numero: String(endereco.numero ?? ""),
      bairro: String(endereco.bairro ?? ""),
      cidadeId: Number(endereco.cidadeId ?? endereco.cidade ?? 0),
      ufId: Number(endereco.ufId ?? endereco.uf ?? 0),
      cep: String(endereco.cep ?? ""),
      complemento: String(endereco.complemento ?? ""),
    };
  }

  public async getEstabelecimento(
    slug: string,
  ): Promise<EstabelecimentoResponse> {
    const response = await api.get(buildApiPath("/estabelecimento"), {
      params: {
        slug: slug,
      },
    });

    return {
      ...response.data,
      endereco: this.mapEndereco(response.data?.endereco),
    };
  }

  public async getCategorias(
    estabelecimentoSlug: string,
  ): Promise<CategoriaResponse[]> {
    const response = await api.get(buildApiPath("/categoria"), {
      params: {
        slug: estabelecimentoSlug,
      },
    });
    return response.data;
  }

  public async getMetodosPagamento(
    estabelecimentoSlug: string,
  ): Promise<MetodoPagamentoResponse[]> {
    const response = await api.get(buildApiPath("/metodopagamento"), {
      params: {
        slug: estabelecimentoSlug,
      },
    });
    return response.data;
  }

  public async getProdutos(
    estabelecimentoSlug: string,
  ): Promise<ProdutosResponse[]> {
    const response = await api.get(buildApiPath("/produto"), {
      params: {
        slug: estabelecimentoSlug,
      },
    });
    return response.data;
  }

  public async getEstados(): Promise<EstadoResponse[]> {
    const response = await api.get(buildApiPath("/localizacao/estados"));
    const estados = Array.isArray(response.data) ? response.data : [];

    return estados.map((estado: Record<string, unknown>) => ({
      id: Number(estado.id ?? 0),
      nome: String(estado.nome ?? estado.descricao ?? ""),
      sigla: String(estado.sigla ?? estado.uf ?? ""),
    }));
  }

  public async getCidades(estadoId: number): Promise<CidadeResponse[]> {
    const response = await api.get(buildApiPath("/localizacao/cidades"), {
      params: {
        estadoId,
      },
    });
    const cidades = Array.isArray(response.data) ? response.data : [];

    return cidades.map((cidade: Record<string, unknown>) => ({
      id: Number(cidade.id ?? 0),
      nome: String(cidade.nome ?? cidade.descricao ?? ""),
      estadoId: Number(cidade.estadoId ?? cidade.ufId ?? estadoId),
    }));
  }

  public async CriarPedidos(
    pedido: CreatePedidoDTO,
    estabelecimentoSlug: string,
  ): Promise<string> {
    const clientKey = localStorage.getItem("clientKey") || "";

    const pedidoMapeado: CreatePedidoRequestBody = {
      usuario: {
        nome: pedido.nomeCliente || "",
        telefone: pedido.telefoneCliente || "",
      },
      endereco: {
        rua: pedido.endereco.rua || "",
        numero: pedido.endereco.numero || "",
        bairro: pedido.endereco.bairro || "",
        cidadeId: pedido.endereco.cidadeId,
        ufId: pedido.endereco.ufId,
        // Compatibilidade durante transicao do backend.
        cidade: pedido.endereco.cidadeId,
        uf: pedido.endereco.ufId,
        cep: pedido.endereco.cep || "",
        complemento: pedido.endereco.complemento || "",
      },
      produtos: (pedido.produtoPedidos || []).map((p) => ({
        produtoId: p.produtoId,
        quantidade: p.quantidade,
      })),
      metodoPagamentoId: pedido.metodoPagamento,
      observacao: pedido.observacao || "",
    };

    const response = await api.post(buildApiPath("/pedido"), pedidoMapeado, {
      params: {
        slug: estabelecimentoSlug,
      },
      headers: {
        clientKey: clientKey,
      },
    });
    if (response.data.clientKey) {
      localStorage.setItem("clientKey", response.data.clientKey);
    }
    return "Pedido criado com sucesso";
  }

  public async getPedidos(slug: string): Promise<PedidoResponse[]> {
    const response = await api.get(buildApiPath("/pedido/cliente"), {
      headers: {
        accept: "*/*",
        clientKey: localStorage.getItem("clientKey") || "",
        slug,
      },
    });

    const produtosResponse: PedidoResponse[] = [];

    for (const pedido of response.data) {
      const statusNome =
        typeof pedido.status === "string"
          ? pedido.status
          : String(pedido.status?.nome ?? "");

      const produtos = Array.isArray(pedido.produtos) ? pedido.produtos : [];

      produtosResponse.push({
        id: pedido.id,
        nomeCliente: pedido.nomeCliente ?? pedido.nome,
        telefoneCliente: pedido.telefoneCliente ?? pedido.telefone,
        produtoPedidos: produtos.map((item: Record<string, unknown>) => ({
          produto: String(item.produto ?? item.nome ?? ""),
          preco: Number(item.preco ?? 0),
          quantidade: Number(item.quantidade ?? 0),
        })),
        endereco: this.mapEndereco(pedido.endereco),
        observacao: pedido.observacao,
        metodoPagamento: String(pedido.metodoPagamentoId ?? ""),
        status: statusNome,
      });
    }

    return produtosResponse;
  }
}
