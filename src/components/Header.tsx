import React from 'react';
import { Sparkles, ShieldCheck, Cpu, HelpCircle, RefreshCw } from 'lucide-react';

interface HeaderProps {
  hasGeminiKey: boolean;
  onOpenExplainer: () => void;
  onOpenInspector: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  hasGeminiKey,
  onOpenExplainer,
  onOpenInspector,
}) => {
  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-200 flex items-center justify-center font-serif text-xl font-bold shadow-sm ring-1 ring-stone-900/10">
            F
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-stone-900 font-serif">
                FabricMatch AI
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200/60">
                Garment Transparency Engine
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Eliminating online shopping detective work with multi-attribute fabric matching
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* API Status Badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              hasGeminiKey
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
            title={
              hasGeminiKey
                ? 'Gemini 2.5 Flash connected for real-time spec extraction'
                : 'Running on high-precision deterministic textile heuristic engine (Gemini key can be configured in Settings > Secrets)'
            }
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{hasGeminiKey ? 'Gemini 2.5 Flash Active' : 'Textile Engine Active'}</span>
          </div>

          {/* Test Custom Text */}
          <button
            onClick={onOpenInspector}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 text-stone-50 hover:bg-stone-800 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Inspect Any Garment Description
          </button>

          {/* How Algorithm Works */}
          <button
            onClick={onOpenExplainer}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors border border-stone-200"
          >
            <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
            Algorithm Architecture
          </button>
        </div>
      </div>
    </header>
  );
};
