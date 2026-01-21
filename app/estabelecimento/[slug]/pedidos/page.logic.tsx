"use client";

import { API, EnderecoResponse, PedidoResponse } from "@/src/Services/API";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function useOrdersPageLogic() {
  const params = useParams();
  const slug = params?.slug as string;

  const apiInstance = useMemo(() => new API(), []);

  const [loading, setLoading] = useState(true);
  const [pedidos, setPedidos] = useState<PedidoResponse[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      try {
        const data = await apiInstance.getPedidos();
        setPedidos(data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, apiInstance]);

  const formatarEndereco = (endereco?: EnderecoResponse) => {
    if (!endereco) return "Endereço não informado";
    const { rua, numero, bairro, cidade } = endereco;
    return `${rua}, ${numero} - ${bairro}, ${cidade}`;
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const calcularTotalPedido = (p: PedidoResponse) => {
    const produtos = p.produtoPedidos ?? [];

    const subtotal = produtos.reduce(
      (acc, item) => acc + (item.preco ?? 0) * item.quantidade,
      0,
    );

    // const taxaEntrega = p.estabelecimento?.taxaEntrega ?? 0;

    // return subtotal + taxaEntrega;

    /// Adicionar taxa de entrega ao get pedidos no backend

    return subtotal;
  };

  return {
    loading,
    pedidos,
    formatarEndereco,
    formatCurrency,
    calcularTotalPedido,
  };
}
