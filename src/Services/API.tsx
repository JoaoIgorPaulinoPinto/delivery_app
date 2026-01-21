import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    withCredentials: "true",
  },
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
  categoria: string;
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
  categoriaId: number;
}
export interface HorarioFuncionamentoResponse {
  // preencha conforme o DTO real
  dia: string;
  abre: string;
  fecha: string;
}
export interface EstabelecimentoResponse {
  nome?: string;
  horarioFuncionamento?: HorarioFuncionamentoResponse[];
  taxaEntrega: number;
  pedidoMinimo: number;
  telefone?: string;
  whatsapp?: string;
  endereco: EnderecoResponse;
  status?: string;
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
  nomeCliente?: string;
  telefoneCliente?: string;
  metodoPagamento: string;
  produtoPedidos?: { produto: string; preco: number; quantidade: number }[];
  observacao?: string;
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
        estabelecimentoSlug: slug,
      },
    });
    const res: EstabelecimentoResponse = {
      nome: response.data.nome,
      horarioFuncionamento: response.data.horarioFuncionamento,
      taxaEntrega: response.data.taxaEntrega,
      pedidoMinimo: response.data.pedidoMinimo,
      telefone: response.data.telefone,
      whatsapp: response.data.whatsapp,
      endereco: {
        bairro: response.data.endereco.bairro,
        cep: response.data.endereco.cep,
        cidade: response.data.endereco.cidade,
        complemento: response.data.endereco.complemento,
        numero: response.data.endereco.numero,
        rua: response.data.endereco.rua,
        uf: response.data.endereco.uf,
      },
      status: response.data.status,
    };
    console.log(res);
    return res;
  }

  //pegar as categorias de produtos
  public async getCategorias(
    estabelecimentoSlug: string,
  ): Promise<CategoriaResponse[]> {
    const response = await api.get("/Categoria", {
      params: {
        estabelecimentoSlug,
      },
    });

    const categoriaResponse: CategoriaResponse[] = response.data.map(
      (categoria: CategoriaResponse) => ({
        id: categoria.id,
        categoria: categoria.categoria,
      }),
    );
    console.log(categoriaResponse);
    return categoriaResponse;
  }
  //pegar as metodos de pagamento
  public async getMetodosPagamento(
    estabelecimentoSlug: string,
  ): Promise<MetodoPagamentoResponse[]> {
    const response = await api.get("/MetodoPagamento", {
      params: {
        estabelecimentoSlug,
      },
    });

    const metodoPagamentoResponse: MetodoPagamentoResponse[] =
      response.data.map((metodoPagamento: MetodoPagamentoResponse) => ({
        id: metodoPagamento.id,
        nome: metodoPagamento.nome,
      }));
    console.log(metodoPagamentoResponse);
    return metodoPagamentoResponse;
  }

  //pegar produtos
  public async getProdutos(
    estabelecimentoSlug: string,
  ): Promise<ProdutosResponse[]> {
    const response = await api.get("/Produto", {
      params: {
        estabelecimentoSlug: estabelecimentoSlug,
      },
    });
    const produtosResponse: ProdutosResponse[] = [];
    for (const produto of response.data) {
      produtosResponse.push({
        id: produto.id,
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        imgUrl: produto.imgUrl,
        categoriaId: produto.categoriaId,
      });
    }
    console.log(produtosResponse);
    return produtosResponse;
  }

  //pegar as categorias de produtos
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
        // id: pedido.id,
        nomeCliente: pedido.nomeCliente,
        produtoPedidos: pedido.produtos,
        // endereco: pedido.endereco,
        observacao: pedido.observacao,
        metodoPagamento: pedido.metodoPagamentoId,
        // status: pedido.status,
        // usuario: pedido.usuario,
        // estabelecimento: pedido.estabelecimento,
      });
    }

    return produtosResponse;
  }
}
