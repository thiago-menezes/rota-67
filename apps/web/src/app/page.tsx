import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center px-4">
      <div className="max-w-2xl space-y-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight">Rota 67</h1>
        <p className="text-xl text-gray-600">
          Plataforma de geração automatizada de notícias com inteligência
          artificial. Cole o link de uma notícia e receba conteúdo adaptado em
          segundos.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/gerador-de-noticia"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Gerar Notícia
          </Link>
          <Link
            href="/noticias"
            className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-100"
          >
            Ver Notícias
          </Link>
        </div>
      </div>
    </div>
  );
}
