import { Product } from "@/src/models/Product";
import { useCarrinho } from "@/src/store/Carrinho";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import styles from "./product-card.module.css";

export default function ProductCard(product: Product) {
  const [quant, setQuant] = useState(0);

  const { add, remove } = useCarrinho();

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
            onClick={() => {
              remove(product);
              setQuant(quant - 1);
            }}
            className={styles.add_btn}
          >
            <Minus size={12} />
          </button>
          <button
            onClick={() => {
              add(product);
              setQuant(quant + 1);
            }}
            className={styles.add_btn}
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
