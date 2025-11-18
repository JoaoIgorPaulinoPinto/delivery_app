import { Settings } from "lucide-react";
import styles from "./navbar.module.css";
export default function navbar() {
  return (
    <div className={styles.navbar}>
      <div className={styles.left_side}>MATA FOME</div>
      <div className={styles.right_side}>
        <Settings color="white" />
      </div>
    </div>
  );
}
