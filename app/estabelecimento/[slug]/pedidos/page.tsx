"use client";
import { useOrdersPageLogic } from "./page.logic";
import { OrdersPageUI } from "./page.ui";
export default function OrdersPage() {
  const logic = useOrdersPageLogic();

  return (
    <OrdersPageUI
      loading={logic.loading}
      pedidos={logic.pedidos ?? null}
      formatarEndereco={logic.formatarEndereco}
      formatCurrency={logic.formatCurrency}
      calcularTotalPedido={logic.calcularTotalPedido}
    />
  );
}
