import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Rota 67 - Notícias com IA",
    template: "%s | Rota 67",
  },
  description:
    "Plataforma de geração automatizada de notícias com inteligência artificial",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <header className="bg-white shadow-sm">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-xl font-bold">
              Rota 67
            </Link>
            <div className="flex gap-6">
              <Link
                href="/noticias"
                className="text-gray-600 hover:text-gray-900"
              >
                Notícias
              </Link>
              <Link
                href="/gerador-de-noticia"
                className="text-gray-600 hover:text-gray-900"
              >
                Gerar Notícia
              </Link>
            </div>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
