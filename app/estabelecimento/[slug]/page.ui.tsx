"use client";

import banner from "@/public/banner.jpg";
import FinishOrder from "@/src/components/ui/finish-order/finish-order";
import ProductCard from "@/src/components/ui/product-card/product-card";
import { Search, Settings2 } from "lucide-react";
import Image from "next/image";
import { useHomeLogic } from "./page.logic";
import styles from "./page.module.css";

export default function HomeUI() {
  const {
    selected,
    setSelected,
    categories,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filteredProducts,
    produtosNoCarrinho,
    clearCart,
    isUiLocked,
    setIsUiLocked,
  } = useHomeLogic();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error) return <p>{error}</p>;

  return (
    <div className={`${styles.main} ${isUiLocked ? styles.blocked : ""}`}>
      <div className={styles.banner}>
        <Image src={banner} alt="banner" fill style={{ objectFit: "cover" }} />
      </div>

      <div className={styles.filters_line}>
        <div className={styles.filters_line_content}>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() =>
                selected === c.id ? setSelected(null) : setSelected(c.id)
              }
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
          />
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

      <FinishOrder onOverlayStateChange={(state) => setIsUiLocked(state)} />
    </div>
  );
}
