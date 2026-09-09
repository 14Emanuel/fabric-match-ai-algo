import React from 'react';
import { X, CheckCircle2, ShieldCheck, Cpu, Database, Eye, Sparkles, BookOpen } from 'lucide-react';

interface AlgorithmExplainerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlgorithmExplainer: React.FC<AlgorithmExplainerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-amber-300 flex items-center justify-center font-bold">
              ∑
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Algorithm & ML Architecture
              </h3>
              <p className="text-xs text-stone-500">
                How the Garment Preference Matching Engine works under the hood
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-stone-800 text-xs leading-relaxed">
          {/* 1. Problem Statement */}
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/70">
            <h4 className="font-bold text-amber-900 text-sm mb-1 flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-700" />
              The LinkedIn Problem: "No Detective Work Needed"
            </h4>
            <p className="text-amber-800 text-xs">
              Shoppers typically experience cognitive overload trying to deduce whether a dress is
              see-through in sunlight, made of sweat-trapping synthetic fibers, lacks lining, or
              requires expensive dry cleaning. The algorithm replaces manual inspection with an
              automated, transparent compatibility score.
            </p>
          </div>

          {/* 2. The 3-Tier Pipeline */}
          <div>
            <h4 className="font-serif font-bold text-stone-900 text-sm mb-3">
              1. System Architecture Pipeline
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
                <div className="w-6 h-6 rounded-md bg-stone-900 text-white flex items-center justify-center text-xs font-bold mb-2">
                  1
                </div>
                <h5 className="font-bold text-stone-900 mb-1">Catalog Ingestion (NLP / LLM)</h5>
                <p className="text-[11px] text-stone-600">
                  Extracts structured textile attributes (GSM, % blend, opacity index, lining type, care)
                  from unstructured product tags using Gemini 2.5 Flash with strict JSON Schema.
                </p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
                <div className="w-6 h-6 rounded-md bg-stone-900 text-white flex items-center justify-center text-xs font-bold mb-2">
                  2
                </div>
                <h5 className="font-bold text-stone-900 mb-1">Constraint Filtering</h5>
                <p className="text-[11px] text-stone-600">
                  Enforces non-negotiable hard constraints (e.g., fabric allergies, dry-clean avoidance)
                  to immediately disqualify or penalize hazardous garments.
                </p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
                <div className="w-6 h-6 rounded-md bg-stone-900 text-white flex items-center justify-center text-xs font-bold mb-2">
                  3
                </div>
                <h5 className="font-bold text-stone-900 mb-1">Weighted Compatibility Scoring</h5>
                <p className="text-[11px] text-stone-600">
                  Computes multi-attribute utility based on personalized shopper priorities (thermal
                  comfort, opacity standards, mobility, lining).
                </p>
              </div>
            </div>
          </div>

          {/* 3. Mathematical Formula */}
          <div>
            <h4 className="font-serif font-bold text-stone-900 text-sm mb-2">
              2. Mathematical Formulation
            </h4>
            <div className="p-4 bg-stone-900 text-stone-100 rounded-2xl font-mono text-xs space-y-2">
              <div className="text-amber-300 font-bold">
                CompatibilityScore(u, g) = (∑ [w_i × S_i(p_ui, a_gi)]) - HardPenalty
              </div>
              <div className="text-[11px] text-stone-400 space-y-1 pt-1 border-t border-stone-800">
                <p>• <strong>w_i</strong>: User importance weight for criterion i (sum(w_i) = 1.0)</p>
                <p>• <strong>S_i</strong>: Normalized similarity function between user preference p_u and garment attribute a_g (0–100)</p>
                <p>• <strong>HardPenalty</strong>: Deducts 60–90 points if restricted fibers (e.g., polyester for eczema) or forbidden care types are found</p>
              </div>
            </div>
          </div>

          {/* 4. Scalable Machine Learning Extensions */}
          <div>
            <h4 className="font-serif font-bold text-stone-900 text-sm mb-2">
              3. Production ML Algorithms for Scale
            </h4>
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl border border-stone-200 flex items-start gap-3">
                <Cpu className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-stone-900 text-xs">
                    Multi-Modal Vision: Fashion-CLIP / Vision Transformers (ViT)
                  </h5>
                  <p className="text-[11px] text-stone-600">
                    Product photos often convey texture, weave density, and sheer hems that text omits.
                    Fashion-CLIP embeds image crops of fabric close-ups and models transparency detection
                    directly from daylight lighting backscatter.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-stone-200 flex items-start gap-3">
                <Database className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-stone-900 text-xs">
                    Two-Tower Neural Recommender (User & Item Towers)
                  </h5>
                  <p className="text-[11px] text-stone-600">
                    Learns low-dimensional representations of shopper tactile preference vectors
                    alongside catalog item embeddings, optimizing against return log signals (e.g.,
                    penalty signals whenever an item is returned for "scratchy fabric" or "see-through").
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-stone-200 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-stone-900 text-xs">
                    Explainable AI & Natural Language Verification
                  </h5>
                  <p className="text-[11px] text-stone-600">
                    Instead of a mysterious recommendation percentage, generates a 1-sentence plain-English
                    proof badge (e.g., "Verified Opaque with 100% Breathable Cotton Voile Lining").
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors"
          >
            Close Explainer
          </button>
        </div>
      </div>
    </div>
  );
};
