"use client";
import FinishOrder from "@/app/src/components/finish-order/finish-order";
import ProductCard from "@/app/src/components/product-card/product-card";
import { Product } from "@/app/src/models/Product";
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
      name: "BATATA FRITA GRANDE",
      description: "Porção grande de batata frita.",
      price: 18.0,
      imgUrl: foto_comida,
    },
    {
      name: "CACHORRO QUENTE",
      description: "Pão, salsicha, molho e batata palha.",
      price: 14.0,
      imgUrl: foto_comida,
    },
    {
      name: "MILKSHAKE CHOCOLATE",
      description: "Milkshake com sorvete e calda.",
      price: 25.9,
      imgUrl: foto_comida,
    },
    {
      name: "X-UCO NATURAL",
      description: "Sabores: laranja, limão e queijo.",
      price: 9.0,
      imgUrl: foto_comida,
    },
    {
      name: "BATATA FRITA GRANDE",
      description: "Porção grande de batata frita.",
      price: 18.0,
      imgUrl: foto_comida,
    },
    {
      name: "CACHORRO QUENTE",
      description: "Pão, salsicha, molho e batata palha.",
      price: 14.0,
      imgUrl: foto_comida,
    },
    {
      name: "MILKSHAKE CHOCOLATE",
      description: "Milkshake com sorvete e calda.",
      price: 25.9,
      imgUrl: foto_comida,
    },
    {
      name: "X-UCO NATURAL",
      description: "Sabores: laranja, limão e queijo.",
      price: 9.0,
      imgUrl: foto_comida,
    },
    {
      name: "BATATA FRITA GRANDE",
      description: "Porção grande de batata frita.",
      price: 18.0,
      imgUrl: foto_comida,
    },
    {
      name: "CACHORRO QUENTE",
      description: "Pão, salsicha, molho e batata palha.",
      price: 14.0,
      imgUrl: foto_comida,
    },
    {
      name: "MILKSHAKE CHOCOLATE",
      description: "Milkshake com sorvete e calda.",
      price: 25.9,
      imgUrl: foto_comida,
    },
    {
      name: "X-UCO NATURAL",
      description: "Sabores: laranja, limão e queijo.",
      price: 9.0,
      imgUrl: foto_comida,
    },
  ];

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
        {products.map((product, i) => (
          <ProductCard key={i} {...product} />
        ))}
      </div>

      {/* RODAPÉ */}
      <div className={styles.footer}>
        <FinishOrder />
      </div>
    </div>
  );
}
