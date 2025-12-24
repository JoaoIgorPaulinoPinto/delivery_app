"use client";

import { MapPin, ShoppingCart, Trash2, Truck, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Pedido } from "@/src/models/models";
import { API } from "@/src/Services/API";
import { useCarrinho } from "@/src/store/Carrinho";
import { useEstabelecimento } from "@/src/store/Estabelecimento";
import { useUsuario } from "@/src/store/Usuario";

import AddressModal from "../modal/adress-modal";
import ConfirmationModal from "../modal/confirmation-modal";
import PopUpModal from "../modal/pop-up-modal";
import styles from "./finish-order.module.css";

type PaymentMethod = {
  id: number;
  nome: string;
};

export default function FinishOrder() {
  const api = useMemo(() => new API(), []);
  const produtos = useCarrinho((state) => state.produtos);
  const { remove, clear } = useCarrinho();
  const usuario = useUsuario();
  const { estabelecimento } = useEstabelecimento();

  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"retirada" | "entrega">(
    "retirada"
  );
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    number | null
  >(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const res = await api.GetPaymentMeth();
        setPaymentMethods(res.data);
      } catch (err) {
        console.error("Erro ao buscar métodos de pagamento", err);
      }
    };
    fetchPaymentMethods();
  }, [api]);

  const subtotal = useMemo(() => {
    return produtos.reduce(
      (acc, item) => acc + (item.quantidade ?? 0) * item.preco,
      0
    );
  }, [produtos]);

  const taxaEntrega =
    deliveryType === "entrega" ? estabelecimento?.taxaEntrega ?? 0 : 0;
  const totalGeral = subtotal + taxaEntrega;

  const formatMoney = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleConfirmOrder = async (
    name: string,
    phone: string,
    obs: string
  ) => {
    if (!selectedPaymentMethodId) {
      alert("Selecione uma forma de pagamento");
      return;
    }
    const order: Pedido = {
      produtos: produtos.map((p) => ({
        id: p.id,
        produtoId: p.id,
        imgUrl: p.imgUrl || "",
        quantidade: p.quantidade,
        descricao: p.descricao || "",
        categoria: p.categoria,
        preco: p.preco,
        nome: p.nome,
      })),
      observacao: obs,
      metodoPagamentoId: selectedPaymentMethodId,
      endereco: deliveryType === "entrega" ? usuario.endereco : null,
      usuario: { nome: name, telefone: phone },
    };

    try {
      await api.CreatePedido(order);
      alert(`Pedido confirmado! Total: ${formatMoney(totalGeral)}`);
      clear();
      setIsConfirmationModalOpen(false);
      setIsOpen(false);
    } catch (err) {
      console.error("Erro ao criar pedido", err);
    }
  };

  if (produtos.length === 0 && !isOpen) return null;

  return (
    <div className={isOpen ? styles.confirmationOverlay : styles.footer}>
      <div className={styles.footer_container}>
        <div className={styles.footer_head}>
          <div className={styles.footer_info_text}>
            <span className={styles.footer_total}>
              {formatMoney(totalGeral)}
            </span>
            {deliveryType === "entrega" && (
              <small style={{ display: "block", fontSize: "10px" }}>
                + {formatMoney(taxaEntrega)} entrega
              </small>
            )}
          </div>
          <button
            className={styles.footer_cart}
            onClick={() => setIsOpen((p) => !p)}
          >
            {isOpen ? (
              <X size={24} />
            ) : (
              <span
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                Finalizar <ShoppingCart size={15} />
              </span>
            )}
          </button>
        </div>

        <div className={`${styles.form} ${isOpen ? styles.open : ""}`}>
          <div className={styles.delivery_preferences}>
            <div className={styles.section}>
              <h3>Opções de Entrega</h3>
              <div
                className={styles.delivery_row_toggle_container}
                onClick={() =>
                  setDeliveryType((prev) =>
                    prev === "entrega" ? "retirada" : "entrega"
                  )
                }
              >
                <div
                  className={`${styles.delivery_row_toggle_left} ${
                    deliveryType === "entrega"
                      ? styles.delivery_row_toggle_selected
                      : ""
                  }`}
                >
                  Entrega <Truck size={16} />
                </div>
                <div
                  className={`${styles.delivery_row_toggle_right} ${
                    deliveryType === "retirada"
                      ? styles.delivery_row_toggle_selected
                      : ""
                  }`}
                >
                  Retirada <MapPin size={16} />
                </div>
              </div>
            </div>

            {deliveryType === "entrega" && (
              <div className={styles.section}>
                <h3>Endereço de Entrega</h3>
                <div className={styles.addressBox}>
                  <div>
                    <strong>Localização</strong>
                    <p>
                      {usuario.endereco?.rua
                        ? `${usuario.endereco.rua}, ${usuario.endereco.numero}`
                        : "Nenhum endereço cadastrado"}
                    </p>
                  </div>
                  <button
                    className={styles.changeAddress}
                    onClick={() => setIsAddressModalOpen(true)}
                  >
                    {usuario.endereco?.rua ? "Alterar" : "Cadastrar"}
                  </button>
                </div>
              </div>
            )}

            <div className={styles.section}>
              <h3>Forma de Pagamento</h3>
              <div className={styles.paymentRow}>
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    className={`${styles.paymentButton} ${
                      selectedPaymentMethodId === method.id ? styles.active : ""
                    }`}
                    onClick={() => setSelectedPaymentMethodId(method.id)}
                  >
                    {method.nome}
                  </button>
                ))}
              </div>
            </div>
            {/* --- TABELA USANDO AS CLASSES DO SEU CSS --- */}
            <div className={styles.section}>
              <h3>Itens do Pedido</h3>
              <div className={styles.products_table}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th className={styles.p_quant}>Qtd</th>
                      <th className={styles.p_price}>Preço</th>
                      <th className={styles.p_total}>Total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.map((item, index) => (
                      <tr key={index}>
                        <td>{item.nome}</td>
                        <td className={styles.p_quant}>{item.quantidade}</td>
                        <td className={styles.p_price}>
                          {formatMoney(item.preco)}
                        </td>
                        <td className={styles.p_total}>
                          {formatMoney(item.preco * (item.quantidade || 1))}
                        </td>
                        <td>
                          <button
                            onClick={() => remove(item)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#ff4d4d",
                              cursor: "pointer",
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className={styles.section}>
              <div className={styles.total}>
                <span>Total: {formatMoney(totalGeral)}</span>
              </div>
              <button
                className={styles.finishButton}
                disabled={produtos.length === 0}
                onClick={() => setIsConfirmationModalOpen(true)}
              >
                Confirmar Pedido
              </button>
            </div>
          </div>
        </div>

        <PopUpModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
        >
          <ConfirmationModal
            total={formatMoney(totalGeral)}
            endereco={deliveryType === "entrega" ? usuario.endereco : null}
            isOpen={isConfirmationModalOpen}
            onClose={() => setIsConfirmationModalOpen(false)}
            onConfirm={handleConfirmOrder}
          />
        </PopUpModal>

        <AddressModal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
          initialAddress={usuario.endereco}
          onSave={(data) => {
            setIsAddressModalOpen(false);
            usuario.setEndereco(data);
          }}
        />
      </div>
    </div>
  );
}
