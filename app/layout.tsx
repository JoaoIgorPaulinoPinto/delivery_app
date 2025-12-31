import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Delivery!",
  description: "Aplicativo para restaurantes e lanchonetes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" data-theme="dark">
      <body>{children}</body>
    </html>
  );
}
