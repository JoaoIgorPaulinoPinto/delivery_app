"use client";

import { MapPin, ShoppingCart, Truck } from "lucide-react";
import AddressModal from "../modal/adress-modal";
import ConfirmationModal from "../modal/confirmation-modal";
import PopUpModal from "../modal/pop-up-modal";
import { formatMoney, useFinishOrderLogic } from "./finish-order.logic";
import styles from "./finish-order.module.css";

export default function FinishOrderUI({
  onOverlayStateChange,
}: {
  onOverlayStateChange?: (v: boolean) => void;
}) {
  const d = useFinishOrderLogic(onOverlayStateChange);

  return (
    <div className={d.isOpen ? styles.confirmationOverlay : styles.footer}>
      <div className={styles.footer_container}>
        <div className={styles.footer_head}>
          <div className={styles.footer_head}>
            <span className={styles.footer_total}>
              {formatMoney(d.totalGeral)}
            </span>
            {d.deliveryType === "entrega" && (
              <span className={styles.deliveryTax}>
                + {formatMoney(d.taxaEntrega)} entrega
              </span>
            )}
          </div>
          <button
            className={styles.footer_cart}
            onClick={() => d.setIsOpen((p) => !p)}
          >
            {d.isOpen ? (
              "Voltar"
            ) : (
              <>
                Finalizar <ShoppingCart size={15} />
              </>
            )}
          </button>
        </div>

        <div className={`${styles.form} ${d.isOpen ? styles.open : ""}`}>
          {/* Entrega */}
          <div className={styles.section}>
            <h3>Opções de Entrega</h3>
            <div
              className={styles.delivery_row_toggle_container}
              onClick={d.toggleDeliveryType}
            >
              <div
                className={`${styles.delivery_row_toggle_left} ${d.deliveryType === "entrega" ? styles.delivery_row_toggle_selected : ""}`}
              >
                Entrega <Truck size={16} />
              </div>
              <div
                className={`${styles.delivery_row_toggle_right} ${d.deliveryType === "retirada" ? styles.delivery_row_toggle_selected : ""}`}
              >
                Retirada <MapPin size={16} />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className={styles.section}>
            <h3>Endereço</h3>
            <div className={styles.addressBox}>
              {d.deliveryType === "entrega" ? (
                <>
                  <label>
                    {d.usuario.endereco?.rua ? (
                      <p>
                        {d.usuario.endereco.rua},{d.usuario.endereco.numero} -{" "}
                        {d.usuario.endereco.cidade}/{d.usuario.endereco.uf}
                      </p>
                    ) : (
                      "Nenhum endereço cadastrado"
                    )}
                  </label>
                  <button
                    className={styles.changeAddress}
                    onClick={() => d.setIsAddressModalOpen(true)}
                  >
                    {d.usuario.endereco ? "Alterar" : "Cadastrar"}
                  </button>
                </>
              ) : d.estabelecimento ? (
                <p>
                  {d.estabelecimento.endereco.rua},
                  {d.estabelecimento.endereco.numero} -{" "}
                  {d.estabelecimento.endereco.cidade}/
                  {d.estabelecimento.endereco.uf}
                </p>
              ) : (
                <p>Carregando endereço...</p>
              )}
            </div>
          </div>

          {/* Pagamento */}
          <div className={styles.section}>
            <h3>Forma de Pagamento</h3>
            <div className={styles.paymentRow}>
              {d.paymentMethods.map((m) => (
                <button
                  key={m.id}
                  className={`${styles.paymentButton} ${
                    d.selectedPaymentMethodId === m.id ? styles.active : ""
                  }`}
                  onClick={() => d.setSelectedPaymentMethodId(m.id)}
                >
                  {m.nome}
                </button>
              ))}
            </div>
          </div>

          {/* Itens */}
          <div className={styles.section}>
            <h3>Itens do Pedido</h3>
            <table className={styles.table}>
              <tbody>
                {d.produtos.map((i) => (
                  <tr key={i.id}>
                    <td>{i.nome}</td>
                    <td>{i.quantidade}</td>
                    <td>{formatMoney(i.preco)}</td>
                    <td>{formatMoney(i.preco * (i.quantidade || 1))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Resumo */}
          <div className={styles.section}>
            <h3>Resumo</h3>
            <div className={styles.resumeRow}>
              <span>Subtotal</span>
              <strong>{formatMoney(d.subtotal)}</strong>
            </div>
            {d.deliveryType === "entrega" && (
              <div className={styles.resumeRow}>
                <span>Frete</span>
                <strong>{formatMoney(d.taxaEntrega)}</strong>
              </div>
            )}
            <div className={styles.resumeTotal}>
              <span>Total</span>
              <strong>{formatMoney(d.totalGeral)}</strong>
            </div>
          </div>

          <button
            className={styles.finishButton}
            onClick={() => d.setIsConfirmationModalOpen(true)}
          >
            Confirmar Pedido
          </button>
        </div>

        {/* Modais */}
        <PopUpModal
          isOpen={d.isConfirmationModalOpen}
          onClose={() => d.setIsConfirmationModalOpen(false)}
        >
          <ConfirmationModal
            total={formatMoney(d.totalGeral)}
            endereco={d.deliveryType === "entrega" ? d.usuario.endereco : null}
            isOpen={d.isConfirmationModalOpen}
            onClose={() => d.setIsConfirmationModalOpen(false)}
            onConfirm={d.handleConfirmOrder}
          />
        </PopUpModal>

        <AddressModal
          isOpen={d.isAddressModalOpen}
          onClose={() => d.setIsAddressModalOpen(false)}
          initialAddress={d.usuario.endereco}
          onSave={(data) => {
            d.usuario.setEndereco(data);
            d.setIsAddressModalOpen(false);
          }}
        />
      </div>
    </div>
  );
}
