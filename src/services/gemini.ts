import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("ERRO: GEMINI_API_KEY não encontrada no ambiente.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export async function generateProjectContent(name: string, type: string, objective: string) {
  const prompt = `
    Crie um conteúdo estruturado EM PORTUGUÊS DO BRASIL para um projeto chamado "${name}".
    Tipo: ${type}
    Objetivo: ${objective}
    
    O conteúdo deve ser um objeto JSON contendo:
    - title: Título impactante em português
    - description: Descrição curta e persuasiva em português
    - sections: Um array de seções, cada uma com:
      - id: Identificador único
      - type: 'hero' | 'features' | 'about' | 'cta' | 'contact'
      - title: Título da seção em português
      - content: Texto principal da seção em português
      - items: (opcional) Array de strings para listas ou cards em português
    - theme: Cores sugeridas (primary, secondary, accent)
    
    Retorne APENAS o JSON válido.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                  items: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["id", "type", "title", "content"]
              }
            },
            theme: {
              type: Type.OBJECT,
              properties: {
                primary: { type: Type.STRING },
                secondary: { type: Type.STRING },
                accent: { type: Type.STRING }
              }
            }
          },
          required: ["title", "description", "sections"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    console.error("Erro ao gerar conteúdo com Gemini:", error);
    if (error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED' || error?.message?.includes('Quota exceeded')) {
      throw new Error("O limite de requisições da inteligência artificial foi atingido. Por favor, aguarde cerca de 1 minuto e tente novamente.");
    }
    throw error;
  }
}
