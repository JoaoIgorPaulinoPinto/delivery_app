"use client";

import { useEstabelecimento } from "@/src/store/Estabelecimento";
import { Hamburger, Settings } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import styles from "./navbar.module.css";

export default function Navbar() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const nomeFantasia = useEstabelecimento(
    (state) => state.estabelecimento?.nomeFantasia
  );

  const handleGoHome = () => {
    if (!slug) return;
    router.push(`/${slug}`);
  };

  const handleGoToOrders = () => {
    if (!slug) return;
    router.push(`/${slug}/pedidos`);
  };

  const handleGoToSettings = () => {
    if (!slug) return;
    router.push(`/${slug}/configuracoes`);
  };

  return (
    <nav className={styles.navbar}>
      <button
        className={styles.left_side}
        onClick={handleGoHome}
        aria-label="Página inicial"
      >
        {nomeFantasia ?? "Início"}
      </button>

      <div className={styles.right_side}>
        <button
          aria-label="Pedidos"
          onClick={handleGoToOrders}
          className={styles.iconButton}
        >
          <Hamburger />
        </button>

        <button
          aria-label="Configurações"
          onClick={handleGoToSettings}
          className={styles.iconButton}
        >
          <Settings />
        </button>
      </div>
    </nav>
  );
}
