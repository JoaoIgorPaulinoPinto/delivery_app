"use client";

import { API } from "@/src/Services/API";
import { ProdutoPedido } from "@/src/models/models";
import { useCarrinho } from "@/src/store/Carrinho";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function useHomeLogic() {
  const { slug } = useParams<{ slug: string }>();
  const apiInstance = useMemo(() => new API(), []);

  const [selected, setSelected] = useState<number | null>(null);
  const [categories, setCategories] = useState<{ id: number; nome: string }[]>(
    [],
  );
  const [products, setProducts] = useState<ProdutoPedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUiLocked, setIsUiLocked] = useState(false);

  const produtosNoCarrinho = useCarrinho((state) => state.produtos);
  const clearCart = useCarrinho((state) => state.clear);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selected
        ? product.categoria.id === selected
        : true;

      const matchesSearch = product.nome
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase().trim());

      return matchesCategory && matchesSearch;
    });
  }, [products, selected, searchTerm]);

  const loadProductsAndCategories = async () => {
    const [productsData, categoriesRes] = await Promise.all([
      apiInstance.getProdutos(slug),
      apiInstance.getCategorias(slug),
    ]);

    setProducts(
      productsData.map((p) => ({
        id: p.id,
        nome: p.nome,
        descricao: p.descricao,
        preco: p.preco,
        imgUrl: p.imgUrl,
        categoria: {
          id: p.categoriaId,
          nome: categoriesRes.find((c) => c.id === p.categoriaId)?.categoria,
        },
        quantidade: 0,
      })),
    );

    setCategories(
      categoriesRes.map((c) => ({
        id: c.id,
        nome: c.categoria,
      })),
    );
  };

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        if (isMounted) await loadProductsAndCategories();
      } catch {
        setError("Erro ao carregar cardápio");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  return {
    selected,
    setSelected,
    categories,
    products,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filteredProducts,
    produtosNoCarrinho,
    clearCart,
    isUiLocked,
    setIsUiLocked,
  };
}
