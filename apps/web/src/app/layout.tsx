import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import { Roboto_Slab } from "next/font/google";

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
});

export const metadata: Metadata = {
  title: {
    default: "Rota 67 — Notícias",
    template: "%s | Rota 67",
  },
  description:
    "Portal de notícias geradas com inteligência artificial — Rota 67",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`min-h-screen antialiased font-sans ${robotoSlab.className}`}
      >
        <header className="bg-(--color-dark) text-white sticky top-0 z-50 shadow-md">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:opacity-90 transition-opacity">
                <Image
                  src="/logo.svg"
                  alt="Rota 67"
                  width={120}
                  height={38}
                  priority
                />
              </Link>
            </div>
          </div>
        </header>

        <main>{children}</main>

        <footer className="bg-(--color-dark) text-white py-12 mt-16 border-t-4 border-(--color-primary)">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <Link href="/" className="block mb-3">
                  <Image
                    src="/logo.svg"
                    alt="Rota 67"
                    width={120}
                    height={38}
                  />
                </Link>
                <p className="text-gray-400 text-sm">
                  Notícias geradas com inteligência artificial, com agilidade e
                  precisão.
                </p>
              </div>
              <div>
                <h5 className="font-bold text-sm uppercase mb-4 text-gray-300">
                  Navegação
                </h5>
              </div>

              <div>
                <h5 className="font-bold text-sm uppercase mb-4 text-gray-300">
                  Institucional
                </h5>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <span className="hover:text-white cursor-pointer">
                      Sobre Nós
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white cursor-pointer">
                      Termos de Uso
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white cursor-pointer">
                      Política de Privacidade
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-sm uppercase mb-4 text-gray-300">
                  Redes Sociais
                </h5>
                <div className="flex space-x-3">
                  {["FB", "TW", "IG", "YT"].map((label) => (
                    <span
                      key={label}
                      className="w-8 h-8 bg-white/10 rounded flex items-center justify-center text-xs hover:bg-(--color-primary) transition-colors cursor-pointer"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs text-gray-500">
              © 2026 Rota 67. Todos os direitos reservados.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
