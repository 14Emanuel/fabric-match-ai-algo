import React, { useState } from 'react';
import { UserPreferenceProfile, Garment } from '../types';
import { evaluateGarmentMatch } from '../utils/matchingEngine';
import { Sparkles, X, Loader2, CheckCircle2, AlertCircle, ArrowRight, BookOpen } from 'lucide-react';

interface FabricInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserPreferenceProfile;
  onAddGarmentToCatalog: (garment: Garment) => void;
}

const PRESET_SNIPPETS = [
  {
    name: 'LinkedIn Post Style Floral Dress',
    text: 'A stunning strapless corset midi dress in ivory with vibrant pink floral placement print. Crafted from 100% crisp organic cotton poplin (185 GSM). Fully lined with 100% breathable cotton voile lining so it is completely opaque in direct daylight. Features reinforced boned bodice, side-seam pockets, and machine washable cold.',
  },
  {
    name: 'Fast-Fashion Sheer Poly Maxi',
    text: 'Ethereal romantic tier maxi dress in 100% polyester chiffon. Lightweight floaty design with ruched sweetheart bust with light jersey padding. Skirt is unlined and semi-sheer. Dry clean only. Imported.',
  },
  {
    name: 'Eco Everyday Ribbed Wrap',
    text: 'Comfy everyday ribbed midi wrap dress. 95% Tencel Modal, 5% Elastane. Four-way stretch interlock knit, super soft against sensitive skin, non-see-through, gentle machine wash tumble dry low.',
  },
];

export const FabricInspectorModal: React.FC<FabricInspectorModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onAddGarmentToCatalog,
}) => {
  const [inputText, setInputText] = useState(PRESET_SNIPPETS[0].text);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedGarment, setExtractedGarment] = useState<Garment | null>(null);
  const [sourceEngine, setSourceEngine] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExtract = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/extract-fabric', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productText: inputText }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      setSourceEngine(data.source || 'Extraction Engine');

      const newGarment: Garment = {
        id: `extracted-${Date.now()}`,
        title: data.title || 'Inspected Garment',
        brand: 'Analyzed Item',
        price: 120,
        category: 'Dress',
        imageUrl:
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
        description: inputText,
        fabric: {
          fiberComposition: data.fiberComposition || { cotton: 100 },
          fiberCategory: data.fiberCategory || 'natural',
          weightGsm: data.weightGsm || 180,
          weightCategory: data.weightCategory || 'midweight',
          weaveType: data.weaveType || 'Plain Weave',
          opacityScore: data.opacityScore ?? 8,
          sheernessDescription: data.sheernessDescription || 'Standard daywear opacity.',
          lining: data.lining || 'none',
          liningMaterial: data.liningMaterial,
          stretchLevel: data.stretchLevel || 'none',
          stretchPercent: data.stretchPercent ?? 0,
          breathability: data.breathability ?? 7,
          careType: data.careType || 'machine_washable',
          wrinkleResistance: data.wrinkleResistance || 'moderate',
        },
        constructionHighlights: data.constructionHighlights || [],
      };

      setExtractedGarment(newGarment);
    } catch (err: any) {
      setError(err.message || 'Failed to extract fabric specifications');
    } finally {
      setIsLoading(false);
    }
  };

  const evalResult = extractedGarment
    ? evaluateGarmentMatch(extractedGarment, currentProfile)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                AI Fabric & Garment Extractor
              </h3>
              <p className="text-xs text-stone-500">
                Paste any product description to parse fabric specs and match against {currentProfile.name}
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

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Quick Presets */}
          <div>
            <span className="text-xs font-semibold text-stone-600 mb-2 block">
              Quick test snippets:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_SNIPPETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(preset.text);
                    setExtractedGarment(null);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors border border-stone-200/80"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1.5">
              Product Description / Care Tag Text:
            </label>
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. Strapless floral dress in 100% cotton poplin with full cotton lining, machine wash..."
              className="w-full text-xs p-3.5 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-hidden font-mono leading-relaxed"
            />
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleExtract}
              disabled={isLoading || !inputText.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-50 transition-all shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  Extracting Textile Metrics...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Run Extraction & Match Scoring
                </>
              )}
            </button>

            {sourceEngine && (
              <span className="text-[11px] font-mono text-stone-500 bg-stone-100 px-2.5 py-1 rounded-md">
                Engine: {sourceEngine}
              </span>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Result Inspection */}
          {extractedGarment && evalResult && (
            <div className="mt-4 p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Calculated Result for {currentProfile.name}
                  </span>
                  <h4 className="font-serif font-bold text-base text-stone-900">
                    {extractedGarment.title}
                  </h4>
                </div>
                <div className="text-right">
                  <div
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-sm font-bold ${
                      evalResult.totalScore >= 80
                        ? 'bg-emerald-100 text-emerald-800'
                        : evalResult.totalScore >= 50
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    <span>{evalResult.totalScore}% Match</span>
                  </div>
                  <span className="text-[10px] font-medium text-stone-500 block mt-0.5">
                    {evalResult.grade}
                  </span>
                </div>
              </div>

              {/* Extracted Textile Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2 bg-white rounded-lg border border-stone-200/60">
                  <span className="text-[10px] text-stone-400 block">Composition</span>
                  <span className="font-semibold text-stone-800">
                    {Object.entries(extractedGarment.fabric.fiberComposition)
                      .map(([f, p]) => `${p}% ${f}`)
                      .join(', ')}
                  </span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-stone-200/60">
                  <span className="text-[10px] text-stone-400 block">Opacity / Sheerness</span>
                  <span className="font-semibold text-stone-800">
                    {extractedGarment.fabric.opacityScore}/10 (
                    {extractedGarment.fabric.opacityScore >= 8 ? 'Opaque' : 'Sheer'})
                  </span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-stone-200/60">
                  <span className="text-[10px] text-stone-400 block">Lining</span>
                  <span className="font-semibold text-stone-800 capitalize">
                    {extractedGarment.fabric.lining.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-stone-200/60">
                  <span className="text-[10px] text-stone-400 block">Breathability</span>
                  <span className="font-semibold text-stone-800">
                    {extractedGarment.fabric.breathability}/10
                  </span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-stone-200/60">
                  <span className="text-[10px] text-stone-400 block">Stretch</span>
                  <span className="font-semibold text-stone-800">
                    {extractedGarment.fabric.stretchLevel} ({extractedGarment.fabric.stretchPercent}%)
                  </span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-stone-200/60">
                  <span className="text-[10px] text-stone-400 block">Care</span>
                  <span className="font-semibold text-stone-800 capitalize">
                    {extractedGarment.fabric.careType.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Verdict Summary */}
              <div className="p-3 bg-white rounded-xl border border-stone-200/60 text-xs">
                <span className="font-bold text-stone-800 block mb-0.5">
                  Transparency Summary:
                </span>
                <p className="text-stone-600 leading-relaxed">{evalResult.verdictReason}</p>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    onAddGarmentToCatalog(extractedGarment);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 text-stone-900 hover:bg-amber-400 transition-colors shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Add to Active Catalog Demo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
