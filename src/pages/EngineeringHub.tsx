import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Terminal, Zap, GitBranch, BrainCircuit, Database, Lightbulb, RefreshCw } from 'lucide-react';
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const EngineeringHub = () => {
  const [context, setContext] = useState('');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [useCoT, setUseCoT] = useState(false);

  const runPrompt = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse('');
    
    try {
      const apiKey = process.env.GEMINI_API_KEY || '';
      const ai = new GoogleGenAI({ apiKey });
      
      let finalPrompt = prompt;
      if (context.trim()) {
        finalPrompt = `Contexto fornecido:\n${context}\n\nCom base no contexto acima, responda à seguinte pergunta ou instrução:\n${prompt}`;
      }

      const modelName = useCoT ? "gemini-3.1-pro-preview" : "gemini-3-flash-preview";
      
      const config: any = {};
      if (useCoT) {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
        config.systemInstruction = "Você é um assistente de engenharia avançado. Pense passo a passo e explique seu raciocínio detalhadamente antes de dar a resposta final.";
      }

      const result = await ai.models.generateContent({
        model: modelName,
        contents: finalPrompt,
        config: Object.keys(config).length > 0 ? config : undefined,
      });
      
      setResponse(result.text || 'Sem resposta.');
    } catch (error) {
      console.error(error);
      setResponse('Erro ao executar prompt. Verifique o console para mais detalhes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#E4E3E0] min-h-screen text-[#141414]">
      <header className="mb-8">
        <h1 className="text-4xl font-serif italic mb-2">Orquestração de IA</h1>
        <p className="text-sm uppercase tracking-widest opacity-60">RAG & Chain-of-Thought Playground</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Config & Input */}
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-sm border border-black/5 flex flex-col gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-indigo-500" />
              <h2 className="text-xl font-mono font-bold">Base de Conhecimento (RAG)</h2>
            </div>
            <p className="text-sm text-gray-500 mb-2">Insira o contexto que a IA deve usar para responder à sua pergunta.</p>
            <textarea
              className="w-full h-32 p-4 font-mono text-sm bg-slate-50 border border-black/10 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Cole documentos, artigos ou dados aqui..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <BrainCircuit className="w-6 h-6 text-purple-500" />
              <h2 className="text-xl font-mono font-bold">Prompt & Configuração</h2>
            </div>
            
            <div className="flex items-center gap-3 mb-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
              <input 
                type="checkbox" 
                id="cot-toggle" 
                checked={useCoT}
                onChange={(e) => setUseCoT(e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="cot-toggle" className="flex flex-col cursor-pointer">
                <span className="font-bold text-sm text-purple-900 flex items-center gap-2">
                  <Lightbulb size={16} />
                  Ativar Chain-of-Thought (Raciocínio Avançado)
                </span>
                <span className="text-xs text-purple-700">Usa o modelo Gemini 3.1 Pro com nível de pensamento ALTO.</span>
              </label>
            </div>

            <textarea
              className="w-full h-32 p-4 font-mono text-sm bg-slate-50 border border-black/10 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              placeholder="O que você deseja saber com base no contexto?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            
            <button
              onClick={runPrompt}
              disabled={loading || !prompt.trim()}
              className="w-full py-3 bg-[#141414] text-[#E4E3E0] font-mono font-bold rounded-lg hover:bg-opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Executar Prompt
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Output */}
        <motion.div 
          className="bg-[#141414] p-6 rounded-xl shadow-sm border border-black/5 text-[#E4E3E0] flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-mono font-bold">Output</h2>
          </div>
          
          <div className="flex-1 bg-black/50 rounded-lg p-6 overflow-y-auto border border-white/10 font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {loading ? (
              <div className="flex items-center justify-center h-full text-emerald-400/50 animate-pulse">
                Gerando resposta...
              </div>
            ) : response ? (
              response
            ) : (
              <span className="text-white/30">O resultado aparecerá aqui...</span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EngineeringHub;
