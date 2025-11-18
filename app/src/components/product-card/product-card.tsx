import { Product } from "@/app/src/models/Product";
import Image from "next/image";
import { useState } from "react";
import styles from "./product-card.module.css";

export default function ProductCard(product: Product) {
  const [quant, setQuant] = useState(0);

  return (
    <div className={styles.product_card}>
      <div className={styles.product_card_head}>
        <Image
          src={product.imgUrl}
          alt={product.name}
          width={70}
          height={70}
          className={styles.product_img}
        />
        <div className={styles.product_info}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <span className={styles.price}>R$ {product.price.toFixed(2)}</span>
          {quant > 0 && <label className={styles.quant_label}>{quant}x</label>}
        </div>
        <div className={styles.product_card_footer}>
          <button
            onClick={() => quant > 0 && setQuant(quant - 1)}
            className={styles.add_btn}
          >
            -
          </button>
          <button
            onClick={() => setQuant(quant + 1)}
            className={styles.add_btn}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
