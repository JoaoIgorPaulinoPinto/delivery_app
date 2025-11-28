"use client";
import FinishOrder from "@/src/components/ui/finish-order/finish-order";
import ProductCard from "@/src/components/ui/product-card/product-card";
import { Product } from "@/src/models/Product";
import { useCarrinho } from "@/src/store/Carrinho";
import Image from "next/image";
import { useState } from "react";
import banner from "../../../public/banner.jpg";
import foto_comida from "../../../public/x-burguer.jpg";
import styles from "./page.module.css";

export default function Home() {
  const [selected, setSelected] = useState(0);

  const categories = [
    "Pizza",
    "Picole",
    "Sobremesa",
    "Cerveja",
    "Refeição",
    "Lanche",
    "Bebida",
  ];

  const products: Product[] = [
    {
      id: 1,
      name: "BATATA FRITA GRANDE",
      description: "Porção grande de batata frita.",
      price: 18.0,
      imgUrl: foto_comida,
    },
    {
      id: 2,
      name: "CACHORRO QUENTE",
      description: "Pão, salsicha, molho e batata palha.",
      price: 14.0,
      imgUrl: foto_comida,
    },
    {
      id: 3,
      name: "MILKSHAKE CHOCOLATE",
      description: "Milkshake com sorvete e calda.",
      price: 25.9,
      imgUrl: foto_comida,
    },
    {
      id: 4,
      name: "X-SUCO NATURAL",
      description: "Sabores: laranja, limão e queijo.",
      price: 9.0,
      imgUrl: foto_comida,
    },
    {
      id: 5,
      name: "BATATA FRITA GRANDE",
      description: "Porção grande de batata frita.",
      price: 18.0,
      imgUrl: foto_comida,
    },
    {
      id: 6,
      name: "CACHORRO QUENTE",
      description: "Pão, salsicha, molho e batata palha.",
      price: 14.0,
      imgUrl: foto_comida,
    },
    {
      id: 7,
      name: "MILKSHAKE CHOCOLATE",
      description: "Milkshake com sorvete e calda.",
      price: 25.9,
      imgUrl: foto_comida,
    },
    {
      id: 8,
      name: "X-SUCO NATURAL",
      description: "Sabores: laranja, limão e queijo.",
      price: 9.0,
      imgUrl: foto_comida,
    },
    {
      id: 9,
      name: "BATATA FRITA GRANDE",
      description: "Porção grande de batata frita.",
      price: 18.0,
      imgUrl: foto_comida,
    },
    {
      id: 10,
      name: "CACHORRO QUENTE",
      description: "Pão, salsicha, molho e batata palha.",
      price: 14.0,
      imgUrl: foto_comida,
    },
    {
      id: 11,
      name: "MILKSHAKE CHOCOLATE",
      description: "Milkshake com sorvete e calda.",
      price: 25.9,
      imgUrl: foto_comida,
    },
    {
      id: 12,
      name: "X-UCO NATURAL",
      description: "Sabores: laranja, limão e queijo.",
      price: 9.0,
      imgUrl: foto_comida,
    },
  ];

  const produtos = useCarrinho((state) => state.produtos);

  return (
    <div className={styles.main}>
      {/* BANNER */}
      <div className={styles.banner}>
        <Image src={banner} alt="banner" fill style={{ objectFit: "cover" }} />
      </div>

      {/* CATEGORIAS */}
      <div className={styles.filters_line}>
        <div className={styles.filters_line_content}>
          {categories.map((c, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={
                selected === i
                  ? `${styles.filters_line_option} ${styles.filters_line_option_selected}`
                  : styles.filters_line_option
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUTOS */}

      <div className={styles.products}>
        {products.map((product) => {
          const p = produtos.find((item) => item.id === product.id);
          return (
            <ProductCard
              key={product.id + "-" + (p?.quantity ?? 0)}
              {...(p ?? product)}
            />
          );
        })}
      </div>

      {/* RODAPÉ */}
      <div className={styles.footer}></div>
      <FinishOrder />
    </div>
  );
}
