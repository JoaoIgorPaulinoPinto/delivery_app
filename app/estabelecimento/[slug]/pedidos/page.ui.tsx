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
      <h2 className={styles.title}>Meus Pedidos</h2>

      <div className={styles.cardsContainer}>
        {pedidos && pedidos.length > 0 ? (
          pedidos.map((p) => {
            const total = calcularTotalPedido(p);

            return (
              <div className={styles.card} key={`order-card-${p.nomeCliente}`}>
                <div className={styles.header}>
                  <div className={styles.storeInfo}>
                    <span className={styles.userName}>{p.nomeCliente}</span>
                    {/* <span className={styles.orderId}>📦 Pedido #{p.}</span> */}

                    {/* adicioanar retorno do id do pedido tambem
                    <span className={styles.orderId}>📦 Pedido #{p.id}</span>
*/}
                  </div>
                  {/* <span
                    className={`${styles.statusBadge} ${
                      styles[p.status?.nome?.toLowerCase() || ""]
                    }`}
                  >
                    {p.status?.nome}
                  </span> */}
                </div>

                <div className={styles.body}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Qtd</th>
                        <th>Produto</th>
                        <th className={styles.textRight}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.produtoPedidos?.map((item, idx) => (
                        <tr key={`${p}-item-${idx}`}>
                          <td>{item.quantidade}x</td>
                          <td>{item.produto}</td>
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
                    <span className={styles.eta}>
                      {/* 📍 {formatarEndereco(p.endereco ?? undefined)} */}
                    </span>
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
