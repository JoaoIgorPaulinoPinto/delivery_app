"use client";
// React / Next
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

// Assets
import banner from "@/public/banner.jpg";

// Components
import ProductCard from "@/src/components/ui/product-card/product-card";

// Models / Services
import { ProdutoPedido } from "@/src/models/models";
import { API } from "@/src/Services/API";

// Stores
import { useCarrinho } from "@/src/store/Carrinho";
import { useEstabelecimento } from "@/src/store/Estabelecimento";

// Styles
import FinishOrder from "@/src/components/ui/finish-order/finish-order";
import { Search, Settings2 } from "lucide-react";
import styles from "./page.module.css";

export default function Home() {
  const estabelecimento = useEstabelecimento();
  const params = useParams();
  const slug = params.slug as string;
  const apiInstance = useMemo(() => new API(), []);
  const [selected, setSelected] = useState<number | null>(null);
  const [categories, setCategories] = useState<{ id: number; nome: string }[]>(
    []
  );
  const [products, setProducts] = useState<ProdutoPedido[]>([]);
  const [loading, setLoading] = useState(true);

  const produtosNoCarrinho = useCarrinho((state) => state.produtos);
  const clearCart = useCarrinho((state) => state.clear);

  const selectedCategoryId = selected;
  const [error, setError] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    if (!selectedCategoryId) return products;
    return products.filter((p) => p.id === selectedCategoryId);
  }, [products, selectedCategoryId]);

  const loadEstablishment = async (slug: string) => {
    const data = await apiInstance.setStablishment(slug);
    estabelecimento.setEstabelecimento(data);
    return data;
  };

  const loadProductsAndCategories = async () => {
    const [productsData, categoriesRes] = await Promise.all([
      apiInstance.getProducts(),
      apiInstance.GetCategories(),
    ]);

    setProducts(productsData);
    setCategories(categoriesRes.data);
  };

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const est = await loadEstablishment(slug);
        if (est?.id && isMounted) {
          await loadProductsAndCategories();
        }
      } catch (err) {
        setError("Erro ao carregar cardápio");
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }
  if (error) {
    return <p>{error}</p>;
  }
  return (
    <div className={styles.main}>
      <div className={styles.banner}>
        <Image src={banner} alt="banner" fill style={{ objectFit: "cover" }} />
      </div>
      <div className={styles.filters_line}>
        <div className={styles.filters_line_content}>
          {categories?.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                selected == c.id ? setSelected(null) : setSelected(c.id);
              }}
              className={
                selected === c.id
                  ? `${styles.filters_line_option} ${styles.filters_line_option_selected}`
                  : styles.filters_line_option
              }
            >
              {c.nome}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.search_settings}>
        <div className={styles.search_bar}>
          <Search size={16} />
          <input type="text" placeholder="Buscar produtos..." name="" id="" />
        </div>
        <Settings2 size={24} />
      </div>

      <div className={styles.products}>
        <div
          style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
        >
          {produtosNoCarrinho.length > 0 && (
            <button className={styles.clear_cart_button} onClick={clearCart}>
              Limpar
            </button>
          )}
        </div>

        {filteredProducts.map((product) => {
          const p = produtosNoCarrinho.find((i) => i.id === product.id);
          return <ProductCard key={product.id} {...(p ?? product)} />;
        })}
      </div>
      <div className={styles.footer}></div>
      <FinishOrder />
    </div>
  );
}
