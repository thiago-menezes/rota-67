import type { Article, StrapiResponse } from "@rota-67/shared-types";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function getArticles(
  page = 1,
  pageSize = 10
): Promise<StrapiResponse<Article[]>> {
  const response = await fetch(
    `${STRAPI_URL}/api/articles?populate=*&sort=publishedAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
    { next: { revalidate: 60 } }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }

  return response.json();
}

export async function getArticleBySlug(
  slug: string
): Promise<Article | null> {
  const response = await fetch(
    `${STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}&populate=*`,
    { next: { revalidate: 60 } }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch article");
  }

  const data: StrapiResponse<Article[]> = await response.json();
  return data.data[0] || null;
}

export function getImageUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${STRAPI_URL}${path}`;
}
