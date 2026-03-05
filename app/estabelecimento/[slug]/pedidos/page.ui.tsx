import { EnderecoResponse, PedidoResponse } from "@/src/Services/API";
import styles from "./page.module.css";

interface OrdersPageUIProps {
  loading: boolean;
  pedidos: PedidoResponse[] | null;
  formatarEndereco: (endereco?: EnderecoResponse) => string;
  formatCurrency: (value: number) => string;
  calcularTotalPedido: (p: PedidoResponse) => number;
}

export function OrdersPageUI({
  loading,
  pedidos,
  formatarEndereco,
  formatCurrency,
  calcularTotalPedido,
}: OrdersPageUIProps) {
  const totalPedidos = pedidos?.length ?? 0;
  const totalGeral = (pedidos ?? []).reduce(
    (acc, pedido) => acc + calcularTotalPedido(pedido),
    0,
  );

  const getStatusClass = (status: string) => {
    const normalized = (status || "").toLowerCase();
    if (normalized.includes("pendente")) return styles.statusPending;
    if (normalized.includes("preparo")) return styles.statusPreparing;
    if (normalized.includes("entrega")) return styles.statusDelivery;
    if (normalized.includes("final")) return styles.statusDone;
    if (normalized.includes("cancel")) return styles.statusCanceled;
    return styles.statusDefault;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Carregando seus pedidos...</p>
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <div className={styles.hero}>
        <h2 className={styles.title}>Meus Pedidos</h2>
        <p className={styles.subtitle}>Acompanhe os pedidos feitos neste estabelecimento</p>
        <div className={styles.kpis}>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Pedidos</span>
            <strong className={styles.kpiValue}>{totalPedidos}</strong>
          </div>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Total</span>
            <strong className={styles.kpiValue}>{formatCurrency(totalGeral)}</strong>
          </div>
        </div>
      </div>

      <div className={styles.cardsContainer}>
        {pedidos && pedidos.length > 0 ? (
          pedidos.map((p) => {
            const total = calcularTotalPedido(p);

            return (
              <div className={styles.card} key={`order-card-${p.id}`}>
                <div className={styles.header}>
                  <div className={styles.storeInfo}>
                    <span className={styles.userName}>{p.nomeCliente}</span>
                    <span className={styles.orderId}>Pedido #{p.id}</span>
                  </div>
                  <span className={`${styles.statusBadge} ${getStatusClass(p.status)}`}>
                    {p.status}
                  </span>
                </div>

                <div className={styles.body}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Qtd</th>
                        <th>Produto</th>
                        <th className={styles.textRight}>Unit.</th>
                        <th className={styles.textRight}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.produtoPedidos?.map((item, idx) => (
                        <tr key={`pedido-${p.id}-item-${idx}`}>
                          <td>{item.quantidade}x</td>
                          <td>{item.produto}</td>
                          <td className={styles.textRight}>
                            {formatCurrency(item.preco)}
                          </td>
                          <td className={styles.textRight}>
                            {formatCurrency(item.preco * item.quantidade)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {p.observacao && (
                    <div className={styles.obsSection}>
                      <strong>Obs:</strong> {p.observacao}
                    </div>
                  )}
                </div>

                <div className={styles.footer}>
                  <div className={styles.addressSection}>
                    <span className={styles.eta}>{formatarEndereco(p.endereco)}</span>
                  </div>
                  <div className={styles.priceTotal}>
                    <span>Total:</span>
                    <strong>{formatCurrency(total)}</strong>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.noOrders}>
            <p>Nenhum pedido encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
