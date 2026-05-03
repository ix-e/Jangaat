"use client";

import Link from "next/link";
import Image from "next/image";
import { Bug, Brain, ArrowRight, Terminal } from "lucide-react";
import { useEffect, useState } from "react";

// Composant pour l'effet Voie Lactée (Étoiles scintillantes)
const StarryBackground = () => {
  const [stars, setStars] = useState<{ id: number, top: string, left: string, size: string, delay: string, duration: string, opacity: number }[]>([]);

  useEffect(() => {
    // Génère les étoiles côté client pour éviter les erreurs d'hydratation (différences serveur/client)
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
      {/* Nébuleuse subtile */}
      <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-purple-900/20 blur-[150px]"></div>
      <div className="absolute top-[30%] -right-[10%] w-[60%] h-[60%] rounded-full bg-fuchsia-900/10 blur-[150px]"></div>
      
      {/* Étoiles scintillantes */}
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

export default function Home() {
  return (
    <div className="min-h-screen text-slate-50 font-sans selection:bg-purple-500/30 relative flex flex-col overflow-hidden">
      
      <StarryBackground />

      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Jangaat Logo" width={32} height={32} className="rounded-md" />
          <span className="font-bold text-2xl tracking-widest text-slate-100">JANGAAT</span>
        </div>
        <Link href="/session" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
          Commencer
        </Link>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-24 flex flex-col items-center text-center flex-grow">
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          Transforme ta manière de penser <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.3)]">
            quand tu codes.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-14 leading-relaxed font-light">
          Jangaat aide les développeurs à structurer leur raisonnement face à un bug. 
          Notre IA <strong className="text-fuchsia-300 font-semibold">JOOB Sensei</strong> analyse votre démarche scientifique et vous guide sans jamais donner la solution toute faite.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/session" 
            className="group relative flex items-center gap-3 bg-white text-[#070b19] px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(192,132,252,0.3)] hover:shadow-[0_0_40px_rgba(192,132,252,0.5)] overflow-hidden">
            <span className="relative z-10">Démarrer une session avec JOOB Sensei</span>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            {/* Hover effect background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-fuchsia-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
        </div>

        {/* Features / Value Prop */}
        <div className="grid md:grid-cols-2 gap-8 mt-32 w-full max-w-4xl text-left">
          <div className="bg-slate-900/30 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-slate-700/50 flex flex-col items-start hover:border-fuchsia-500/50 transition-colors group">
            <div className="bg-rose-500/10 p-4 rounded-xl mb-6 text-rose-400 border border-rose-500/20 group-hover:scale-110 transition-transform">
              <Bug size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-100">Fini les tests au hasard</h3>
            <p className="text-slate-400 leading-relaxed font-light">
              Prenez du recul sur votre code. Ne perdez plus des heures à tester des modifications sans comprendre la cause racine de votre bug.
            </p>
          </div>

          <div className="bg-slate-900/30 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-slate-700/50 flex flex-col items-start hover:border-purple-500/50 transition-colors group">
            <div className="bg-purple-500/10 p-4 rounded-xl mb-6 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <Brain size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-100">Une IA Mentor, pas un solveur</h3>
            <p className="text-slate-400 leading-relaxed font-light">
              Notre moteur analyse vos hypothèses et vos tests pour détecter les failles logiques dans votre raisonnement, et vous pose LA bonne question.
            </p>
          </div>
        </div>

      </main>

      <div className="fixed bottom-8 right-8 z-50 opacity-40 hover:opacity-80 transition-opacity select-none pointer-events-none">
        <Image src="/logo.png" alt="Jangaat Logo" width={56} height={56} className="rounded-xl shadow-2xl" />
      </div>

    </div>
  );
}
