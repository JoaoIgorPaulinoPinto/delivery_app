import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface CategoriaResponse {
  id: number;
  categoria: string;
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
}
export class API {
  public async getEstabelecimento(
    slug: string,
  ): Promise<EstabelecimentoResponse> {
    const response = await api.get("/Estabelecimento", {
      params: {
        slug: slug,
      },
    });
    const res: EstabelecimentoResponse = {
      nome: response.data.nome,
      horarioFuncionamento: response.data.horarioFuncionamento,
      taxaEntrega: response.data.taxaEntrega,
      pedidoMinimo: response.data.pedidoMinimo,
      telefone: response.data.telefone,
      whatsapp: response.data.whatsapp,
    };
    return res;
  }

  public async getCategorias(
    estabelecimentoSlug: string,
  ): Promise<CategoriaResponse[]> {
    const response = await api.get("/categorias", {
      params: {
        estabelecimentoSlug: estabelecimentoSlug,
      },
    });

    const categoriaResponse: CategoriaResponse[] = [];
    for (const categoria of response.data) {
      categoriaResponse.push({
        id: categoria.id,
        categoria: categoria.categoria,
      });
    }
    return categoriaResponse;
  }

  public async getProdutos(
    estabelecimentoSlug: string,
  ): Promise<ProdutosResponse[]> {
    const response = await api.get("/produtos", {
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
    return produtosResponse;
  }
}
