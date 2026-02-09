// Strapi v5 types — flat structure (no `attributes` nesting)

export interface StrapiImage {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  formats?: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
}

export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
}

export interface Article {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: StrapiImage;
  sourceUrl: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface NewsGenerationRequest {
  url: string;
}

export interface NewsGenerationResponse {
  success: boolean;
  slug?: string;
  error?: string;
  message?: string;
}
