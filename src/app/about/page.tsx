import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="page-container">
      <nav className="breadcrumb" aria-label="Navegação">
        <Link href="/" className="breadcrumb-link">
          Início
        </Link>
        <span aria-hidden="true">/</span>
        <span>Sobre</span>
      </nav>

      <section className="page-header">
        <h1 className="page-title">Sobre o GTA Cheats Hub</h1>
        <p className="page-subtitle">
          Catálogo moderno e centralizado para consulta rápida e gerenciamento
          de códigos e trapaças de toda a franquia Grand Theft Auto.
        </p>
      </section>

      <div className="space-y-6 max-w-3xl">
        <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-xs space-y-3">
          <h2 className="text-base font-bold text-zinc-900">
            O Projeto
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            O <strong>GTA Cheats Hub</strong> foi desenvolvido para reunir,
            organizar e facilitar a busca de trapaças e códigos de qualquer
            edição de Grand Theft Auto (desde o clássico de 1997 até GTA V) nas
            mais diversas plataformas: PC, PlayStation, Xbox e Telefones
            Celulares no jogo.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-xs space-y-3">
          <h2 className="text-base font-bold text-zinc-900">
            Tecnologias Utilizadas
          </h2>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-zinc-600">
            <li>
              <strong>Frontend:</strong> Next.js 16 (React 19), App Router,
              Tailwind CSS, TypeScript.
            </li>
            <li>
              <strong>Backend:</strong> API REST com suporte a consultas por
              jogo, categoria e operações CRUD de códigos.
            </li>
            <li>
              <strong>Configuração:</strong> Endpoint de API configurado via
              variáveis de ambiente (<code className="text-xs bg-zinc-100 px-1 py-0.5 rounded">.env</code>).
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-xs space-y-3">
          <h2 className="text-base font-bold text-zinc-900">
            Aviso Legal
          </h2>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Este projeto tem finalidade educacional e comunitária. Todos os
            títulos, nomes, marcas registradas e materiais associados à franquia
            Grand Theft Auto pertencem à <strong>Rockstar Games / Take-Two Interactive</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
