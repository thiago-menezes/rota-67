import { notFound } from "next/navigation";
import {
  getArticleBySlug,
  getArticles,
  getImageUrl,
  getReadingTime,
  formatDate,
} from "@/lib/strapi";
import type { Article } from "@rota-67/shared-types";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArticleCard } from "@/components/ArticleCard";
import { Markdown } from "@/components/Markdown";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Notícia não encontrada" };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.featuredImage
        ? [getImageUrl(article.featuredImage.url)]
        : [],
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Remove title from beginning of content to avoid duplication
  let content = article.content;
  const titlePattern = new RegExp(
    `^#\\s*${article.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\n?`,
    "i",
  );
  content = content.replace(titlePattern, "");

  const readingTime = getReadingTime(article.content);

  // Fetch related articles for sidebar
  let relatedArticles: Article[];
  try {
    const related = await getArticles(1, 6);
    relatedArticles = related.data.filter(
      (a) => a.documentId !== article.documentId,
    );
  } catch {
    relatedArticles = [];
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-16">
        {/* ── Title ──────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="font-display font-black text-3xl md:text-4xl lg:text-5xl leading-tight mb-4">
            {article.title}
          </h1>
          {article.excerpt && <Markdown>{article.excerpt}</Markdown>}
        </div>

        {/* ── Meta bar ───────────────────────────────────── */}
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between border-y border-(--color-border) py-4 mb-8">
          <div className="text-sm mb-2 md:mb-0">
            <span className="text-(--color-text-muted)">
              {formatDate(article.publishedAt)} • {readingTime} min de leitura
            </span>
          </div>
          <div className="flex space-x-4 text-(--color-text-muted)">
            <button className="hover:text-(--color-primary) transition-colors text-sm font-semibold">
              Compartilhar
            </button>
          </div>
        </div>

        {/* ── Content grid ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Article */}
          <article className="lg:col-span-8">
            {/* Featured image */}
            {article.featuredImage && (
              <figure className="mb-10">
                <div className="relative w-full aspect-video rounded overflow-hidden shadow-sm">
                  <Image
                    src={getImageUrl(article.featuredImage.url)}
                    alt={article.featuredImage.alternativeText || article.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </figure>
            )}

            <Markdown>{content}</Markdown>

            {/* Source */}
            {article.sourceUrl && (
              <div className="mt-10 p-6 border-y-2 border-gray-200 bg-(--color-bg)">
                <p className="text-sm text-(--color-text-muted)">
                  Fonte original:{" "}
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-(--color-primary) hover:underline font-semibold"
                  >
                    {new URL(article.sourceUrl).hostname}
                  </a>
                </p>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Related articles */}
            <div className="bg-white p-5 rounded-lg border border-(--color-border) shadow-sm">
              <h3 className="font-black text-sm uppercase tracking-wide text-(--color-primary) mb-4">
                Mais Notícias
              </h3>
              <div className="space-y-5">
                {relatedArticles.slice(0, 4).map((related) => (
                  <div
                    key={related.documentId}
                    className="border-b border-(--color-border) pb-4 last:border-0 last:pb-0"
                  >
                    <ArticleCard article={related} variant="compact" />
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* ── More articles grid ─────────────────────────── */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-10 border-t border-(--color-border)">
            <h3 className="text-2xl font-black mb-6 border-l-4 border-(--color-primary) pl-3 uppercase tracking-tight">
              Mais Notícias
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {relatedArticles.slice(0, 4).map((related) => (
                <ArticleCard key={related.documentId} article={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
