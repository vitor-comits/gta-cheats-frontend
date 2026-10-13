import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "GTA Cheats Hub - Catálogo de Códigos e Trapaças de Grand Theft Auto",
  description:
    "Catálogo de referência rápida para códigos e trapaças de todos os títulos da franquia Grand Theft Auto.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <main className="site-main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
