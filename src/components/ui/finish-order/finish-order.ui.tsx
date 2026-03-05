"use client";

import { useEnderecoNomes } from "@/src/hooks/useEnderecoNomes";
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
  const usuarioLocalizacao = useEnderecoNomes(d.usuario.endereco);
  const estabelecimentoLocalizacao = useEnderecoNomes(d.estabelecimento?.endereco);

  return (
    <div className={d.isOpen ? styles.confirmationOverlay : styles.footer}>
      <div className={styles.footer_container}>
        <div className={styles.footer_head}>
          <div className={styles.footerSummary}>
            <span className={styles.footer_total}>{formatMoney(d.totalGeral)}</span>
            {d.deliveryType === "entrega" && (
              <span className={styles.deliveryTax}>
                + {formatMoney(d.taxaEntrega)} frete
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
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Entrega</h3>
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

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Endereco</h3>
            <div className={styles.addressBox}>
              {d.deliveryType === "entrega" ? (
                <>
                  <label>
                    {d.usuario.endereco?.rua ? (
                      <p>
                        {d.usuario.endereco.rua}, {d.usuario.endereco.numero} -{" "}
                        {usuarioLocalizacao.cidadeNome || d.usuario.endereco.cidadeId}/
                        {usuarioLocalizacao.estadoNome || d.usuario.endereco.ufId}
                      </p>
                    ) : (
                      "Nenhum endereco cadastrado"
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
                  {d.estabelecimento.endereco.rua}, {d.estabelecimento.endereco.numero} -{" "}
                  {estabelecimentoLocalizacao.cidadeNome ||
                    d.estabelecimento.endereco.cidadeId}
                  /
                  {estabelecimentoLocalizacao.estadoNome ||
                    d.estabelecimento.endereco.ufId}
                </p>
              ) : (
                <p>Carregando endereco...</p>
              )}
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Pagamento</h3>
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

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Itens do Pedido</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th className={styles.colRight}>Qtd</th>
                  <th className={styles.colRight}>Unit.</th>
                  <th className={styles.colRight}>Total</th>
                </tr>
              </thead>
              <tbody>
                {d.produtos.map((i) => (
                  <tr key={i.id}>
                    <td>{i.nome}</td>
                    <td className={styles.colRight}>{i.quantidade}</td>
                    <td className={styles.colRight}>{formatMoney(i.preco)}</td>
                    <td className={styles.colRight}>
                      {formatMoney(i.preco * (i.quantidade || 1))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Resumo</h3>
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

        <PopUpModal
          isOpen={d.isConfirmationModalOpen}
          onClose={() => d.setIsConfirmationModalOpen(false)}
        >
          <ConfirmationModal
            total={formatMoney(d.totalGeral)}
            endereco={d.deliveryType === "entrega" ? d.usuario.endereco : null}
            localizacao={{
              cidadeNome: usuarioLocalizacao.cidadeNome,
              estadoNome: usuarioLocalizacao.estadoNome,
            }}
            isOpen={d.isConfirmationModalOpen}
            onClose={() => d.setIsConfirmationModalOpen(false)}
            onConfirm={d.handleConfirmOrder}
          />
        </PopUpModal>

        {d.isAddressModalOpen && (
          <AddressModal
            isOpen={d.isAddressModalOpen}
            onClose={() => d.setIsAddressModalOpen(false)}
            initialAddress={d.usuario.endereco}
            onSave={(data) => {
              d.usuario.setEndereco(data);
              d.setIsAddressModalOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
