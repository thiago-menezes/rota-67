import { notFound } from "next/navigation";
import { getArticleBySlug, getImageUrl } from "@/lib/strapi";
import Image from "next/image";
import { marked } from "marked";
import type { Metadata } from "next";

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

  const htmlContent = await marked(article.content);

  return (
    <article className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-lg bg-white shadow-lg">
        {article.featuredImage && (
          <div className="relative h-96 w-full">
            <Image
              src={getImageUrl(article.featuredImage.url)}
              alt={article.featuredImage.alternativeText || article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="p-8">
          <div className="mb-4 text-sm text-gray-500">
            {new Date(article.publishedAt).toLocaleDateString("pt-BR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          <h1 className="mb-6 text-4xl font-bold">{article.title}</h1>

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {article.sourceUrl && (
            <div className="mt-8 border-t border-gray-200 pt-8">
              <p className="text-sm text-gray-600">
                Fonte original:{" "}
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {new URL(article.sourceUrl).hostname}
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
