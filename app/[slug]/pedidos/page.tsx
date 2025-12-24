"use client"; // Adicione se for usar hooks como useState ou useEffect

import { EnderecoPedido, Pedido } from "@/src/models/models";
import { API } from "@/src/Services/API";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function OrdersPage() {
  const params = useParams();
  const slug = params.slug as string;
  const apiInstance = new API();
  const [loading, setLoading] = useState(true);
  const [pedidos, setPedidos] = useState<Pedido[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      try {
        const data = await apiInstance.getPedidos();
        setPedidos(data);
        console.log(data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]); // Mantenha apenas o slug como dependência

  const formatarEndereco = (endereco?: EnderecoPedido) => {
    if (!endereco) return "Endereco não encontrado";
    const { rua, numero, bairro, cidade } = endereco;
    return `${rua}, ${numero} - ${bairro}, ${cidade}`;
  };
  if (loading) return <div className={styles.main}>Carregando...</div>;
  return (
    <div className={styles.main}>
      {pedidos?.map((p, index) => {
        return (
          <div className={styles.card} key={index}>
            <div className={styles.header}>
              <div className={styles.storeInfo}>
                <span className={styles.userName}>{p.usuario.nome}</span>
                <span className={styles.orderId}>📦 Pedido #{p.id}</span>
              </div>
              <span className={styles.statusBadge}>{p.status?.nome}</span>
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
                  {p.produtos.map((item, index) => (
                    <tr key={index}>
                      <td>{item.quantidade}x</td>
                      <td>{item.nome}</td>
                      <td className={styles.textRight}>
                        {item.preco.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {p.observacao && (
                <div className={styles.obsSection}>{p.observacao}</div>
              )}
            </div>
            <span className={styles.price}>
              {(() => {
                // Calcula o valor dos itens.
                // OBS: Use 'item.preco' que deve vir no DTO do pedido, não o do catálogo geral.
                const subtotal = p.produtos.reduce(
                  (acc, item) => acc + (item.preco ?? 0) * item.quantidade,
                  0
                );

                const taxaEntrega = p.estabelecimento?.taxaEntrega ?? 0;

                return (subtotal + taxaEntrega).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                });
              })()}
            </span>
            <div className={styles.footer}>
              <span className={styles.eta}>
                📍 {formatarEndereco(p.endereco ?? undefined)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
