import { NextRequest, NextResponse } from "next/server";
import type {
  NewsGenerationRequest,
  NewsGenerationResponse,
} from "@rota-67/shared-types";
import { GoogleGenAI } from "@google/genai";

const N8N_WEBHOOK = process.env.N8N_WEBHOOK;
const STRAPI_URL = process.env.STRAPI_URL;

type NewsN8nResponse = {
  content: string;
  excerpt: string;
  imagePrompt: string;
  slug: string;
  sourceUrl: string;
  title: string;
};

export async function POST(request: NextRequest) {
  try {
    const body: NewsGenerationRequest = await request.json();

    if (!N8N_WEBHOOK) {
      return NextResponse.json(
        {
          success: false,
          error: "N8N_WEBHOOK is not defined",
        } satisfies NewsGenerationResponse,
        { status: 500 },
      );
    }

    const response = await fetch(N8N_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log({ response });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        } satisfies NewsGenerationResponse,
        { status: response.status },
      );
    }

    const data = (await response.json()) as NewsN8nResponse;

    return await generateImage(data);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      } satisfies NewsGenerationResponse,
      { status: 500 },
    );
  }
}

async function generateImage(responseN8n: NewsN8nResponse) {
  const ai = new GoogleGenAI({});

  try {
    const prompt = `IMPORTANT: The image MUST be generated in HORIZONTAL orientation (landscape), with width greater than height.
The image should look like a real photo captured by a professional DSLR camera, with natural lighting, realistic depth of field, precise focus, and careful photographic composition.
Portray the scene, environment, or visual elements that best represent the meaning of the news in a subtle and symbolic way, without the use of graphic metaphors.
Do not include text, letters, captions, typography, icons, logos, illustrations, or graphic elements.
CRITICAL: The image must NOT contain any graphic elements such as charts, diagrams, infographics, or visual overlays.
CRITICAL: If the scene naturally contains readable text (such as signs, newspapers, billboards, storefronts, or documents), ensure there are NO spelling errors or typos. Prefer to keep text blurred, out of focus, or at an angle where it is not fully readable to avoid orthographic mistakes.
Style: journalistic or documentary photography, highly realistic.
Framing: horizontal (16:9 or 5:4 format, landscape).
Appearance: natural colors, authentic photographic texture, slight realistic camera grain, no illustration or digital art appearance.
Generate a realistic and cinematic photograph, inspired by the context and atmosphere of the following news article: ${responseN8n.content}
Please respond in Portuguese (Brazilian).`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
    });

    let imageBuffer: Buffer | null = null;

    for (const part of response?.candidates?.[0]?.content?.parts as {
      text: string;
      inlineData: {
        data: string;
        mimeType: string;
      };
    }[]) {
      if (part.text) {
        console.log(part?.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        imageBuffer = Buffer.from(imageData, "base64");
        console.log("Image generated successfully");
      }
    }

    const articleData = {
      title: responseN8n.title,
      content: responseN8n.content,
      excerpt: responseN8n.excerpt,
      slug: responseN8n.slug,
      sourceUrl: responseN8n.sourceUrl,
    };

    console.log("Creating article in Strapi:", articleData);

    const strapiResponse = await fetch(`${STRAPI_URL}/api/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
      },
      body: JSON.stringify({ data: articleData }),
    });

    if (!strapiResponse.ok) {
      const errorData = await strapiResponse.json();
      console.error("Strapi create article error:", errorData);
      return NextResponse.json(
        { success: false, error: "Failed to create article in Strapi" },
        { status: strapiResponse.status },
      );
    }

    const createdArticle = await strapiResponse.json();
    const articleId = createdArticle.data?.documentId;
    console.log("Article created with ID:", articleId);

    if (imageBuffer && articleId) {
      const formData = new FormData();

      const imageBlob = new Blob([new Uint8Array(imageBuffer)], {
        type: "image/png",
      });
      formData.append("files", imageBlob, `${responseN8n.slug}.png`);

      console.log("Uploading image...");

      const uploadResponse = await fetch(`${STRAPI_URL}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        const uploadError = await uploadResponse.json();
        console.error("Strapi upload error:", uploadError);
      } else {
        const uploadedFiles = await uploadResponse.json();
        const fileId = uploadedFiles[0]?.id;
        console.log("Image uploaded with ID:", fileId);

        if (fileId) {
          const updateResponse = await fetch(
            `${STRAPI_URL}/api/articles/${articleId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
              },
              body: JSON.stringify({
                data: {
                  featuredImage: fileId,
                },
              }),
            },
          );

          if (!updateResponse.ok) {
            const updateError = await updateResponse.json();
            console.error("Failed to link image to article:", updateError);
          } else {
            console.log("Image linked to article successfully");
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      title: responseN8n.title,
      content: responseN8n.content,
      excerpt: responseN8n.excerpt,
      slug: responseN8n.slug,
      sourceUrl: responseN8n.sourceUrl,
      articleId,
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Image generation failed",
      },
      { status: 500 },
    );
  }
}
