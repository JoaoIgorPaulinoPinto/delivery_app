"use client";
import { Hamburger, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./navbar.module.css";
export default function Navbar() {
  const router = useRouter();
  return (
    <div className={styles.navbar}>
      <div className={styles.left_side} onClick={() => router.push("/inicio")}>
        MATA FOME
      </div>
      <div className={styles.right_side}>
        <Hamburger onClick={() => router.push("/pedidos")} />
        <Settings color="white" />
      </div>
    </div>
  );
}
