"use client";
import {
  CreditCard,
  DollarSign,
  MapPin,
  ShoppingBasket,
  Truck,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";
import styles from "./finish-order.module.css";

export default function FinishOrder() {
  const [isOpen, setIsOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState("retirada"); // local | entrega
  const [paymentType, setPaymentType] = useState("pix"); // pix | dinheiro | cartao
  const [troco, setTroco] = useState("");

  const handleFinishOrderForm = () => setIsOpen(!isOpen);

  const toggleDeliveryType = () => {
    setDeliveryType((prev) => (prev === "retirada" ? "entrega" : "retirada"));
  };
  return (
    <div className={styles.footer}>
      {/* Topo fixo */}
      <div className={styles.footer_head}>
        <span className={styles.footer_total}>R$15,00</span>
        <button className={styles.footer_cart} onClick={handleFinishOrderForm}>
          {!isOpen ? <ShoppingBasket /> : <X />}
        </button>
      </div>

      {/* Formulário com slide */}
      <div className={`${styles.form} ${isOpen ? styles.open : ""}`}>
        <div className={styles.delivery_preferences}>
          <div className={styles.section}>
            <h3>Opções de Entrega</h3>

            <div className={styles.deliveryRow}>
              <div
                className={styles.delivery_row_toggle_container}
                onClick={toggleDeliveryType}
              >
                <div
                  className={`${styles.delivery_row_toggle_left} ${
                    deliveryType === "entrega"
                      ? styles.delivery_row_toggle_selected
                      : ""
                  }`}
                >
                  Entrega
                  <Truck />
                </div>

                <div
                  className={`${styles.delivery_row_toggle_right} ${
                    deliveryType === "retirada"
                      ? styles.delivery_row_toggle_selected
                      : ""
                  }`}
                >
                  Retirada
                  <MapPin />
                </div>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className={styles.section}>
            <h3>Endereço de Entrega</h3>

            <div className={styles.addressBox}>
              <div>
                <strong>Meu Endereço</strong>
                <p>Av Exemplo, 230 - Cidade, SP</p>
              </div>
              {deliveryType != "retirada" ? (
                <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                  <span className={styles.frete}>R$ 7,54</span>
                  <button className={styles.changeAddress}>Alterar</button>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          {/* Pagamento */}
          <div className={styles.section}>
            <h3>Forma de Pagamento</h3>

            <div className={styles.paymentRow}>
              <button
                className={`${styles.paymentButton} ${
                  paymentType === "pix" ? styles.active : ""
                }`}
                onClick={() => setPaymentType("pix")}
              >
                <Wallet /> Pix
              </button>

              <button
                className={`${styles.paymentButton} ${
                  paymentType === "dinheiro" ? styles.active : ""
                }`}
                onClick={() => setPaymentType("dinheiro")}
              >
                <DollarSign /> Dinheiro
              </button>

              <button
                className={`${styles.paymentButton} ${
                  paymentType === "cartao" ? styles.active : ""
                }`}
                onClick={() => setPaymentType("cartao")}
              >
                <CreditCard /> Cartão
              </button>
            </div>

            {paymentType === "dinheiro" && (
              <div className={styles.trocoBox}>
                <label>Troco para R$</label>
                <input
                  type="text"
                  value={troco}
                  onChange={(e) => setTroco(e.target.value)}
                  placeholder="Ex: 100,00"
                />
              </div>
            )}
          </div>
          <div className={styles.products_table}>
            {/* Cabeçalho */}
            <div className={styles.products_header}>
              <span>Produto</span>
              <span>Qtd</span>
              <span>Preço</span>
              <span>Total</span>
            </div>

            {/* Itens (exemplo) */}
            <div className={styles.product_row}>
              <span className={styles.p_name}>X-Burguer</span>
              <span className={styles.p_quant}>2x</span>
              <span className={styles.p_price}>R$ 12,00</span>
              <span className={styles.p_total}>R$ 24,00</span>
            </div>

            <div className={styles.product_row}>
              <span className={styles.p_name}>Batata Média</span>
              <span className={styles.p_quant}>1x</span>
              <span className={styles.p_price}>R$ 10,00</span>
              <span className={styles.p_total}>R$ 10,00</span>
            </div>

            <div className={styles.product_row}>
              <span className={styles.p_name}>Coca-Cola Lata</span>
              <span className={styles.p_quant}>3x</span>
              <span className={styles.p_price}>R$ 7,00</span>
              <span className={styles.p_total}>R$ 21,00</span>
            </div>

            <div className={styles.product_row}>
              <span className={styles.p_name}>Onion Rings</span>
              <span className={styles.p_quant}>1x</span>
              <span className={styles.p_price}>R$ 14,00</span>
              <span className={styles.p_total}>R$ 14,00</span>
            </div>
            <div className={styles.product_row}>
              <span className={styles.p_name}>Batata Média</span>
              <span className={styles.p_quant}>1x</span>
              <span className={styles.p_price}>R$ 10,00</span>
              <span className={styles.p_total}>R$ 10,00</span>
            </div>

            <div className={styles.product_row}>
              <span className={styles.p_name}>Coca-Cola Lata</span>
              <span className={styles.p_quant}>3x</span>
              <span className={styles.p_price}>R$ 7,00</span>
              <span className={styles.p_total}>R$ 21,00</span>
            </div>
            <div className={styles.product_row}>
              <span className={styles.p_name}>Batata Média</span>
              <span className={styles.p_quant}>1x</span>
              <span className={styles.p_price}>R$ 10,00</span>
              <span className={styles.p_total}>R$ 10,00</span>
            </div>

            <div className={styles.product_row}>
              <span className={styles.p_name}>Coca-Cola Lata</span>
              <span className={styles.p_quant}>3x</span>
              <span className={styles.p_price}>R$ 7,00</span>
              <span className={styles.p_total}>R$ 21,00</span>
            </div>
          </div>
        </div>
        <div className={styles.section}>
          <span className={styles.total}>R$ 245,70</span>
          <button className={styles.finishButton}>Finalizar Pedido</button>
        </div>
      </div>
    </div>
  );
}
