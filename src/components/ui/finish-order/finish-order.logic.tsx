"use client";

import {
  API,
  CreatePedidoDTO,
  EstabelecimentoResponse,
  MetodoPagamentoResponse,
} from "@/src/Services/API";
import { useCarrinho } from "@/src/store/Carrinho";
import { useUsuario } from "@/src/store/Usuario";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function useFinishOrderLogic(
  onOverlayStateChange?: (v: boolean) => void,
) {
  const api = useMemo(() => new API(), []);
  const { slug } = useParams<{ slug: string }>();

  const produtos = useCarrinho((s) => s.produtos);
  const clear = useCarrinho((s) => s.clear);
  const usuario = useUsuario();

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
    async function load() {
      const data = await api.getEstabelecimento(slug);
      setEstabelecimento(data);
      const methods = await api.getMetodosPagamento(slug);
      setPaymentMethods(methods);
    }
    load();
  }, [slug, api]);

  useEffect(() => {
    onOverlayStateChange?.(isAnythingOpen);
    document.body.style.overflow = isAnythingOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isAnythingOpen, onOverlayStateChange]);

  const subtotal = useMemo(
    () =>
      produtos.reduce(
        (acc, item) => acc + (item.quantidade ?? 0) * item.preco,
        0,
      ),
    [produtos],
  );

  const taxaEntrega =
    deliveryType === "entrega" ? (estabelecimento?.taxaEntrega ?? 0) : 0;

  const totalGeral = subtotal + taxaEntrega;

  const toggleDeliveryType = () =>
    setDeliveryType((p) => (p === "entrega" ? "retirada" : "entrega"));

  const handleConfirmOrder = async (
    name: string,
    phone: string,
    obs: string,
  ) => {
    if (!produtos.length) return alert("Carrinho vazio");
    if (!selectedPaymentMethodId)
      return alert("Selecione uma forma de pagamento");
    if (deliveryType === "entrega" && !usuario.endereco)
      return alert("Informe um endereço");

    const order: CreatePedidoDTO = {
      nomeCliente: name,
      telefoneCliente: phone,
      metodoPagamento: selectedPaymentMethodId,
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
      endereco: {
        rua: enderecoPedido?.rua || "",
        numero: enderecoPedido?.numero || "",
        bairro: enderecoPedido?.bairro || "",
        cidadeId: 1,
        ufId: 1,
        cep: enderecoPedido?.cep || "",
        complemento: enderecoPedido?.complemento || "",
      },
    };

    await api.CriarPedidos(order, slug);
    clear();
    setIsConfirmationModalOpen(false);
    setIsOpen(false);
    alert(`Pedido confirmado! Total: ${formatMoney(totalGeral)}`);
  };

  return {
    produtos,
    usuario,
    estabelecimento,
    paymentMethods,
    selectedPaymentMethodId,
    setSelectedPaymentMethodId,
    deliveryType,
    toggleDeliveryType,
    subtotal,
    taxaEntrega,
    totalGeral,
    isOpen,
    setIsOpen,
    isConfirmationModalOpen,
    setIsConfirmationModalOpen,
    isAddressModalOpen,
    setIsAddressModalOpen,
    handleConfirmOrder,
  };
}

export const formatMoney = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
