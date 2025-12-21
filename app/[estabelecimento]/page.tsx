"use client";
import banner from "@/public/banner.jpg";
import FinishOrder from "@/src/components/ui/finish-order/finish-order";
import ProductCard from "@/src/components/ui/product-card/product-card";
import Produto from "@/src/models/Produto";
import { API } from "@/src/Services/API";
import { useCarrinho } from "@/src/store/Carrinho";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

import { useParams } from "next/navigation";
export default function Home() {
  const params = useParams();
  const slug = params.estabelecimento as string;
  // Você definiu a função 'f', mas nunca a chamou!
  useEffect(() => {
    const f = async () => {
      const res = await fetch(
        `http://192.168.1.18:5096/Estabelecimento/slug?=${slug}`
      );
      return res;
    };
    // f(); <--- Faltou chamar a função aqui para ela rodar
    console.log(f);
  }, [slug]); // Adicione 'slug' como dependência

  const [selected, setSelected] = useState(0);
  const api = new API();
  const [categories, setCategories] =
    useState<{ id: string; nome: string }[]>();

  const [products, setProducts] = useState<Produto[]>();
  const produtos = useCarrinho((state) => state.produtos);

  useEffect(() => {
    const fetchData = async () => {
      try {
        api.setStablishment("pizzaria-do-joao");

        const [productsData, categoriesRes] = await Promise.all([
          api.getProducts(),
          api.GetCategories(),
        ]);

        setProducts(productsData);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Erro ao carregar dados da API:", error);
      }
    };

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.main}>
      {/* BANNER */}
      <div className={styles.banner}>
        <Image src={banner} alt="banner" fill style={{ objectFit: "cover" }} />
      </div>

      {/* CATEGORIAS */}
      <div className={styles.filters_line}>
        <div className={styles.filters_line_content}>
          {categories != null
            ? categories.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(i)}
                  className={
                    selected === i
                      ? `${styles.filters_line_option} ${styles.filters_line_option_selected}`
                      : styles.filters_line_option
                  }
                >
                  {c.nome}
                </button>
              ))
            : ""}
        </div>
      </div>

      {/* PRODUTOS */}

      <div className={styles.products}>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {/* <div className={styles.search_bar}>
            <input type="text" placeholder="X-Burguer..." />
          </div> */}
          {produtos.length > 0 && (
            <button
              className={styles.clear_cart_button}
              onClick={() => useCarrinho.getState().clear()}
            >
              Limpar
            </button>
          )}
        </div>

        {products != undefined
          ? products.map((product) => {
              const p = produtos.find((item) => item.id === product.id);
              return (
                <ProductCard
                  key={product.id + "-" + (p?.quantidade ?? 0)}
                  {...(p ?? product)}
                />
              );
            })
          : ""}
      </div>

      {/* RODAPÉ */}
      <div className={styles.footer}></div>
      <FinishOrder />
    </div>
  );
}
