"use client";

import { Pedido } from "@/src/models/models";
import { API, EnderecoResponse } from "@/src/Services/API";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import styles from "./page.module.css";

export default function OrdersPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // Memoizamos a instância da API para não recriar em cada render
  const apiInstance = useMemo(() => new API(), []);

  const [loading, setLoading] = useState(true);
  const [pedidos, setPedidos] = useState<Pedido[] | null>(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!slug) return;
  //     try {
  //       const data = await apiInstance.getPedidos(slug);
  //       setPedidos(data);
  //     } catch (error) {
  //       console.error("Erro ao carregar dados:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [slug, apiInstance]);

  const formatarEndereco = (endereco?: EnderecoResponse) => {
    if (!endereco) return "Endereço não informado";
    const { rua, numero, bairro, cidade } = endereco;
    return `${rua}, ${numero} - ${bairro}, ${cidade}`;
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

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
            // Cálculo do total movido para dentro do map para clareza
            const subtotal = p.produtos.reduce(
              (acc, item) => acc + (item.preco ?? 0) * item.quantidade,
              0,
            );
            const taxaEntrega = p.estabelecimento?.taxaEntrega ?? 0;
            const total = subtotal + taxaEntrega;

            return (
              <div className={styles.card} key={p.id}>
                <div className={styles.header}>
                  <div className={styles.storeInfo}>
                    <span className={styles.userName}>{p.usuario.nome}</span>
                    <span className={styles.orderId}>📦 Pedido #{p.id}</span>
                  </div>
                  <span
                    className={`${styles.statusBadge} ${
                      styles[p.status?.nome?.toLowerCase() || ""]
                    }`}
                  >
                    {p.status?.nome}
                  </span>
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
                      {p.produtos.map((item, idx) => (
                        <tr key={`${p.id}-item-${idx}`}>
                          <td>{item.quantidade}x</td>
                          <td>{item.nome}</td>
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
                      📍 {formatarEndereco(p.endereco ?? undefined)}
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
