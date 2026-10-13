"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const isGamesActive = pathname === "/" || pathname.startsWith("/cheats");
  const isAboutActive = pathname === "/about";

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-brand">
          GTA Cheats Hub
        </Link>

        <nav aria-label="Navegação principal" className="site-nav">
          <Link
            href="/"
            aria-current={isGamesActive ? "page" : undefined}
            className={`site-nav-link ${
              isGamesActive ? "site-nav-link-active" : ""
            }`}
          >
            Todos os Jogos
          </Link>
          <Link
            href="/about"
            aria-current={isAboutActive ? "page" : undefined}
            className={`site-nav-link ${
              isAboutActive ? "site-nav-link-active" : ""
            }`}
          >
            Sobre
          </Link>
        </nav>
      </div>
    </header>
  );
}
