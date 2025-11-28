"use client";
import { useCarrinho } from "@/src/store/Carrinho";
import {
  CreditCard,
  DollarSign,
  MapPin,
  ShoppingCart,
  Truck,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";
import AddressModal, { AddressData } from "../modal/adress-modal";
import ConfirmationModal from "../modal/confirmation-modal";
import PopUpModal from "../modal/pop-up-modal";
import styles from "./finish-order.module.css";

export default function FinishOrder() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false); // NOVO ESTADO
  const [deliveryType, setDeliveryType] = useState("retirada"); // local | entrega
  const [paymentType, setPaymentType] = useState("pix"); // pix | dinheiro | cartao
  const [troco, setTroco] = useState("");

  // Usando um valor fixo para o total na demonstração
  const fixedTotal = "R$ 245,70";

  const handleFinishOrderForm = () => setIsOpen(!isOpen);

  const toggleDeliveryType = () => {
    setDeliveryType((prev) => (prev === "retirada" ? "entrega" : "retirada"));
  };

  // Lógica para abrir o modal de confirmação
  const handleFinalize = () => {
    setIsConfirmationModalOpen(true);
  };
  const clear = useCarrinho((state) => state.clear);
  const produtos = useCarrinho((state) => state.produtos);
  // Lógica para confirmar o pedido (chamada dentro do modal)
  const handleConfirmOrder = (name: string, phone: string) => {
    console.log("Pedido Finalizado!");
    console.log("Nome:", name);
    console.log("Telefone:", phone);
    console.log("Total:", fixedTotal);
    console.log("Pedido:", produtos);

    clear();
    // Fechar os dois painéis
    setIsConfirmationModalOpen(false);
    setIsOpen(false);

    // Aqui você adicionaria a lógica real de envio para a API/WhatsApp
    alert(`Pedido de ${fixedTotal} confirmado para ${name}!`);
  };
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [address, setAddress] = useState<AddressData | undefined>(undefined);
  return (
    <div className={isOpen ? styles.confirmationOverlay : ""}>
      <div className={styles.footer}>
        {/* Topo fixo */}
        <div className={styles.footer_head}>
          <span className={styles.footer_total}>{fixedTotal}</span>
          <button
            className={styles.footer_cart}
            onClick={handleFinishOrderForm}
          >
            {!isOpen ? (
              <>
                <ShoppingCart />
              </>
            ) : (
              <X />
            )}
          </button>
        </div>

        {/* Formulário com slide */}
        <div className={`${styles.form} ${isOpen ? styles.open : ""}`}>
          <div className={styles.delivery_preferences}>
            {/* Opções de Entrega */}
            <div className={styles.section}>
              <h3>Opções de Entrega</h3>
              {/* ... conteúdo de entrega ... */}
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
                  <div
                    style={{ display: "flex", flexDirection: "row", gap: 10 }}
                  >
                    <span className={styles.frete}>R$ 7,54</span>
                    <button
                      onClick={() => setIsAddressModalOpen(true)}
                      className={styles.changeAddress}
                    >
                      Alterar
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <AddressModal
              isOpen={isAddressModalOpen}
              onClose={() => setIsAddressModalOpen(false)}
              initialAddress={address}
              onSave={(data) => {
                setAddress(data);
                setIsAddressModalOpen(false);
              }}
            />
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
                    type="number"
                    value={troco}
                    onChange={(e) => setTroco(e.target.value)}
                    placeholder="Ex: 100,00"
                  />
                </div>
              )}
            </div>

            <div className={styles.products_table}>
              <div className={styles.products_header}>
                <span>Produto</span>
                <span>Qtd</span>
                <span>Preço</span>
                <span>Total</span>
              </div>
              {produtos.map((p) => {
                return (
                  <div key={p.id} className={styles.product_row}>
                    <div className={styles.product_row_grid}>
                      <span className={styles.p_name}>{p.name}</span>
                      <span className={styles.p_quant}>{p.quantity}</span>
                      <span className={styles.p_price}>{p.price}</span>
                      <span className={styles.p_total}>
                        {p.quantity || 0 * p.price}
                      </span>
                    </div>
                    <input
                      className={styles.product_row_input}
                      type="text"
                      placeholder="oberservação..."
                      onChange={(e) => (p.obs = e.target.value)}
                    />
                  </div>
                );
              })}
            </div>
            <div className={styles.section}>
              <span className={styles.total}>{fixedTotal}</span>
              <button onClick={handleFinalize} className={styles.finishButton}>
                Finalizar Pedido
              </button>
            </div>
          </div>
        </div>

        {/* NOVO MODAL DE CONFIRMAÇÃO */}
        <PopUpModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
        >
          <ConfirmationModal
            total={fixedTotal}
            isOpen={true}
            onClose={() => setIsConfirmationModalOpen(false)}
            onConfirm={handleConfirmOrder}
          />
        </PopUpModal>
      </div>
    </div>
  );
}
