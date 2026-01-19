// app/not-found.tsx
export default function NotFound() {
  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ fontSize: "40px", color: "#110404ff" }}>404</h1>
      <p>Estabelecimento não encontrado</p>
      <p style={{ fontSize: "12px", fontStyle: "italic" }}>
        Tente entrar com um link válido.
      </p>
    </div>
  );
}
