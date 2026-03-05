import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.main}>
      <div className={styles.card}>
        <h1 className={styles.code}>404</h1>
        <p className={styles.title}>Estabelecimento nao encontrado</p>
        <p className={styles.hint}>Tente abrir novamente usando um link valido.</p>
      </div>
    </div>
  );
}
