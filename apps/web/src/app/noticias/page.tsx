import { getArticles, getImageUrl } from "@/lib/strapi";
import Image from "next/image";
import Link from "next/link";

export default async function NewsListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;
  const { data: articles, meta } = await getArticles(page, 10);

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-4xl font-bold">Notícias</h1>

        {articles.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-600">Nenhuma notícia publicada ainda.</p>
            <Link
              href="/gerador-de-noticia"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              Gerar primeira notícia
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.documentId}
                  href={`/noticias/${article.slug}`}
                  className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-xl"
                >
                  {article.featuredImage && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={getImageUrl(article.featuredImage.url)}
                        alt={
                          article.featuredImage.alternativeText || article.title
                        }
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h2 className="mb-2 line-clamp-2 text-xl font-semibold">
                      {article.title}
                    </h2>
                    <p className="line-clamp-3 text-sm text-gray-600">
                      {article.excerpt}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(article.publishedAt).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {meta.pagination && meta.pagination.pageCount > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from(
                  { length: meta.pagination.pageCount },
                  (_, i) => i + 1
                ).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/noticias?page=${pageNum}`}
                    className={`rounded px-4 py-2 ${
                      pageNum === page
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
