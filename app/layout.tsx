import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./src/components/navbar/navbar";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Delivery!",
  description: "Aplicativo para restaurantes e lanchonetes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        <Navbar />

        {children}
      </body>
    </html>
  );
}
