import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Terminal, Zap, GitBranch, BrainCircuit } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const EngineeringHub = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const runPrompt = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      setResponse(result.text || 'Sem resposta.');
    } catch (error) {
      setResponse('Erro ao executar prompt.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#E4E3E0] min-h-screen text-[#141414]">
      <header className="mb-8">
        <h1 className="text-4xl font-serif italic mb-2">Engineering Hub</h1>
        <p className="text-sm uppercase tracking-widest opacity-60">Internal Development Environment</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Prompt Sandbox */}
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-sm border border-black/5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <BrainCircuit className="w-6 h-6" />
            <h2 className="text-xl font-mono">Prompt Sandbox</h2>
          </div>
          <textarea
            className="w-full h-32 p-4 font-mono text-sm bg-slate-50 border border-black/10 rounded-lg mb-4"
            placeholder="Insira seu prompt aqui..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            onClick={runPrompt}
            disabled={loading}
            className="w-full py-3 bg-[#141414] text-[#E4E3E0] font-mono rounded-lg hover:bg-opacity-80 transition"
          >
            {loading ? 'Processando...' : 'Executar Prompt'}
          </button>
          {response && (
            <div className="mt-6 p-4 bg-slate-100 rounded-lg font-mono text-sm whitespace-pre-wrap">
              {response}
            </div>
          )}
        </motion.div>

        {/* GitHub Insights Placeholder */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-black/5">
          <div className="flex items-center gap-3 mb-4">
            <GitBranch className="w-6 h-6" />
            <h2 className="text-xl font-mono">GitHub Insights</h2>
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-black/10 rounded-lg">
            <p className="font-mono opacity-50">Métricas de repositório em breve...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineeringHub;
