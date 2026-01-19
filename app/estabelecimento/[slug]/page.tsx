"use client";
// React / Next
import Image from "next/image";
import { use, useEffect, useMemo, useState } from "react";
// Assets
import banner from "@/public/banner.jpg";

// Components
import ProductCard from "@/src/components/ui/product-card/product-card";

// Models / Services
import { ProdutoPedido } from "@/src/models/models";
import { API } from "@/src/Services/API";

// Stores
import { useCarrinho } from "@/src/store/Carrinho";

// Styles
import FinishOrder from "@/src/components/ui/finish-order/finish-order";
import { Search, Settings2 } from "lucide-react";
import styles from "./page.module.css";
interface PageProps {
  params: Promise<{ slug: string }>;
}
export default function Home({ params }: PageProps) {
  const { slug } = use(params);
  const apiInstance = useMemo(() => new API(), []);
  const [selected, setSelected] = useState<number | null>(null);
  const [categories, setCategories] = useState<{ id: number; nome: string }[]>(
    [],
  );
  const [products, setProducts] = useState<ProdutoPedido[]>([]);
  const [loading, setLoading] = useState(true);

  const produtosNoCarrinho = useCarrinho((state) => state.produtos);
  const clearCart = useCarrinho((state) => state.clear);

  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
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

  const [isUiLocked, setIsUiLocked] = useState(false);
  const api = useMemo(() => new API(), []);

  // useEffect(() => {
  //   if (!slug) return;

  //   let active = true;

  //   api.setStablishment(slug).then((data) => {
  //     if (!active) return;

  //     if (data != null) {
  //       setEstabelecimento(data);
  //     } else {
  //       notFound();
  //     }
  //   });

  //   return () => {
  //     active = false;
  //   };
  // }, [slug, api, setEstabelecimento]);

  //   setProducts(productsData);
  //   setCategories(categoriesRes.data);
  // };
  const LoadProductsAndCategories = async () => {
    const [productsData, categoriesRes] = await Promise.all([
      apiInstance.getProdutos(slug),
      apiInstance.getCategorias(slug),
    ]);
  };

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        if (isMounted) {
          await LoadProductsAndCategories();
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
    <div className={`${styles.main} ${isUiLocked ? styles.blocked : ""}`}>
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
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Buscar produtos..."
            name=""
            id=""
          />
        </div>
        <Settings2 size={24} />
      </div>

      <div className={styles.products}>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
          }}
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
      <FinishOrder onOverlayStateChange={(state) => setIsUiLocked(state)} />
    </div>
  );
}
