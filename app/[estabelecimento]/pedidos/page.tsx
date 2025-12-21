"use client"; // Adicione se for usar hooks como useState ou useEffect

import Pedido from "@/src/models/Pedido"; // Ajuste os nomes se necessário
import Produto from "@/src/models/Produto"; // Ajuste os nomes se necessário
import styles from "./page.module.css";

export default function OrdersPage() {
  // Exemplo de dados (Em um app real, viriam de um fetch ou banco de dados)
  const listaDeProdutos: Produto[] = [
    {
      id: 1,
      nome: "Whopper Especial",
      preco: 30.0,
      categoria: "Burger",
      descricao: "",
      imgUrl: "",
      quantidade: 0,
    },
    {
      id: 2,
      nome: "Batata M",
      preco: 14.9,
      categoria: "Acompanhamento",
      descricao: "",
      imgUrl: "",
      quantidade: 0,
    },
    {
      id: 3,
      nome: "Coca-Cola 600ml",
      preco: 10.0,
      categoria: "Bebida",
      descricao: "",
      imgUrl: "",
      quantidade: 0,
    },
  ];

  const pedido: Pedido = {
    usuario: { nome: "João Silva", telefone: "11999999999" },
    produtos: [
      { produtoId: 1, quantidade: 2 },
      { produtoId: 2, quantidade: 1 },
      { produtoId: 3, quantidade: 1 },
    ],
    observacao: "Sem cebola no burger, por favor.",
    endereco: {
      rua: "Rua dos Bobos",
      numero: 0,
      bairro: "Centro",
      cidade: "São Paulo",
      cep: 0,
      uf: "",
      complemento: "",
    },
    MetodoPagamentoId: 1,
  };

  // Lógica de processamento (Igual ao componente anterior)
  const detalhesProdutos = pedido.produtos.map((item) => {
    const info = listaDeProdutos.find((p) => p.id === item.produtoId);
    return {
      quantidade: item.quantidade,
      nome: info?.nome || "Produto não encontrado",
      totalItem: (info?.preco || 0) * item.quantidade,
    };
  });

  const valorTotalPedido = detalhesProdutos.reduce(
    (acc, item) => acc + item.totalItem,
    0
  );

  const formatarEndereco = () => {
    if (typeof pedido.endereco === "string") return pedido.endereco;
    const { rua, numero, bairro, cidade } = pedido.endereco;
    return `${rua}, ${numero} - ${bairro}, ${cidade}`;
  };

  return (
    <div className={styles.main}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.storeInfo}>
            <span className={styles.userName}>{pedido.usuario.nome}</span>
            <span className={styles.orderId}>📦 Pedido #4582</span>
          </div>
          <span className={styles.statusBadge}>Em preparação</span>
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
              {detalhesProdutos.map((item, index) => (
                <tr key={index}>
                  <td>{item.quantidade}x</td>
                  <td>{item.nome}</td>
                  <td className={styles.textRight}>
                    {item.totalItem.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pedido.observacao && (
            <div className={styles.obsSection}>{pedido.observacao}</div>
          )}
        </div>
        <div className={styles.priceContainer}>
          <span>Total:</span>
          <span className={styles.price}>
            {valorTotalPedido.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>
        <div className={styles.footer}>
          <span className={styles.eta}>📍 {formatarEndereco()}</span>
        </div>
      </div>
    </div>
  );
}
