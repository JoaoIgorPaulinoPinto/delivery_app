"use client";
import { useEstabelecimento } from "@/src/store/Estabelecimento";
import { Hamburger, Settings } from "lucide-react";
import { useParams, useRouter } from "next/navigation"; // ✅ usar navigation no App Router
import styles from "./navbar.module.css";

export default function Navbar() {
  const router = useRouter();
  const estabelecimento = useEstabelecimento();
  const params = useParams();
  return (
    <div className={styles.navbar}>
      <div
        className={styles.left_side}
        onClick={() => router.replace(`/${params.slug}/`)}
      >
        {estabelecimento
          ? estabelecimento.estabelecimento?.nomeFantasia
          : "Inicio"}
      </div>
      <div className={styles.right_side}>
        <Hamburger onClick={() => router.replace(`/${params.slug}/pedidos`)} />
        <Settings color="white" />
      </div>
    </div>
  );
}
