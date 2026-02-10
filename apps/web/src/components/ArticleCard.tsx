import type { Article } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl, getReadingTime, formatDate } from "@/lib/strapi";

type Props = {
  article: Article;
  variant?: "default" | "horizontal" | "compact";
};

export function ArticleCard({ article, variant = "default" }: Props) {
  const readingTime = getReadingTime(article.content);

  if (variant === "compact") {
    return (
      <Link
        href={`/noticias/${article.slug}`}
        className="group flex gap-3 items-start"
      >
        {article.featuredImage && (
          <div className="w-24 h-16 shrink-0 overflow-hidden rounded">
            <Image
              src={getImageUrl(article.featuredImage.url)}
              alt={article.featuredImage.alternativeText || article.title}
              width={96}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <h4 className="text-sm font-bold leading-tight group-hover:text-(--color-primary) transition-colors">
          {article.title}
        </h4>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link
        href={`/noticias/${article.slug}`}
        className="group flex flex-col sm:flex-row gap-4 items-start"
      >
        {article.featuredImage && (
          <div className="w-full sm:w-1/2 overflow-hidden rounded-lg img-hover-zoom">
            <Image
              src={getImageUrl(article.featuredImage.url)}
              alt={article.featuredImage.alternativeText || article.title}
              width={400}
              height={240}
              className="w-full h-48 object-cover"
            />
          </div>
        )}
        <div className="w-full sm:w-1/2">
          <h2 className="text-xl md:text-2xl font-bold leading-tight mb-2 group-hover:text-(--color-primary) transition-colors">
            {article.title}
          </h2>
          {article.excerpt && (
            <p className="text-sm text-(--color-text-muted) line-clamp-3">
              {article.excerpt}
            </p>
          )}
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link
      href={`/noticias/${article.slug}`}
      className="group flex flex-col h-full"
    >
      {article.featuredImage && (
        <div className="overflow-hidden rounded-lg mb-3 img-hover-zoom">
          <Image
            src={getImageUrl(article.featuredImage.url)}
            alt={article.featuredImage.alternativeText || article.title}
            width={400}
            height={240}
            className="w-full h-40 object-cover"
          />
        </div>
      )}
      <h3 className="font-bold text-lg leading-snug group-hover:text-(--color-primary) transition-colors mb-2">
        {article.title}
      </h3>
      {article.excerpt && (
        <p className="text-sm text-(--color-text-muted) line-clamp-2 mb-2">
          {article.excerpt}
        </p>
      )}
      <p className="text-xs text-(--color-text-muted) mt-auto">
        {formatDate(article.publishedAt)} • {readingTime} min de leitura
      </p>
    </Link>
  );
}
