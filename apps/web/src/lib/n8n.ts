import type { NewsGenerationRequest, NewsGenerationResponse } from "@/types";

// Use local API route to proxy to n8n (avoids CORS issues)
const NEWS_GENERATOR_API = "/api/news-generator";

export async function generateNews(
  url: string,
): Promise<NewsGenerationResponse> {
  try {
    const response = await fetch(NEWS_GENERATOR_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url } satisfies NewsGenerationRequest),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("News generation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
