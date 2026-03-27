import { GoogleGenAI, Type } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    // In AI Studio, it's process.env.GEMINI_API_KEY
    // Outside, it might be import.meta.env.VITE_GEMINI_API_KEY if provided via Vite
    const apiKey = process.env.GEMINI_API_KEY || (import.meta.env ? import.meta.env.VITE_GEMINI_API_KEY : "");
    
    if (!apiKey) {
      console.error("ERRO: GEMINI_API_KEY não encontrada no ambiente. Certifique-se de configurar a chave de API.");
    }
    aiClient = new GoogleGenAI({ apiKey: apiKey || "" });
  }
  return aiClient;
}

export async function generateProjectContent(name: string, type: string, objective: string, currentHtml?: string, modificationPrompt?: string) {
  const ai = getAiClient();
  let prompt = `
    Você é um desenvolvedor frontend expert (nível engenheiro sênior).
    Seu objetivo é criar uma interface de usuário completa, moderna e responsiva baseada nos requisitos abaixo.

    Projeto: ${name}
    Tipo: ${type}
    Objetivo: ${objective}

    REGRAS ESTRITAS:
    1. O código HTML deve ser um documento completo (<html>...</html>).
    2. Use Tailwind CSS via CDN (<script src="https://cdn.tailwindcss.com"></script>) no <head>.
    3. O design deve ser premium, minimalista, focado em conversão e com estética "Lovable/Vercel" (cores neutras, bordas sutis, glassmorphism, tipografia limpa como Inter).
    4. Use ícones do Lucide (via CDN ou SVG inline) ou FontAwesome se necessário.
    5. Para imagens, use placeholders do Unsplash (ex: https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80).
    6. O código deve ser 100% responsivo (mobile-first).
    7. Adicione interatividade básica com JavaScript puro (vanilla JS) no final do <body> se necessário (ex: menu mobile, modais).
    8. Retorne APENAS o JSON válido com a propriedade "html".
  `;

  if (currentHtml && modificationPrompt) {
    prompt = `
      Você é um desenvolvedor frontend expert.
      Aqui está o código HTML atual de um projeto:
      \`\`\`html
      ${currentHtml}
      \`\`\`

      O usuário pediu a seguinte alteração: "${modificationPrompt}"

      Retorne o código HTML COMPLETO e atualizado, mantendo o que estava bom e aplicando a alteração.
      Mantenha o Tailwind CSS via CDN e todas as regras de design premium.
      Retorne APENAS o JSON válido com a propriedade "html".
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            html: { type: Type.STRING }
          },
          required: ["html"]
        }
      }
    });

    const text = response.text || "{}";
    // Try to extract JSON if it's wrapped in markdown or has extra text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : text;
    return JSON.parse(jsonString);
  } catch (error: any) {
    console.error("Erro ao gerar conteúdo com Gemini:", error);
    if (error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED' || error?.message?.includes('Quota exceeded')) {
      throw new Error("O limite de requisições da inteligência artificial foi atingido. Por favor, aguarde cerca de 1 minuto e tente novamente.");
    }
    throw error;
  }
}
