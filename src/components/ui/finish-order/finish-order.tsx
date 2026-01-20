"use client";

import { MapPin, ShoppingCart, Truck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  API,
  CreatePedidoDTO,
  EstabelecimentoResponse,
  MetodoPagamentoResponse,
} from "@/src/Services/API";
import { useCarrinho } from "@/src/store/Carrinho";
import { useUsuario } from "@/src/store/Usuario";

import { useParams } from "next/navigation";
import AddressModal from "../modal/adress-modal";
import ConfirmationModal from "../modal/confirmation-modal";
import PopUpModal from "../modal/pop-up-modal";
import styles from "./finish-order.module.css";

type PaymentMethod = {
  id: number;
  nome: string;
};

interface FinishOrderProps {
  onOverlayStateChange?: (isActive: boolean) => void;
}

const formatMoney = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export default function FinishOrder({
  onOverlayStateChange,
}: FinishOrderProps) {
  const api = useMemo(() => new API(), []);

  const produtos = useCarrinho((state) => state.produtos);
  const clear = useCarrinho((state) => state.clear);
  const usuario = useUsuario();

  const params = useParams();
  const slug = params.slug as string;

  const [estabelecimento, setEstabelecimento] =
    useState<EstabelecimentoResponse | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const [deliveryType, setDeliveryType] = useState<"retirada" | "entrega">(
    "retirada",
  );
  const [paymentMethods, setPaymentMethods] = useState<
    MetodoPagamentoResponse[]
  >([]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    number | null
  >(null);

  const enderecoPedido =
    deliveryType === "entrega" ? usuario.endereco : estabelecimento?.endereco;

  const isAnythingOpen =
    isOpen || isConfirmationModalOpen || isAddressModalOpen;
  useEffect(() => {
    if (!slug) return;

    const fetchEstabelecimento = async () => {
      const data = await api.getEstabelecimento(slug);
      setEstabelecimento(data);
      const paymentMethods = await api.getMetodosPagamento(slug);
      setPaymentMethods(paymentMethods);

      console.log("estabelecimento:", data);
    };

    fetchEstabelecimento();
  }, [slug, api]);
  useEffect(() => {
    onOverlayStateChange?.(isAnythingOpen);
    document.body.style.overflow = isAnythingOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isAnythingOpen, onOverlayStateChange]);

  const subtotal = useMemo(() => {
    return produtos.reduce(
      (acc, item) => acc + (item.quantidade ?? 0) * item.preco,
      0,
    );
  }, [produtos]);

  const taxaEntrega =
    deliveryType === "entrega" ? (estabelecimento?.taxaEntrega ?? 0) : 0;

  const totalGeral = subtotal + taxaEntrega;

  const toggleDeliveryType = () => {
    setDeliveryType((prev) => (prev === "entrega" ? "retirada" : "entrega"));
  };

  const handleConfirmOrder = async (
    name: string,
    phone: string,
    obs: string,
  ) => {
    if (produtos.length === 0) {
      alert("Carrinho vazio");
      return;
    }

    if (!selectedPaymentMethodId) {
      alert("Selecione uma forma de pagamento");
      return;
    }

    if (deliveryType === "entrega" && !usuario.endereco) {
      alert("Informe um endereço de entrega");
      return;
    }

    const order: CreatePedidoDTO = {
      produtoPedidos: produtos.map((p) => ({
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
      metodoPagamento: selectedPaymentMethodId,
      endereco: {
        rua: enderecoPedido?.rua || "",
        numero: enderecoPedido?.numero || "",
        bairro: enderecoPedido?.bairro || "",
        cidadeId: 1 || 2,
        ufId: 1 || 2,
        cep: enderecoPedido?.cep || "",
        complemento: enderecoPedido?.complemento || "",
      },
      nomeCliente: name,
      telefoneCliente: phone,
    };

    await api.CriarPedidos(order, slug);
    clear();
    setIsConfirmationModalOpen(false);
    setIsOpen(false);
    alert(`Pedido confirmado! Total: ${formatMoney(totalGeral)}`);
  };

  return (
    <div className={isOpen ? styles.confirmationOverlay : styles.footer}>
      <div className={styles.footer_container}>
        <div className={styles.footer_head}>
          <div className={styles.footer_info_text}>
            <span className={styles.footer_total}>
              {formatMoney(totalGeral)}
            </span>
            {deliveryType === "entrega" && (
              <small className={styles.deliveryTax}>
                + {formatMoney(taxaEntrega)} entrega
              </small>
            )}
          </div>

          <button
            className={styles.footer_cart}
            onClick={() => setIsOpen((p) => !p)}
          >
            {isOpen ? (
              "Voltar"
            ) : (
              <>
                Finalizar <ShoppingCart size={15} />
              </>
            )}
          </button>
        </div>

        {/* FORM */}
        <div className={`${styles.form} ${isOpen ? styles.open : ""}`}>
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

          <div className={styles.section}>
            <h3>Endereço</h3>
            <div className={styles.addressBox}>
              {deliveryType === "entrega" ? (
                <>
                  <label>
                    {usuario.endereco?.rua ? (
                      <p>
                        {usuario.endereco.rua},{usuario.endereco.numero} -{" "}
                        {usuario.endereco.cidade}/{usuario.endereco.uf}
                      </p>
                    ) : (
                      "Nenhum endereço cadastrado"
                    )}
                  </label>
                  <button
                    className={styles.changeAddress}
                    onClick={() => setIsAddressModalOpen(true)}
                  >
                    {usuario.endereco ? "Alterar" : "Cadastrar"}
                  </button>
                </>
              ) : estabelecimento ? (
                <p>
                  {estabelecimento.endereco.rua},
                  {estabelecimento.endereco.numero} -{" "}
                  {estabelecimento.endereco.cidade}/
                  {estabelecimento.endereco.uf}
                </p>
              ) : (
                <p>Carregando endereço...</p>
              )}
            </div>
          </div>

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

          <div className={styles.section}>
            <h3>Itens do Pedido</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Preço</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nome}</td>
                    <td className={styles.p_quant}>{item.quantidade}</td>
                    <td className={styles.p_price}>
                      {formatMoney(item.preco)}
                    </td>
                    <td className={styles.p_total}>
                      {formatMoney(item.preco * (item.quantidade || 1))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.section}>
            <h3>Resumo</h3>

            <div className={styles.resumeRow}>
              <span>Subtotal</span>
              <strong>{formatMoney(subtotal)}</strong>
            </div>

            {deliveryType === "entrega" && (
              <div className={styles.resumeRow}>
                <span>Frete</span>
                <strong>{formatMoney(taxaEntrega)}</strong>
              </div>
            )}

            <div className={styles.resumeTotal}>
              <span>Total</span>
              <strong>{formatMoney(totalGeral)}</strong>
            </div>
          </div>

          <button
            className={styles.finishButton}
            onClick={() => setIsConfirmationModalOpen(true)}
          >
            Confirmar Pedido
          </button>
        </div>

        {/* MODALS */}
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
            usuario.setEndereco(data);
            setIsAddressModalOpen(false);
          }}
        />
      </div>
    </div>
  );
}
