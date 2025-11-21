import { ReactNode } from "react";
import styles from "./pop-up-modal.module.css";

interface PopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function PopUpModal({
  isOpen,
  onClose,
  children,
}: PopUpModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.main} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
