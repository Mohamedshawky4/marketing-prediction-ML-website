import PredictionForm from '@/components/PredictionForm';
import { Shield, Zap, Target, Cpu } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen relative bg-[#050505] overflow-hidden bg-grid">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/20 blur-[120px] rounded-full" />

      {/* Animated Scan Line */}
      <div className="scan-line" />

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header Section */}
        <header className="flex flex-col items-center text-center mb-16 space-y-4">
          <div className="flex items-center gap-4 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs font-mono tracking-widest text-cyan-400 mb-4 uppercase">
            <Cpu size={14} className="animate-pulse" /> Final Project | Neural Marketing Engine
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
            ENGINEERING <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent italic">
              PERFORMANCE
            </span>
          </h1>

          <p className="max-w-xl text-gray-500 text-lg">
            High-precision predictive intelligence for term deposit subscriptions.
            Powered by an Optimized Voting Ensemble with 90%+ Accuracy.
          </p>
        </header>

        {/* Feature Tickers */}
        <div className="flex flex-wrap justify-center gap-8 mb-20">
          {[
            { icon: <Shield size={18} />, label: "Privacy Ensured", color: "text-green-500" },
            { icon: <Zap size={18} />, label: "Zero-Lag Inference", color: "text-amber-500" },
            { icon: <Target size={18} />, label: "90% Precision", color: "text-cyan-500" },
          ].map((f, i) => (
            <div key={i} className={`flex items-center gap-2 px-4 py-2 glass-card rounded-xl text-sm font-medium ${f.color}`}>
              {f.icon} {f.label}
            </div>
          ))}
        </div>

        {/* The Form */}
        <PredictionForm />

        {/* Footer info */}
        <footer className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600">
          <div className="text-sm font-light">
            © 2025 Machine Learning Final Project | <span className="text-gray-400">Bank Marketing System</span>
          </div>
          <div className="flex items-center gap-8 text-xs font-mono">
            <span className="hover:text-cyan-400 transition-colors">VERSION 2.0.4 - RELEASED</span>
            <span className="hover:text-purple-400 transition-colors">STABILITY: 100%</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
