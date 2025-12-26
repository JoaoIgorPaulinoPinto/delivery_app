import Navbar from "@/src/components/ui/navbar/navbar";
import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="pt-br" data-theme="soft-dark">
      <body>
        <Navbar />

        {children}
      </body>
    </html>
  );
}
