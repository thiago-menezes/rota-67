import type { Article } from "@/types";
import Link from "next/link";

type Props = {
  articles: Article[];
};

export function Sidebar({ articles }: Props) {
  return (
    <div className="space-y-8">
      {/* Mais Lidas */}
      <div className="bg-white p-5 rounded-lg border border-(--color-border) shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-(--color-border) pb-2">
          <h4 className="font-black text-sm uppercase tracking-wide text-(--color-text-muted)">
            Mais Lidas
          </h4>
          <span className="w-8 h-1 bg-(--color-primary)" />
        </div>
        <ol className="flex flex-col gap-4">
          {articles.slice(0, 5).map((article, index) => (
            <li key={article.documentId} className="group">
              <Link
                href={`/noticias/${article.slug}`}
                className="flex gap-3 items-start"
              >
                <span className="text-3xl font-black text-gray-200 leading-none group-hover:text-(--color-primary) transition-colors min-w-8 text-center">
                  {index + 1}
                </span>
                <h4 className="text-sm font-bold leading-snug group-hover:text-(--color-primary) transition-colors">
                  {article.title}
                </h4>
              </Link>
            </li>
          ))}
        </ol>
      </div>

      {/* Newsletter */}
      <div className="bg-white p-5 rounded-lg border border-(--color-border) shadow-sm">
        <h4 className="font-display text-lg font-bold mb-2">
          Fique por dentro
        </h4>
        <p className="text-sm text-(--color-text-muted) mb-4">
          Receba as principais notícias direto no seu e-mail.
        </p>
        <input
          className="w-full mb-3 px-3 py-2 bg-(--color-bg) border border-(--color-border) rounded text-sm focus:outline-none focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary)"
          placeholder="Seu e-mail"
          type="email"
        />
        <button className="w-full bg-(--color-primary) text-(--color-dark) font-bold uppercase text-xs py-2.5 rounded hover:bg-(--color-primary-hover) transition-colors">
          Inscrever-se
        </button>
      </div>
    </div>
  );
}
