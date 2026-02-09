import { NextRequest, NextResponse } from "next/server";
import type {
  NewsGenerationRequest,
  NewsGenerationResponse,
} from "@rota-67/shared-types";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";

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

    await generateImage(data);

    return NextResponse.json(data);
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
    const prompt = `A imagem deve parecer uma foto real capturada por uma câmera DSLR profissional, com iluminação natural, profundidade de campo realista, foco preciso e composição fotográfica cuidadosa.\nRetrate a cena, o ambiente ou os elementos visuais que melhor representem o significado da notícia de forma sutil e simbólica, sem uso de metáforas gráficas.\nNão incluir texto, letras, legendas, tipografia, ícones, logotipos, ilustrações ou elementos gráficos.\nEstilo: fotografia jornalística ou documental, altamente realista.\nEnquadramento: horizontal (formato 5:4).\nAparência: cores naturais, textura fotográfica autêntica, leve granulação realista de câmera, sem aparência de ilustração ou arte digital. Gere uma fotografia realista e cinematográfica, inspirada no contexto e na atmosfera da seguinte notícia: ${responseN8n.content}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
    });
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
        const buffer = Buffer.from(imageData, "base64");
        fs.writeFileSync("gemini-native-image.png", buffer);
        console.log("Image saved as gemini-native-image.png");
      }
    }

    const strapiResponse = await fetch(`${STRAPI_URL}/api/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        title: responseN8n.title,
        content: responseN8n.content,
        featuredImage: "gemini-native-image.png",
        excerpt: responseN8n.excerpt,
        slug: responseN8n.slug,
        sourceUrl: responseN8n.sourceUrl,
      }),
    });

    console.log({ strapiResponse });
  } catch (error) {
    console.error("Error generating image:", error);
  }
}
