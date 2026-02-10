import { getArticles, getFeaturedArticles } from "@/lib/strapi";
import Link from "next/link";
import { FeaturedHero } from "@/components/FeaturedHero";
import { ArticleCard } from "@/components/ArticleCard";
import { Sidebar } from "@/components/Sidebar";
import type { Article } from "@/types";

export const dynamic = "force-dynamic";

export default async function NewsListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;

  // Fetch featured + all articles
  let featuredArticles: Article[];
  try {
    const featured = await getFeaturedArticles(3);
    featuredArticles = featured.data;
  } catch {
    featuredArticles = [];
  }

  const { data: allArticles, meta } = await getArticles(page, 12);

  // If no featured articles, use the first articles as featured
  const heroArticle =
    featuredArticles.length > 0 ? featuredArticles[0] : allArticles[0];
  const secondaryFeatured =
    featuredArticles.length > 1
      ? featuredArticles.slice(1, 3)
      : allArticles.slice(1, 3);

  // Grid articles = all except those used as featured
  const featuredIds = new Set([
    heroArticle?.documentId,
    ...secondaryFeatured.map((a) => a.documentId),
  ]);
  const gridArticles = allArticles.filter(
    (a) => !featuredIds.has(a.documentId),
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {allArticles.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="text-2xl font-bold mb-4 font-display">
              Nenhuma notícia publicada ainda
            </h2>
          </div>
        ) : (
          <>
            {/* ── Hero + Secondary ────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              {/* Main hero */}
              <div className="lg:col-span-8">
                {heroArticle && <FeaturedHero article={heroArticle} />}
              </div>

              {/* Secondary featured */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                {secondaryFeatured.map((article) => (
                  <ArticleCard
                    key={article.documentId}
                    article={article}
                    variant="horizontal"
                  />
                ))}
              </div>
            </div>

            {/* ── Grid + Sidebar ─────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-(--color-border)">
              {/* Article grid */}
              <div className="lg:col-span-8">
                <h2 className="text-2xl font-black mb-6 border-l-4 border-(--color-primary) pl-3 uppercase tracking-tight">
                  Últimas Notícias
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {gridArticles.map((article) => (
                    <ArticleCard key={article.documentId} article={article} />
                  ))}
                </div>

                {/* Pagination */}
                {meta.pagination && meta.pagination.pageCount > 1 && (
                  <div className="mt-10 flex justify-center gap-2">
                    {Array.from(
                      { length: meta.pagination.pageCount },
                      (_, i) => i + 1,
                    ).map((pageNum) => (
                      <Link
                        key={pageNum}
                        href={`/noticias?page=${pageNum}`}
                        className={`rounded px-4 py-2 font-semibold text-sm transition-colors ${
                          pageNum === page
                            ? "bg-(--color-primary) text-(--color-dark)"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-(--color-border)"
                        }`}
                      >
                        {pageNum}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-4">
                <Sidebar articles={allArticles} />
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
