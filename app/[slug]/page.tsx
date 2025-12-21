"use client";
import banner from "@/public/banner.jpg";
import FinishOrder from "@/src/components/ui/finish-order/finish-order";
import ProductCard from "@/src/components/ui/product-card/product-card";
import { ProdutoPedido } from "@/src/models/models";
import { API } from "@/src/Services/API";
import { useCarrinho } from "@/src/store/Carrinho";
import {
  Estabelecimento,
  useEstabelecimento,
} from "@/src/store/Estabelecimento";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const estabelecimento = useEstabelecimento();

  const params = useParams();
  const slug = params.slug as string;
  const apiInstance = new API();

  const [selected, setSelected] = useState(0);
  const [categories, setCategories] =
    useState<{ id: string; nome: string }[]>();
  const [products, setProducts] = useState<ProdutoPedido[]>();
  const [loading, setLoading] = useState(true);

  const produtosNoCarrinho = useCarrinho((state) => state.produtos);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      try {
        setLoading(true);

        // 1. Obtém os dados do estabelecimento
        // Note: tipamos como 'any' ou seu tipo 'Estabelecimento' para acessar o .id
        const establishmentData: Estabelecimento =
          await apiInstance.setStablishment(slug);

        // Atualiza o store para o restante do app
        estabelecimento.setEstabelecimento(establishmentData);

        // 2. BUSCA PRODUTOS USANDO A VARIÁVEL LOCAL 'establishmentData'
        // Não use 'estabelecimento.estabelecimento.id' aqui, pois o Zustand é assíncrono!
        if (establishmentData && establishmentData.id) {
          const [productsData, categoriesRes] = await Promise.all([
            apiInstance.getProducts(),
            apiInstance.GetCategories(),
          ]);

          setProducts(productsData);
          setCategories(categoriesRes.data);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]); // Mantenha apenas o slug como dependência
  if (loading) return <div className={styles.main}>Carregando...</div>;

  return (
    <div className={styles.main}>
      <div className={styles.banner}>
        <Image src={banner} alt="banner" fill style={{ objectFit: "cover" }} />
      </div>

      <div className={styles.filters_line}>
        <div className={styles.filters_line_content}>
          {categories?.map((c, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={
                selected === i
                  ? `${styles.filters_line_option} ${styles.filters_line_option_selected}`
                  : styles.filters_line_option
              }
            >
              {c.nome}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.products}>
        <div
          style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
        >
          {produtosNoCarrinho.length > 0 && (
            <button
              className={styles.clear_cart_button}
              onClick={() => useCarrinho.getState().clear()}
            >
              Limpar
            </button>
          )}
        </div>

        {products?.map((product, i) => {
          const p = produtosNoCarrinho.find((item) => item.id === product.id);
          return <ProductCard key={i} {...(p ?? product)} />;
        })}
      </div>

      <div className={styles.footer}></div>
      <FinishOrder />
    </div>
  );
}
