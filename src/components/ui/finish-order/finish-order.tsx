"use client";

import { MapPin, ShoppingCart, Truck, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Pedido } from "@/src/models/Pedido";
import { pedidoProduto } from "@/src/models/PedidoProduto";
import { API } from "@/src/Services/API";
import { useCarrinho } from "@/src/store/Carrinho";

import AddressModal, { EnderecoData } from "../modal/adress-modal";
import ConfirmationModal from "../modal/confirmation-modal";
import PopUpModal from "../modal/pop-up-modal";

import styles from "./finish-order.module.css";

/* =======================
   TYPES
======================= */
type PaymentMethod = {
  id: number;
  nome: string;
};

/* =======================
   COMPONENT
======================= */
export default function FinishOrder() {
  const api = new API();

  /* UI STATES */
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"retirada" | "entrega">(
    "retirada"
  );

  /* PAYMENT */
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    number | null
  >(null);

  /* ADDRESS */
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [address, setAddress] = useState<EnderecoData | undefined>(undefined);

  /* CART */
  const produtos = useCarrinho((state) => state.produtos);
  const clear = useCarrinho((state) => state.clear);

  /* =======================
     EFFECTS
  ======================= */
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const res = await api.GetPaymentMeth();
        setPaymentMethods(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Erro ao \buscar métodos de pagamento", err);
      }
    };

    fetchPaymentMethods();
  }, []);

  /* =======================
     HELPERS
  ======================= */
  const toggleDeliveryType = () =>
    setDeliveryType((prev) => (prev === "retirada" ? "entrega" : "retirada"));

  const total = produtos.reduce(
    (acc, item) => acc + (item.quantidade ?? 0) * item.preco,
    0
  );

  const formatMoney = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  /* =======================
     ORDER CONFIRM
  ======================= */
  const handleConfirmOrder = async (
    name: string,
    phone: string,
    obs: string
  ) => {
    if (!selectedPaymentMethodId) {
      alert("Selecione uma forma de pagamento");
      return;
    }

    if (deliveryType === "entrega" && !address) {
      alert("Informe o endereço de entrega");
      return;
    }

    const order: Pedido = {
      observacao: obs,
      MetodoPagamentoId: selectedPaymentMethodId,
      endereco:
        deliveryType === "entrega"
          ? (address as EnderecoData)
          : "Retirada no local",
      produtos: produtos.map(
        (p): pedidoProduto => ({
          produtoId: p.id,
          quantidade: p.quantidade,
        })
      ),
      usuario: {
        nome: name,
        telefone: phone,
      },
    };

    console.log(order);
    try {
      const res = await api.CreatePedido(order);
      console.log("Pedido criado:", res.data);

      clear();
      setIsConfirmationModalOpen(false);
      setIsOpen(false);

      alert(`Pedido confirmado no valor de ${formatMoney(total)}`);
    } catch (err) {
      console.error("Erro ao criar pedido", err);
      alert("Erro ao finalizar pedido");
    }
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <div className={isOpen ? styles.confirmationOverlay : ""}>
      <div className={styles.footer}>
        {/* HEADER */}
        <div className={styles.footer_head}>
          <span className={styles.footer_total}>{formatMoney(total)}</span>

          <button
            className={styles.footer_cart}
            onClick={() => setIsOpen((p) => !p)}
          >
            {isOpen ? <X /> : <ShoppingCart />}
          </button>
        </div>

        {/* FORM */}
        <div className={`${styles.form} ${isOpen ? styles.open : ""}`}>
          <div className={styles.delivery_preferences}>
            {/* ENTREGA */}
            <div className={styles.section}>
              <h3>Opções de Entrega</h3>

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
                  Entrega <Truck />
                </div>

                <div
                  className={`${styles.delivery_row_toggle_right} ${
                    deliveryType === "retirada"
                      ? styles.delivery_row_toggle_selected
                      : ""
                  }`}
                >
                  Retirada <MapPin />
                </div>
              </div>
            </div>

            {/* ENDEREÇO */}
            {deliveryType === "entrega" && (
              <div className={styles.section}>
                <h3>Endereço</h3>

                <div className={styles.addressBox}>
                  <div>
                    <strong>Meu Endereço</strong>
                    <p>
                      {address
                        ? `${address.rua}, ${address.numero} - ${address.cidade}/${address.uf}`
                        : "Nenhum endereço selecionado"}
                    </p>
                  </div>

                  <button
                    className={styles.changeAddress}
                    onClick={() => setIsAddressModalOpen(true)}
                  >
                    Alterar
                  </button>
                </div>
              </div>
            )}

            <AddressModal
              isOpen={isAddressModalOpen}
              onClose={() => setIsAddressModalOpen(false)}
              initialAddress={address}
              onSave={(data) => {
                setAddress(data);
                setIsAddressModalOpen(false);
              }}
            />

            {/* PAGAMENTO */}
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

            {/* PRODUTOS */}
            <div className={styles.products_table}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Qtd</th>
                    <th>Preço</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((p) => (
                    <tr key={p.id}>
                      <td>{p.nome}</td>
                      <td>{p.quantidade}</td>
                      <td>{formatMoney(p.preco)}</td>
                      <td>{formatMoney(p.quantidade * p.preco)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* FINAL */}
            <div className={styles.section}>
              <span className={styles.total}>{formatMoney(total)}</span>

              <button
                className={styles.finishButton}
                onClick={() => setIsConfirmationModalOpen(true)}
              >
                Finalizar Pedido
              </button>
            </div>
          </div>
        </div>

        {/* CONFIRM MODAL */}
        <PopUpModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
        >
          <ConfirmationModal
            total={formatMoney(total)}
            endereco={address}
            isOpen
            onClose={() => setIsConfirmationModalOpen(false)}
            onConfirm={handleConfirmOrder}
          />
        </PopUpModal>
      </div>
    </div>
  );
}
