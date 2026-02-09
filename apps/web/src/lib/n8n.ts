import type {
  NewsGenerationRequest,
  NewsGenerationResponse,
} from "@rota-67/shared-types";

const N8N_WEBHOOK =
  process.env.NEXT_PUBLIC_N8N_WEBHOOK ||
  "http://localhost:5678/webhook/news-generator";

export async function generateNews(
  url: string
): Promise<NewsGenerationResponse> {
  try {
    const response = await fetch(N8N_WEBHOOK, {
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
