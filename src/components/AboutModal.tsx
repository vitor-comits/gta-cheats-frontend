"use client";

import React from "react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white border border-zinc-200 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white font-black flex items-center justify-center text-sm">
              GTA
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 text-base leading-none">
                Sobre o GTA Cheats Hub
              </h3>
              <span className="text-[11px] text-zinc-400">Versão 1.0.0</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 text-sm p-1.5 rounded-lg hover:bg-zinc-100"
          >
            ✕
          </button>
        </div>

        <div className="py-4 space-y-3 text-xs text-zinc-600 leading-relaxed">
          <p>
            O <strong>GTA Cheats Hub</strong> é uma plataforma moderna e completa para consulta rápida e gerenciamento de códigos e trapaças de toda a franquia <strong>Grand Theft Auto</strong> (do clássico de 1997 até GTA V).
          </p>

          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 space-y-2">
            <h4 className="font-semibold text-zinc-800 text-xs">🛠️ Tecnologias Utilizadas:</h4>
            <ul className="list-disc list-inside space-y-1 text-zinc-500">
              <li><strong>Frontend:</strong> Next.js 16 (React 19), Tailwind CSS, TypeScript.</li>
              <li><strong>Backend:</strong> Python, Flask, PyMongo e OpenAPI / Swagger.</li>
              <li><strong>Banco de Dados:</strong> MongoDB Atlas Cloud.</li>
            </ul>
          </div>

          <p>
            Pelo painel administrativo é possível cadastrar, editar e remover códigos em tempo real para as plataformas <strong>PC</strong>, <strong>PlayStation</strong>, <strong>Xbox</strong> e <strong>Telefone Celular</strong>.
          </p>
        </div>

        <div className="pt-3 border-t border-zinc-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

