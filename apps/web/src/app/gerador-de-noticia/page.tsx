"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateNews } from "@/lib/n8n";

export default function NewsGenerator() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isValidUrl = (str: string) => {
    try {
      const parsed = new URL(str);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidUrl(url)) {
      setError("Por favor, insira uma URL válida");
      return;
    }

    setLoading(true);

    try {
      const result = await generateNews(url);

      if (result.success && result.slug) {
        router.push(`/noticias/${result.slug}`);
      } else {
        setError(result.error || "Erro ao gerar notícia");
      }
    } catch {
      setError("Erro ao processar sua solicitação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold">
            Gerador de Notícia
          </h1>
          <p className="mt-2 text-center text-gray-600">
            Cole o link de uma notícia para gerar conteúdo adaptado com IA
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="url" className="sr-only">
              URL da Notícia
            </label>
            <input
              id="url"
              name="url"
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Insira aqui o link da notícia"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? (
              <>
                <svg
                  className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processando...
              </>
            ) : (
              "Gerar Notícia"
            )}
          </button>
        </form>

        {loading && (
          <div className="text-center text-sm text-gray-600">
            <p>Isso pode levar até 60 segundos...</p>
            <ul className="mt-2 space-y-1 text-xs">
              <li>Analisando conteúdo original</li>
              <li>Gerando texto adaptado com IA</li>
              <li>Criando imagem personalizada</li>
              <li>Publicando artigo</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
