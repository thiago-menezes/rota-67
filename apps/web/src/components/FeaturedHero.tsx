import type { Article } from "@rota-67/shared-types";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl, getReadingTime } from "@/lib/strapi";
import { Markdown } from "./Markdown";

type Props = {
  article: Article;
};

export function FeaturedHero({ article }: Props) {
  const readingTime = getReadingTime(article.content);

  return (
    <Link
      href={`/noticias/${article.slug}`}
      className="group relative block rounded-lg overflow-hidden h-112 md:h-128"
    >
      {article.featuredImage ? (
        <Image
          src={getImageUrl(article.featuredImage.url)}
          alt={article.featuredImage.alternativeText || article.title}
          fill
          className="object-cover transform group-hover:scale-105 transition-transform duration-700"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-gray-700 to-gray-900" />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 md:p-8 max-w-2xl">
        {article.isFeatured && (
          <span className="inline-block px-2.5 py-1 bg-(--color-primary) text-(--color-dark) text-xs font-bold uppercase rounded mb-3 tracking-wide">
            Destaque
          </span>
        )}
        <h2 className="text-white text-2xl md:text-4xl font-bold leading-tight drop-shadow-md font-display group-hover:text-gray-200 transition-colors mb-3">
          {article.title}
        </h2>
        {article.excerpt && (
          <Markdown className="text-gray-300 text-sm md:text-base line-clamp-2 mb-2">
            {article.excerpt}
          </Markdown>
        )}
        <span className="text-gray-400 text-xs font-medium">
          {readingTime} min de leitura
        </span>
      </div>
    </Link>
  );
}
