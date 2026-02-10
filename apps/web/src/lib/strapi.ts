import type { Article, StrapiResponse } from "@/types";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_API_KEY = process.env.STRAPI_API_KEY;

const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (STRAPI_API_KEY) {
    headers["Authorization"] = `Bearer ${STRAPI_API_KEY}`;
  }
  return headers;
};

export async function getArticles(
  page = 1,
  pageSize = 10,
): Promise<StrapiResponse<Article[]>> {
  const response = await fetch(
    `${STRAPI_URL}/api/articles?populate=*&sort=publishedAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
    {
      headers: getHeaders(),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    console.error(
      "Failed to fetch articles:",
      response.status,
      response.statusText,
    );
    throw new Error("Failed to fetch articles");
  }

  return response.json();
}

export async function getFeaturedArticles(
  limit = 5,
): Promise<StrapiResponse<Article[]>> {
  const response = await fetch(
    `${STRAPI_URL}/api/articles?populate=*&filters[isFeatured][$eq]=true&sort=publishedAt:desc&pagination[pageSize]=${limit}`,
    {
      headers: getHeaders(),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    console.error(
      "Failed to fetch featured articles:",
      response.status,
      response.statusText,
    );
    throw new Error("Failed to fetch featured articles");
  }

  return response.json();
}

export async function getLatestArticles(
  limit = 12,
  excludeIds: string[] = [],
): Promise<StrapiResponse<Article[]>> {
  let url = `${STRAPI_URL}/api/articles?populate=*&sort=publishedAt:desc&pagination[pageSize]=${limit}`;

  excludeIds.forEach((id, i) => {
    url += `&filters[documentId][$ne][${i}]=${id}`;
  });

  const response = await fetch(url, {
    headers: getHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    console.error(
      "Failed to fetch latest articles:",
      response.status,
      response.statusText,
    );
    throw new Error("Failed to fetch latest articles");
  }

  return response.json();
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const response = await fetch(
    `${STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}&populate=*`,
    {
      headers: getHeaders(),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    console.error(
      "Failed to fetch article:",
      response.status,
      response.statusText,
    );
    throw new Error("Failed to fetch article");
  }

  const data: StrapiResponse<Article[]> = await response.json();
  return data.data[0] || null;
}

export function getImageUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${STRAPI_URL}${path}`;
}

export function getReadingTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
