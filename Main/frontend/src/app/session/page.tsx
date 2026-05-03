"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight, ArrowLeft, Bug, Lightbulb, CheckCircle2, AlertTriangle, AlertCircle, Sparkles, Send, MessageSquare, Download, Bot } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Composant pour l'effet Voie Lactée (identique à l'accueil)
const StarryBackground = () => {
  const [stars, setStars] = useState<{ id: number, top: string, left: string, size: string, delay: string, duration: string, opacity: number }[]>([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 4 + 2}s`,
      opacity: Math.random() * 0.6 + 0.2
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-[#070b19]"></div>
      <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-purple-900/20 blur-[150px]"></div>
      <div className="absolute top-[30%] -right-[10%] w-[60%] h-[60%] rounded-full bg-fuchsia-900/10 blur-[150px]"></div>
      
      {stars.map((star) => (
        <div 
          key={star.id} 
          className="absolute bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            animationDuration: star.duration,
            opacity: star.opacity
          }}
        />
      ))}
    </div>
  );
};

export default function SessionPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    description: "",
    expectedBehavior: "",
    actualBehavior: "",
    hypothesis: "",
    testDescription: "",
    testResult: ""
  });

  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isChatLoading]);

  const handleSubmit = async () => {
    setLoading(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setAnalysis(data.analysis);
      
      const question = data.analysis.suggestions.find((s:string) => s.includes('?')) || "Comment comptez-vous ajuster votre approche avec ces informations ?";
      setChatMessages([{ role: "assistant", content: question }]);

    } catch (error) {
      console.error("Erreur API", error);
      const fallbackAnalysis = {
        issuesDetected: ["Vous confondez la cause et le symptôme.", "Votre hypothèse est trop floue et non testable directement."],
        suggestions: ["Isolez la fonction responsable de l'affichage en premier lieu.", "Quelle variable pourrait être 'undefined' à ce stade précis ?"]
      };
      setAnalysis(fallbackAnalysis);
      setChatMessages([{ role: "assistant", content: fallbackAnalysis.suggestions[1] }]);
    }
    setLoading(false);
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = { role: "user", content: chatInput };
    const newMessages = [...chatMessages, userMessage];
    setChatMessages(newMessages);
    setChatInput("");
    setIsChatLoading(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          context: formData
        })
      });
      const data = await response.json();
      setChatMessages([...newMessages, { role: "assistant", content: data.message }]);
    } catch (error) {
      console.error("Erreur Chat", error);
      setChatMessages([...newMessages, { role: "assistant", content: "Désolé, je suis déconnecté temporairement. (Erreur Serveur)" }]);
    }
    setIsChatLoading(false);
  };

  const handleExport = () => {
    if (!analysis) return;
    const content = `--- SESSION DEBUG JANGAAT ---
    
Description du bug : ${formData.description}
Attendu : ${formData.expectedBehavior}
Réel : ${formData.actualBehavior}
Hypothèse : ${formData.hypothesis}

--- ANALYSE DE L'IA ---

Failles détectées :
${analysis.issuesDetected.map((i: string) => "- " + i).join('\n')}

Suggestions du mentor :
${analysis.suggestions.map((i: string) => "- " + i).join('\n')}

--- DISCUSSION ---
${chatMessages.map(m => `[${m.role.toUpperCase()}] : ${m.content}`).join('\n\n')}
    `;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "session_debug_jangaat.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 text-purple-400 mb-2">
              <Bug size={32} />
              <h2 className="text-3xl font-bold text-slate-100">1. Décrivez votre bug</h2>
            </div>
            <p className="text-lg text-slate-300">Expliquez le problème avec vos propres mots. Plus vous serez précis, mieux nous pourrons analyser votre réflexion.</p>
            <textarea 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Ex: Le bouton de validation du formulaire de paiement ne fait rien quand je clique dessus sur mobile."
              className="w-full min-h-[160px] p-6 text-lg rounded-2xl border border-slate-700 bg-slate-800/50 text-slate-200 placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none shadow-inner"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center gap-3 text-purple-400 mb-2">
              <CheckCircle2 size={32} />
              <h2 className="text-3xl font-bold text-slate-100">2. Attendu vs Réel</h2>
            </div>
            <p className="text-lg text-slate-300">Séparez clairement ce qui devrait se passer de ce qui se passe réellement.</p>
            
            <div className="space-y-6 mt-4">
              <div>
                <label className="block text-base font-semibold text-emerald-400 mb-2">Comportement Attendu</label>
                <textarea 
                  value={formData.expectedBehavior}
                  onChange={e => setFormData({...formData, expectedBehavior: e.target.value})}
                  className="w-full min-h-[100px] p-5 text-lg rounded-2xl border border-emerald-900/50 bg-emerald-950/20 text-slate-200 focus:border-emerald-500 focus:ring-2 outline-none transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-rose-400 mb-2">Comportement Réel</label>
                <textarea 
                  value={formData.actualBehavior}
                  onChange={e => setFormData({...formData, actualBehavior: e.target.value})}
                  className="w-full min-h-[100px] p-5 text-lg rounded-2xl border border-rose-900/50 bg-rose-950/20 text-slate-200 focus:border-rose-500 focus:ring-2 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center gap-3 text-amber-400 mb-2">
              <Lightbulb size={32} />
              <h2 className="text-3xl font-bold text-slate-100">3. Votre Hypothèse</h2>
            </div>
            <p className="text-lg text-slate-300">D'après vous, d'où vient le problème ?</p>
            <textarea 
              value={formData.hypothesis}
              onChange={e => setFormData({...formData, hypothesis: e.target.value})}
              className="w-full min-h-[160px] p-6 text-lg rounded-2xl border border-amber-900/50 bg-amber-950/20 text-slate-200 focus:border-amber-500 focus:ring-2 outline-none transition-all resize-none"
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center gap-3 text-cyan-400 mb-2">
              <AlertTriangle size={32} />
              <h2 className="text-3xl font-bold text-slate-100">4. Tests effectués</h2>
            </div>
            
            <div className="space-y-6 mt-4">
              <div>
                <label className="block text-base font-semibold text-cyan-400 mb-2">Action de test</label>
                <input 
                  type="text"
                  value={formData.testDescription}
                  onChange={e => setFormData({...formData, testDescription: e.target.value})}
                  className="w-full p-5 text-lg rounded-xl border border-cyan-900/50 bg-cyan-950/20 text-slate-200 focus:border-cyan-500 focus:ring-2 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-cyan-400 mb-2">Résultat du test</label>
                <input 
                  type="text"
                  value={formData.testResult}
                  onChange={e => setFormData({...formData, testResult: e.target.value})}
                  className="w-full p-5 text-lg rounded-xl border border-cyan-900/50 bg-cyan-950/20 text-slate-200 focus:border-cyan-500 focus:ring-2 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        );
    }
  };

  if (analysis) {
    return (
      <div className="h-screen bg-[#070b19] text-slate-200 flex flex-col overflow-hidden relative font-sans">
        
        <StarryBackground />

        {/* Header */}
        <header className="relative z-10 flex justify-between items-center px-8 py-5 border-b border-slate-800/60 bg-[#070b19]/80 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => { setAnalysis(null); setStep(1); setChatMessages([]); }}
              className="text-slate-300 hover:text-white flex items-center gap-2 transition-colors text-base font-medium"
            >
              <ArrowLeft size={18} /> Recommencer
            </button>
            <div className="h-6 w-px bg-slate-800"></div>
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Jangaat Logo" width={32} height={32} className="rounded-md opacity-90" />
              <span className="font-bold tracking-widest text-slate-100 text-lg">JANGAAT</span>
            </div>
          </div>
          
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700 text-slate-200 px-5 py-2.5 rounded-xl text-base font-medium transition-colors border border-slate-700/50"
          >
            <Download size={18} /> Exporter la session
          </button>
        </header>

        {/* Main Content: Split View */}
        <div className="relative z-10 flex-grow flex overflow-hidden">
          
          {/* Left Column: Analysis Results */}
          <div className="w-1/3 min-w-[400px] max-w-[500px] border-r border-slate-800/60 flex flex-col bg-[#0f1524]/40 backdrop-blur-sm">
            <div className="p-8 border-b border-slate-800/50 shrink-0">
               <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
                 <Sparkles className="text-purple-400" size={24} /> Analyse du Bug
               </h2>
               <p className="text-slate-400 text-sm">Aperçu de la méthode scientifique</p>
            </div>
            
            <div className="flex-grow overflow-y-auto custom-scrollbar p-8 space-y-8">
              
              {/* Failles */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-rose-400">
                  <AlertCircle size={20} />
                  <h3 className="font-semibold text-base uppercase tracking-wider text-rose-400/80">Failles Détectées</h3>
                </div>
                <div className="space-y-4">
                  {analysis.issuesDetected.map((issue: string, i: number) => (
                    <div key={i} className="bg-[#1a1219]/50 border border-rose-900/30 p-5 rounded-xl text-base text-slate-200 shadow-sm leading-relaxed">
                      {issue}
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px w-full bg-slate-800/50"></div>

              {/* Suggestions */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Lightbulb size={20} />
                  <h3 className="font-semibold text-base uppercase tracking-wider text-emerald-400/80">Pistes & Suggestions</h3>
                </div>
                <div className="space-y-4">
                  {analysis.suggestions.map((sug: string, i: number) => {
                    const isQuestion = sug.includes("?");
                    return (
                      <div key={i} className={`p-5 rounded-xl text-base shadow-sm leading-relaxed border ${
                        isQuestion 
                          ? 'bg-purple-900/10 border-purple-500/20 text-purple-100' 
                          : 'bg-[#121a16]/50 border-emerald-900/30 text-slate-200'
                      }`}>
                        {sug}
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: JOOB Sensei AI Chat */}
          <div className="flex-grow flex flex-col bg-[#070b19]/40 relative">
            
            <div className="p-6 border-b border-slate-800/50 flex justify-between items-center shrink-0 backdrop-blur-md bg-[#070b19]/80">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-500 p-[2px] shadow-lg shadow-purple-500/20">
                  <div className="w-full h-full bg-[#070b19] rounded-full flex items-center justify-center">
                    <Bot size={24} className="text-fuchsia-400" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-wide">JOOB Sensei AI</h2>
                  <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                    Mentor connecté
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-grow overflow-y-auto custom-scrollbar p-8 space-y-6">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-10 h-10 rounded-full bg-purple-900/30 border border-purple-500/30 flex items-center justify-center mr-4 shrink-0 mt-1">
                      <Bot size={20} className="text-purple-400" />
                    </div>
                  )}
                  <div className={`px-6 py-4 max-w-[75%] shadow-sm text-lg leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-purple-600 text-white rounded-3xl rounded-tr-sm' 
                      : 'bg-slate-800 border border-slate-700 text-slate-100 rounded-3xl rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="w-10 h-10 rounded-full bg-purple-900/30 border border-purple-500/30 flex items-center justify-center mr-4 shrink-0 mt-1">
                      <Bot size={20} className="text-purple-400" />
                  </div>
                  <div className="bg-slate-800 text-slate-400 rounded-3xl rounded-tl-sm px-6 py-4 border border-slate-700 flex gap-2 h-14 items-center">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} className="h-4" />
            </div>

            <div className="p-8 bg-gradient-to-t from-[#070b19] to-transparent shrink-0">
               <div className="relative max-w-4xl mx-auto">
                 <textarea 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendChat(); } }}
                    placeholder="Répondez à JOOB Sensei..."
                    className="w-full bg-slate-900/80 border border-slate-700 focus:border-purple-500 text-slate-100 rounded-2xl pl-6 pr-16 py-5 focus:ring-1 focus:ring-purple-500/50 outline-none resize-none shadow-xl transition-colors backdrop-blur-md text-lg"
                    rows={2}
                 />
                 <button 
                    onClick={handleSendChat}
                    disabled={!chatInput.trim() || isChatLoading}
                    className="absolute right-4 bottom-4 p-3 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-all shadow-md active:scale-95"
                 >
                   <Send size={24} />
                 </button>
               </div>
            </div>

            {/* Black J Logo Bottom Right */}
            <div className="absolute bottom-6 right-6 opacity-20 select-none pointer-events-none">
              <Image src="/logo.png" alt="Jangaat Logo" width={50} height={50} className="rounded-lg" />
            </div>

          </div>
        </div>
      </div>
    );
  }

  // The rest of the initial wizard (if !analysis)
  return (
    <div className="min-h-screen bg-[#070b19] text-slate-200 py-12 px-4 sm:px-6 flex flex-col items-center justify-center relative overflow-hidden font-sans">
      
      <StarryBackground />

      <div className="relative z-10 max-w-3xl w-full">
        
        {/* Header & Progress */}
        <div className="mb-8 flex items-center justify-between px-2">
          <Link href="/" className="text-slate-400 hover:text-slate-100 transition-colors flex items-center gap-3 text-lg font-medium">
            <ArrowLeft size={20} /> Retour
          </Link>
          <div className="flex items-center gap-6">
            <Image src="/icon.png" alt="Jangaat Logo" width={36} height={36} className="rounded-md opacity-90" />
            <div className="flex gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`h-2 w-12 rounded-full transition-all duration-500 ${step >= i ? 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-slate-800'}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-12 shadow-2xl border border-slate-800/80 min-h-[550px] flex flex-col justify-between relative overflow-hidden">
          
          {loading ? (
             <div className="absolute inset-0 z-50 bg-[#070b19]/80 backdrop-blur-md flex flex-col items-center justify-center">
               <div className="w-20 h-20 border-4 border-slate-800 border-t-purple-500 rounded-full animate-spin mb-8 shadow-[0_0_30px_rgba(168,85,247,0.3)]"></div>
               <p className="text-slate-100 font-bold animate-pulse text-2xl">JOOB Sensei analyse votre démarche...</p>
             </div>
          ) : null}

          <div className="flex-grow pt-2">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-14 pt-8 border-t border-slate-800/50">
            <button 
              onClick={handlePrev} 
              disabled={step === 1}
              className={`font-medium text-lg px-6 py-3 rounded-xl transition-colors ${step === 1 ? 'text-slate-700 cursor-not-allowed' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
            >
              Précédent
            </button>
            
            {step < 4 ? (
              <button 
                onClick={handleNext}
                className="flex items-center gap-3 bg-slate-800/80 hover:bg-slate-700 text-slate-50 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-slate-900/50 border border-slate-700/50"
              >
                Suivant <ArrowRight size={20} />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                className="flex items-center gap-3 bg-purple-600 hover:bg-purple-500 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
              >
                <Bot size={22} /> Soumettre à JOOB Sensei
              </button>
            )}
          </div>

        </div>
      </div>
      
      {/* Black J Logo Bottom Right */}
      <div className="fixed bottom-8 right-8 opacity-20 select-none pointer-events-none z-0">
         <Image src="/logo.png" alt="Jangaat Logo" width={60} height={60} className="rounded-xl" />
      </div>

    </div>
  );
}
