import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "GTA Cheats Hub - Catálogo e Gestão de Códigos de Cheats",
  description:
    "Guia completo de códigos de trapaça para todos os jogos da franquia Grand Theft Auto, com consulta e cadastro de cheats.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Suspense fallback={<header className="site-header" />}>
          <Header />
        </Suspense>
        <main className="site-main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
