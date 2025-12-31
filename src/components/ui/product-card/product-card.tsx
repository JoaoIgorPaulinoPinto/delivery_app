/* eslint-disable @next/next/no-img-element */
import { ProdutoPedido } from "@/src/models/models";
import { useCarrinho } from "@/src/store/Carrinho";
import { Minus, Plus } from "lucide-react";
import styles from "./product-card.module.css";

export default function ProductCard(product: ProdutoPedido) {
  const { add, remove } = useCarrinho();

  return (
    <div className={styles.product_card}>
      <div className={styles.product_card_head}>
        <img
          src={product.imgUrl}
          alt={product.nome}
          className={styles.product_img}
        />

        <div className={styles.product_info}>
          <h3>{product.nome}</h3>
          <p>{product.descricao}</p>
          <p>{product.categoria.nome}</p>
          <span className={styles.price}>
            R$ {product.preco.toFixed(2).replace(".", ",")}
          </span>

          {(product.quantidade ?? 0) > 0 && (
            <label className={styles.quant_label}>{product.quantidade}x</label>
          )}
        </div>

        <div className={styles.product_card_footer}>
          <button onClick={() => remove(product)} className={styles.add_btn}>
            <Minus size={12} />
          </button>

          <button onClick={() => add(product)} className={styles.add_btn}>
            <Plus size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
